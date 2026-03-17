// src/routes/network.ts
import { Router, Request, Response } from "express";

const router = Router();

// Arc network config — update these when Arc publishes official RPC
const ARC_NETWORK = {
  chainId: "0x" + (6827).toString(16), // Arc Testnet Chain ID (example, update to real)
  chainName: "Arc Testnet",
  rpcUrls: ["https://rpc.arc-testnet.example.com"], // Replace with real RPC
  nativeCurrency: {
    name: "Arc",
    symbol: "ARC",
    decimals: 18,
  },
  blockExplorerUrls: ["https://explorer.arc-testnet.example.com"],
};

// GET /api/network — return Arc network config for MetaMask
router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, data: ARC_NETWORK });
});

export default router;
