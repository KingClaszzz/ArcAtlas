"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useTransfer } from "@/hooks/useTransfer";
import { useWalletStats, WalletTx } from "@/hooks/useWalletStats";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/styles/ArcAgent.css";

// UI Components
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BotIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <div 
    className={`ab-bot-avatar ${className}`} 
    style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden' }}
  >
    <img src="/arlor.jpg" alt="ArcBot" className="w-full h-full object-cover" />
  </div>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Suggested Questions ────────────────────────────────────────────────────
const LANDING_SUGGESTIONS = [
  { icon: "⬡", text: "What is Arc Network?" },
  { icon: "◎", text: "How do I get testnet USDC?" },
  { icon: "◇", text: "What is the USDC contract address?" },
  { icon: "◈", text: "How to join the Arc ecosystem?" },
];

const WALLET_SUGGESTIONS = [
  { icon: "◈", text: "How to check another wallet's portfolio?" },
  { icon: "◎", text: "How does the AI Transaction Agent work?" },
  { icon: "◇", text: "What are the core goals of Arc Explorer?" },
  { icon: "⬡", text: "Show me the latest ecosystem statistics" },
];

interface Msg { role: "user" | "assistant"; content: string; }

function TypingDots() {
  return (
    <div className="ab-msg ab-msg--bot">
      <div className="ab-msg-ava"><BotIcon size={12} /></div>
      <div className="ab-msg-body">
        <span className="ab-msg-label">ArcBot</span>
        <div className="ab-dots"><span /><span /><span /></div>
      </div>
    </div>
  );
}

