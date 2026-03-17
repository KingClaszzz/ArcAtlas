import { useState, useCallback } from 'react';
import { formatUnits } from 'viem';
import { createPublicClient, http } from 'viem';
import { arcTestnet } from '@/lib/wagmi';

const USDC_ADDRESS = '0x3600000000000000000000000000000000000000' as const;
const EURC_ADDRESS = '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a' as const;

// Still need viem for quick balance reads if backend is slow, 
// but we'll prioritize backend for history to avoid RPC limits.
const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http()
});

export interface WalletTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  symbol: string;
  blockNumber: bigint;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useWalletStats() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    usdc: string;
    eurc: string;
    txs: WalletTx[];
  } | null>(null);

  const fetchStats = useCallback(async (address: string) => {
    if (!address.startsWith('0x')) return;
    const addr = address as `0x${string}`;
    
    setLoading(true);
    try {
      // 1. Fetch Balances (Using viem for speed as it's a simple readContract)
      const [usdcBalance, eurcBalance] = await Promise.all([
        publicClient.readContract({
          address: USDC_ADDRESS,
          abi: [{ name: 'balanceOf', type: 'function', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] }],
          functionName: 'balanceOf',
          args: [addr]
        }).catch(() => 0n),
        publicClient.readContract({
          address: EURC_ADDRESS,
          abi: [{ name: 'balanceOf', type: 'function', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] }],
          functionName: 'balanceOf',
          args: [addr]
        }).catch(() => 0n)
      ]);

      // 2. Fetch History from Backend (Proxies to ArcScan)
      // This is MUCH more reliable than raw RPC getLogs for history.
      const historyRes = await fetch(`${API_URL}/api/user/${address}/history`);
      const historyData = await historyRes.json();
      
      let txs: WalletTx[] = [];
      if (historyData.success && Array.isArray(historyData.data)) {
        txs = historyData.data.slice(0, 5).map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: formatUnits(BigInt(tx.value || 0), Number(tx.tokenDecimal || 6)),
          symbol: (tx.tokenSymbol || "").toUpperCase(),
          blockNumber: BigInt(tx.blockNumber || 0)
        }));
      }

      setData({
        usdc: formatUnits(usdcBalance, 6),
        eurc: formatUnits(eurcBalance, 6),
        txs
      });
    } catch (err) {
      console.error('Fetch wallet stats failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchStats, loading, data };
}
