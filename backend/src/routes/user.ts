import { Router } from "express";
import axios from "axios";

const router = Router();
const EXPLORER_API = "https://testnet.arcscan.app/api";

// GET /api/user/:address/history
router.get("/:address/history", async (req, res) => {
    try {
        const { address } = req.params;

        const tokenTxRes = await axios.get(
            `${EXPLORER_API}?module=account&action=tokentx&address=${address}&sort=desc`
        );

        let txs: any[] = [];
        if (tokenTxRes.data.status === "1") {
            txs = tokenTxRes.data.result.filter((tx: any) => {
                const sym = (tx.tokenSymbol || "").toUpperCase();
                return sym === "USDC" || sym === "EURC";
            });
        }

        // Sort desc by timeStamp, limit to 100
        const result = txs
            .sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp))
            .slice(0, 100);

        res.json({ success: true, data: result });
    } catch (error: any) {
        console.error("DEBUG: Failed to fetch history:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch transaction history from ArcScan" });
    }
});

// GET /api/user/:address/nfts
router.get("/:address/nfts", async (req, res) => {
    try {
        const { address } = req.params;
        const url = `${EXPLORER_API}?module=account&action=tokenlist&address=${address}`;
        console.log("DEBUG: Fetching NFTs from:", url);
        const response = await axios.get(url);
        console.log("DEBUG: ArcScan NFT Response Status:", response.data.status, response.data.message);

        if (response.data.status === "1") {
            const nfts = response.data.result.filter((t: any) =>
                t.type === "ERC-721" || t.type === "ERC-1155"
            );
            res.json({ success: true, data: nfts });
        } else {
            res.json({ success: true, data: [], message: response.data.message });
        }
    } catch (error: any) {
        console.error("DEBUG: Failed to fetch NFTs:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch NFTs from ArcScan" });
    }
});

// GET /api/user/:address/tokens — Token balances (USDC, EURC)
router.get("/:address/tokens", async (req, res) => {
    try {
        const { address } = req.params;
        const url = `${EXPLORER_API}?module=account&action=tokenlist&address=${address}`;
        const response = await axios.get(url);

        if (response.data.status === "1") {
            const stablecoins = response.data.result.filter((t: any) => {
                const sym = (t.symbol || "").toUpperCase();
                return sym === "USDC" || sym === "EURC";
            });
            res.json({ success: true, data: stablecoins });
        } else {
            res.json({ success: true, data: [] });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to fetch token balances" });
    }
});

import { ARC_SYSTEM_PROMPT } from "../constants/agent_templates";
import { projects } from "../data/projects";

router.post("/agent/chat", async (req, res) => {
    try {
        const { message, address, history = [] } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const JATEVO_API_KEY = process.env.JATEVO_API_KEY;
        
        console.log(`[ArcBot] Request from: ${address || "anonymous"}`);

        if (!JATEVO_API_KEY || JATEVO_API_KEY === "your_jatevo_api_key_here") {
            return res.status(503).json({ success: false, message: "AI service not configured." });
        }

        // Fetch live wallet context if address is provided
        let walletContext = "";
        if (address && address.startsWith("0x")) {
            try {
                const [tokenRes, histRes] = await Promise.allSettled([
                    axios.get(`${EXPLORER_API}?module=account&action=tokenlist&address=${address}`, { timeout: 8000 }),
                    axios.get(`${EXPLORER_API}?module=account&action=tokentx&address=${address}&sort=desc`, { timeout: 8000 }),
                ]);

                const balances: string[] = [];
                if (tokenRes.status === "fulfilled" && tokenRes.value.data.status === "1") {
                    tokenRes.value.data.result.forEach((t: any) => {
                        const sym = (t.symbol || "").toUpperCase();
                        if (sym === "USDC" || sym === "EURC") {
                            const decimals = Number(t.decimals || 6);
                            const amount = (Number(t.balance) / 10 ** decimals).toFixed(4);
                            balances.push(`${sym}: ${amount}`);
                        }
                    });
                }

                const recentTxs: string[] = [];
                if (histRes.status === "fulfilled" && histRes.value.data.status === "1") {
                    histRes.value.data.result.slice(0, 5).forEach((tx: any) => {
                        const sym = (tx.tokenSymbol || "").toUpperCase();
                        const dir = tx.from?.toLowerCase() === address.toLowerCase() ? "Sent" : "Received";
                        const decimals = Number(tx.tokenDecimal || 6);
                        const amount = (Number(tx.value) / 10 ** decimals).toFixed(4);
                        const date = new Date(Number(tx.timeStamp) * 1000).toLocaleDateString();
                        recentTxs.push(`- ${dir} ${amount} ${sym} on ${date}`);
                    });
                }

                walletContext = `\n\n--- CONNECTED WALLET CONTEXT ---\nAddress: ${address}\n${balances.length > 0 ? `Balances:\n${balances.map(b => `- ${b}`).join("\n")}` : "No USDC/EURC balance found."}\n${recentTxs.length > 0 ? `Recent Transactions (last 5):\n${recentTxs.join("\n")}` : "No recent USDC/EURC transactions found."}`;
            } catch (e) {
                walletContext = `\n\n--- WALLET ---\nAddress: ${address} (Could not fetch live data)`;
            }
        }

        // Fetch live project data from database/file
        const projectContext = `\n\n--- ARC SHOWCASE PROJECTS (OFFICIAL CONTEXT) ---\n${projects.map(p => `- ${p.name}:\n  Mission: ${p.description}\n  Category: ${p.category}\n  Verification: [Forum: ${p.forumUrl || 'N/A'}, X: ${p.twitterUrl || 'N/A'}]`).join("\n")}`;

        // Build messages for Jatevo
        const systemContent = ARC_SYSTEM_PROMPT + projectContext + walletContext;
        const messages = [
            { role: "system", content: systemContent },
            ...history.slice(-10).map((m: any) => ({ role: m.role, content: m.content })),
            { role: "user", content: message },
        ];

        // Call Jatevo API (OpenAI-compatible)
        console.log(`[ArcBot] Calling Jatevo with ${messages.length} messages...`);
        const response = await axios.post(
            "https://inference.jatevo.id/v1/chat/completions",
            {
                model: "glm-4.7",
                messages: messages,
                stream: false,
                max_tokens: 1500, // Explicitly set to prevent truncation mid-sentence
                temperature: 0.7, // Add temperature for balanced output
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JATEVO_API_KEY}`,
                },
                timeout: 90000, // Increased to 90s for safety
            }
        );
        console.log(`[ArcBot] Jatevo response received in ${response.headers['x-request-time'] || 'unknown'}ms`);

        const reply = response.data?.choices?.[0]?.message?.content?.trim() || "Sorry, no response from AI. Please try again.";
        res.json({ success: true, reply });

    } catch (error: any) {
        // Detailed logging to find out EXACTLY what Jatevo says
        const errorData = error.response?.data;
        console.error("ArcBot API Error:", {
            status: error.response?.status,
            data: errorData,
            message: error.message
        });
        
        if (error.response?.status === 401) {
            return res.status(401).json({ success: false, message: "API key invalid. Check JATEVO_API_KEY in backend .env." });
        }

        // If data has a specific error message, use it
        const customMsg = errorData?.error?.message || errorData?.message || "An error occurred while communicating with the AI service.";
        res.status(500).json({ success: false, message: customMsg });
    }
});




export default router;

