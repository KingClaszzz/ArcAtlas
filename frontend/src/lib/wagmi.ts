// src/lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { metaMask, walletConnect } from "wagmi/connectors";
import { defineChain } from "viem";

// ─── Arc Testnet chain definition ─────────────────────────────────────────────
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_ARC_RPC_URL || "https://rpc.testnet.arc.network"
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
});

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "d685ab98531d33fd94fa2fb1ac8e93e2";

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [arcTestnet.id]: http(),
  },
});