// ── Wallet Stats Card ──────────────────────────────────────────────────────
function WalletStatsCard({ address }: { address: string }) {
  const { fetchStats, loading, data } = useWalletStats();

  useEffect(() => {
    fetchStats(address);
  }, [address, fetchStats]);

  if (loading) return (
    <div className="ab-stats-card ab-stats-loading">
      <div className="ab-spinner"></div>
      <span>Scanning network...</span>
    </div>
  );

  if (!data) return null;

  return (
    <div className="ab-stats-card">
      <div className="ab-stats-header">
        <span className="ab-stats-title">Wallet Portfolio</span>
        <span className="ab-stats-addr">{address.slice(0, 6)}...{address.slice(-4)}</span>
      </div>
      
      <div className="ab-stats-grid">
        <div className="ab-stat-item">
          <span className="ab-stat-label">USDC</span>
          <span className="ab-stat-val">{data.usdc}</span>
        </div>
        <div className="ab-stat-item">
          <span className="ab-stat-label">EURC</span>
          <span className="ab-stat-val">{data.eurc}</span>
        </div>
      </div>

      <div className="ab-stats-txs">
        <span className="ab-stats-subtitle">Latest Transactions</span>
        {data.txs.length === 0 ? (
          <div className="ab-stats-empty">No recent transfers found</div>
        ) : (
          data.txs.map((tx, i) => (
            <div key={i} className="ab-stats-tx">
              <span className={`ab-tx-type ${tx.to.toLowerCase() === address.toLowerCase() ? 'in' : 'out'}`}>
                {tx.to.toLowerCase() === address.toLowerCase() ? 'IN' : 'OUT'}
              </span>
              <span className="ab-tx-amt">{tx.value} {tx.symbol}</span>
              <a href={`https://testnet.arcscan.app/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="ab-tx-link">↗</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Message ────────────────────────────────────────────────────────────────
function Message({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  const { transfer, isPending, status: transferStatus } = useTransfer();

  // Parse transfer command: [[EXECUTE_TRANSFER:SYMBOL:AMOUNT:RECIPIENT]]
  // Stricter regex to avoid matching placeholders like "SYMBOL" or "AMOUNT"
  const transferMatch = msg.content.match(/\[\[EXECUTE_TRANSFER:(USDC|EURC):([0-9.]+):(0x[a-fA-F0-9]{40})\]\]/);
  
  // Parse stats command: [[GET_WALLET_STATS:ADDRESS]]
  const statsMatch = msg.content.match(/\[\[GET_WALLET_STATS:(0x[a-fA-F0-9]{40})\]\]/);
  
  const cleanContent = msg.content
    .replace(/\[\[EXECUTE_TRANSFER:[^\]]+\]\]/, "")
    .replace(/\[\[GET_WALLET_STATS:[^\]]+\]\]/, "")
    .trim();

  // Auto-trigger transfer on mount
  useEffect(() => {
    if (transferMatch && !isUser && transferStatus === "idle") {
      const [, symbol, amount, recipient] = transferMatch;
      
      // Extra safety check before triggering
      const isValidSymbol = ["USDC", "EURC"].includes(symbol.toUpperCase());
      const isValidAmount = !isNaN(parseFloat(amount));
      const isValidAddress = recipient.startsWith("0x") && recipient.length === 42;

      if (isValidSymbol && isValidAmount && isValidAddress) {
        const timer = setTimeout(() => {
          transfer(symbol, amount, recipient as `0x${string}`);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [transferMatch, isUser, transferStatus, transfer]);

  // Use ReactMarkdown for rendering bot messages
  const renderBotContent = (content: string) => {
    return (
      <div className="ab-markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="ab-h1">{children}</h1>,
            h2: ({ children }) => <h2 className="ab-h2">{children}</h2>,
            h3: ({ children }) => <h3 className="ab-h3">{children}</h3>,
            ul: ({ children }) => <ul className="ab-ul">{children}</ul>,
            ol: ({ children }) => <ol className="ab-ol">{children}</ol>,
            li: ({ children }) => <li className="ab-li">{children}</li>,
            strong: ({ children }) => <strong className="ab-strong">{children}</strong>,
            code: ({ node, ...props }) => <code className="ab-code" {...props} />,
            hr: () => <hr className="ab-hr" />,
            p: ({ children }) => <p className="ab-p">{children}</p>,
            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="ab-link">{children}</a>
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };
  const handleTransfer = () => {
    if (!transferMatch) return;
    const [, symbol, amount, recipient] = transferMatch;
    transfer(symbol, amount, recipient as `0x${string}`);
  };

  return (
    <div className={`ab-msg ${isUser ? "ab-msg--user" : "ab-msg--bot"}`}>
      {!isUser && <div className="ab-msg-ava"><BotIcon size={12} /></div>}
      <div className="ab-msg-body">
        {!isUser && <span className="ab-msg-label">ArcBot</span>}
        <div className="ab-msg-text">
          {isUser ? (
            cleanContent
          ) : (
            renderBotContent(cleanContent)
          )}
        </div>

        {transferMatch && !isUser && (
          <div className="ab-transfer-card">
            <div className="ab-transfer-info">
              <span className="ab-transfer-label">Auto-Transfer Ready</span>
              <div className="ab-transfer-details">
                <strong>{transferMatch[2]} {transferMatch[1]}</strong>
                <span className="ab-transfer-to">to {transferMatch[3].slice(0, 6)}...{transferMatch[3].slice(-4)}</span>
              </div>
            </div>
            
            {transferStatus === "success" ? (
              <div className="ab-transfer-success">✓ Transaction Sent</div>
            ) : (
              <button 
                className="ab-transfer-btn" 
                onClick={handleTransfer}
                disabled={isPending}
              >
                {isPending ? "Confirming..." : "Sign Transaction"}
              </button>
            )}
            {transferStatus === "error" && <div className="ab-transfer-err">Transaction failed</div>}
          </div>
        )}

        {statsMatch && !isUser && <WalletStatsCard address={statsMatch[1]} />}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ArcAgent() {
  const mounted = useIsMounted();
  const { address, isConnected } = useWallet();

  const [isOpen, setIsOpen]     = useState(false);
  const [hasChat, setHasChat]   = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const inputRef  = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key === "i") { e.preventDefault(); setIsOpen(v => !v); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  // Auto-focus
  useEffect(() => { if (isOpen) setTimeout(() => (inputRef.current as HTMLElement)?.focus(), 150); }, [isOpen]);

  // Scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const sendMessage = useCallback(async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;

    setError(null);
    setInput("");
    setHasChat(true);

    const newMsg: Msg = { role: "user", content: userText };
    const updatedMsgs = [...messages, newMsg];
    setMessages(updatedMsgs);
    setIsLoading(true);

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/user/agent/chat";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          address: isConnected ? address : undefined,
          history: updatedMsgs.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || `Error ${res.status}`);

      const botReply = data.reply;
      setMessages(prev => [...prev, { role: "assistant", content: botReply }]);
    } catch (err: any) {
      const msg = err.message?.includes("JATEVO_API_KEY")
        ? "API key not configured. Please add JATEVO_API_KEY to backend .env"
        : "Failed to connect to ArcBot. Please try again.";
      setError(msg);
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ " + msg }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, address, isConnected]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const reset = () => {
    setMessages([]); setHasChat(false); setInput(""); setError(null);
    setTimeout(() => (inputRef.current as HTMLElement)?.focus(), 100);
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── Floating Bar ── */}
      {!isOpen && (
        <div className="ab-bar-wrap">
          <button className="ab-bar" onClick={() => setIsOpen(true)}>
            <BotIcon size={15} />
            <span className="ab-bar-text">Ask anything about Arc...</span>
            <span className="ab-bar-shortcut">Ctrl+I</span>
            <div className="ab-bar-send"><SendIcon /></div>
          </button>
        </div>
      )}

      {/* ── Backdrop ── */}
      {isOpen && <div className="ab-backdrop" onClick={() => setIsOpen(false)} />}

      {/* ── Chat Modal ── */}
      <div className={`ab-modal ${isOpen ? "ab-modal--open" : ""}`}>

        {!hasChat ? (
          /* HOME STATE */
          <div className="ab-home">
            <div className="ab-home-top">
              <div className="ab-home-brand">
                <BotIcon size={18} />
                <span>ArcBot</span>
              </div>
              <button className="ab-icon-btn" onClick={() => setIsOpen(false)}><CloseIcon /></button>
            </div>

            <h2 className="ab-home-title">
              Ask anything about<br />Arc & Circle
            </h2>

            {error && <div className="ab-error">⚠ {error}</div>}

            <div className="ab-searchbox">
              <div className="ab-searchbox-icon"><BotIcon size={14} /></div>
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                className="ab-searchbox-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask a question..."
                autoComplete="off"
              />
              <button className="ab-searchbox-send" onClick={() => sendMessage()} disabled={!input.trim()}>
                <SendIcon />
              </button>
            </div>

            <div className="ab-suggestions">
              {(isConnected ? WALLET_SUGGESTIONS : LANDING_SUGGESTIONS).map(s => (
                <button key={s.text} className="ab-suggestion" onClick={() => sendMessage(s.text)}>
                  <span className="ab-sug-icon">{s.icon}</span>
                  <span className="ab-sug-text">{s.text}</span>
                  <span className="ab-sug-arr">→</span>
                </button>
              ))}
            </div>

            {isConnected && (
              <p className="ab-home-wallet">🟢 Wallet connected · balance info available</p>
            )}
            <p className="ab-home-foot">Powered by GLM-4.7 · Arc Network Knowledge Base</p>
          </div>

        ) : (
          /* CHAT STATE */
          <div className="ab-chat">
            <div className="ab-chat-hd">
              <div className="ab-chat-hd-l">
                <div className="ab-chat-ava"><BotIcon size={13} /></div>
                <span className="ab-chat-name">ArcBot</span>
                <span className="ab-online-dot" />
              </div>
              <div className="ab-chat-hd-r">
                <button className="ab-icon-btn" onClick={reset} title="New conversation"><ResetIcon /></button>
                <button className="ab-icon-btn" onClick={() => setIsOpen(false)} title="Close"><CloseIcon /></button>
              </div>
            </div>

            <div className="ab-chat-msgs">
              {messages.map((m, i) => <Message key={i} msg={m} />)}
              {isLoading && <TypingDots />}
              <div ref={bottomRef} />
            </div>

            <div className="ab-chat-foot">
              <div className="ab-chat-inputbox">
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  className="ab-chat-inp"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask a follow-up..."
                  rows={1}
                  disabled={isLoading}
                />
                <button className="ab-chat-send" onClick={() => sendMessage()} disabled={isLoading || !input.trim()}>
                  <SendIcon />
                </button>
              </div>
              <p className="ab-chat-hint">Enter to send · Esc to close</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
