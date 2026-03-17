// src/data/projects.ts
export interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  url: string;
  imageUrl?: string;
  twitterUrl?: string;
  forumUrl?: string;
  tags: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Tower Exchange",
    description: "Swap tokens instantly with deep liquidity pools on Arc network. Optimized for sub-second finality and low-slippage trades.",
    category: "DEX",
    url: "https://tower.exchange",
    twitterUrl: "https://x.com/TowerExchange",
    forumUrl: "https://forum.arc.network/t/tower-exchange-launch/1",
    tags: ["swap", "liquidity", "defi"],
    featured: true,
  },
  {
    id: 2,
    name: "Arc Bridge",
    description: "Bridge assets seamlessly between Arc and other EVM-compatible networks with unified stablecoin liquidity.",
    category: "Bridge",
    url: "#",
    twitterUrl: "https://x.com/ArcBridge",
    forumUrl: "https://forum.arc.network/t/arc-bridge-protocol/2",
    tags: ["bridge", "cross-chain"],
    featured: true,
  },
  {
    id: 3,
    name: "Arc Faucet",
    description: "Get test tokens for development and testing on Arc Testnet. Quick and easy access to USDC/EURC.",
    category: "Tools",
    url: "#",
    twitterUrl: "https://x.com/CircleDev",
    forumUrl: "https://forum.arc.network/t/official-testnet-faucet/3",
    tags: ["faucet", "testnet", "dev"],
    featured: false,
  },
  {
    id: 4,
    name: "Arc NFT Market",
    description: "Mint, buy and sell unique digital collectibles on the Arc chain. Low-fee marketplace with instant settlement.",
    category: "NFT",
    url: "#",
    twitterUrl: "https://x.com/ArcNFT",
    forumUrl: "https://forum.arc.network/t/nft-market-beta/4",
    tags: ["nft", "marketplace", "mint"],
    featured: true,
  },
  {
    id: 5,
    name: "ArcLend",
    description: "Borrow and lend digital assets at competitive rates. Over-collateralized lending protocol powered by USDC.",
    category: "DeFi",
    url: "#",
    twitterUrl: "https://x.com/ArcLend",
    forumUrl: "https://forum.arc.network/t/arclend-protocol-overview/5",
    tags: ["lending", "borrow", "defi"],
    featured: false,
  },
  {
    id: 6,
    name: "ArcScan",
    description: "Block explorer to track transactions, wallets and smart contracts with sub-second visibility.",
    category: "Tools",
    url: "#",
    twitterUrl: "https://x.com/ArcScan",
    forumUrl: "https://forum.arc.network/t/arcscan-block-explorer/6",
    tags: ["explorer", "analytics"],
    featured: false,
  },
  {
    id: 7,
    name: "YieldArc",
    description: "Automated yield strategies to maximize your crypto earnings on the Arc network ecosystem.",
    category: "DeFi",
    url: "#",
    twitterUrl: "https://x.com/YieldArc",
    forumUrl: "https://forum.arc.network/t/yieldarc-strategies/7",
    tags: ["yield", "farming", "defi"],
    featured: false,
  },
  {
    id: 8,
    name: "ArcID",
    description: "Decentralized identity and profile system built natively on Arc for a unified Web3 experience.",
    category: "Social",
    url: "#",
    twitterUrl: "https://x.com/ArcID",
    forumUrl: "https://forum.arc.network/t/arcid-social-protocol/8",
    tags: ["identity", "profile", "social"],
    featured: false,
  },
  {
    id: 9,
    name: "ArcTest",
    description: "Official testnet resources for Arc network. Essential for developers and community testing.",
    category: "Tools",
    url: "#",
    twitterUrl: "https://x.com/ArcNetwork",
    forumUrl: "https://forum.arc.network/t/testnet-onboarding/9",
    tags: ["testnet", "dev"],
    featured: false,
  },
];
