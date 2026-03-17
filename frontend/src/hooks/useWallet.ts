// src/hooks/useWallet.ts
"use client";

import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from "wagmi";
import { arcTestnet } from "@/lib/wagmi";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api";
axios.defaults.withCredentials = true;

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const chainId = useChainId();

  const [user, setUser] = useState<{ address: string } | null>(null);

  const { data: balance } = useBalance({
    address,
    query: { enabled: !!address },
  });

  // Simplified "Login": Just set the user if address exists
  useEffect(() => {
    if (address) {
      setUser({ address });
      // Tell backend who we are (simplest way without SIWE)
      axios.defaults.headers.common['x-wallet-address'] = address;
    } else {
      setUser(null);
      delete axios.defaults.headers.common['x-wallet-address'];
    }
  }, [address]);

  const logout = () => {
    setUser(null);
    wagmiDisconnect();
  };

  const isWrongNetwork = isConnected && chainId !== arcTestnet.id;

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const formattedBalance = balance
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : null;

  return {
    address,
    shortAddress,
    isConnected,
    isConnecting: isConnecting || isPending,
    isWrongNetwork,
    balance: formattedBalance,
    connect,
    disconnect: logout,
    connectors,
    user,
    isLoggedIn: !!address, // Simple check
  };
}
