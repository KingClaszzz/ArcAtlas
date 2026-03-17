// src/components/Providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config, arcTestnet } from "@/lib/wagmi";
import { useState } from "react";
import { createWeb3Modal } from '@web3modal/wagmi/react';

// Setup queryClient
const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "d685ab98531d33fd94fa2fb1ac8e93e2";

// Prevent multiple initializations in development (HMR)
let modalInitialized = false;
if (typeof window !== 'undefined' && !modalInitialized) {
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    defaultChain: arcTestnet,
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#10b981', // emerald-500
    }
  });
  modalInitialized = true;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => queryClient);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
