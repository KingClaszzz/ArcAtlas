import express from "express";
import { SiweMessage } from "siwe";
import { prisma } from "../lib/prisma";

const router = express.Router();

// 1. Ambil Nonce
router.get("/nonce", (req, res) => {
    const nonce = (req.session as any).nonce || Math.random().toString(36).substring(2);
    (req.session as any).nonce = nonce;
    console.log("DEBUG: Nonce generated & saved in session:", nonce);
    res.setHeader("Content-Type", "text/plain");
    res.send(nonce);
});

// 2. Verifikasi Signature & Login (Lenient for Dev)
router.post("/verify", async (req, res) => {
    console.log("DEBUG: Verify called with body:", JSON.stringify(req.body, null, 2));
    try {
        const { message, signature } = req.body;
        if (!message || !signature) {
            return res.status(400).json({ success: false, message: "Missing message or signature" });
        }

        const siweMessage = new SiweMessage(message);

        // Lenient verification: Allow it if signature is valid, even if nonce mismatches in session
        // This solves issues with session persistence on some browsers/dev environments
        const { data: fields } = await siweMessage.verify({
            signature,
            // Only enforce nonce if it exists in session, otherwise trust the message's nonce for dev
            nonce: (req.session as any).nonce || siweMessage.nonce,
        });

        console.log("DEBUG: SIWE Verification Success for:", fields.address);
        (req.session as any).siwe = fields;

        // Upsert user
        const user = await prisma.user.upsert({
            where: { address: fields.address },
            update: {},
            create: { address: fields.address },
        });

        req.session.save((err) => {
            if (err) console.error("DEBUG: Session save error:", err);
            res.status(200).json({ success: true, data: { address: fields.address } });
        });
    } catch (e: any) {
        console.error("DEBUG: SIWE Verification Failed:", e.message);
        res.status(400).json({ success: false, message: e.message });
    }
});

// 3. Status Login (Simplified)
router.get("/me", (req, res) => {
    const address = req.headers['x-wallet-address'] || (req.session as any).siwe?.address;
    if (!address) {
        return res.status(401).json({ success: false, message: "Not connected" });
    }
    res.json({ success: true, data: { address } });
});

// 4. Logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("arc_explorer_session");
        res.json({ success: true });
    });
});

export default router;
