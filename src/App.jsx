import { useState } from "react";
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const DYNAMIC_ENV_ID = "1718fe30-45da-4a62-b094-53734f7f3f8a";

const ArcMark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" stroke="#7B5FFF" strokeWidth="2.5" fill="none"/>
    <path d="M10 22 Q16 8 22 22" stroke="#7B5FFF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const bubbles = Array.from({ length: 12 }, (_, i) => ({
  id: i, size: 28 + Math.random() * 36, left: Math.random() * 100,
  top: Math.random() * 100, delay: Math.random() * 6, duration: 6 + Math.random() * 6,
}));

function WalletScreen({ onConnectMetaMask, onConnectDynamic }) {
  return (
    <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 14px" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#2775CA,#5B8DEF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>💵</div>
          <div style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, borderRadius: "50%", background: "#0f0f1a", border: "2px solid #1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArcMark size={18} />
          </div>
        </div>
        <p style={{ color: "#7AAAC8", fontSize: 12, margin: 0 }}>Conecte sua carteira para começar</p>
      </div>
      <button onClick={onConnectMetaMask} style={{ width: "100%", padding: "13px 0", marginBottom: 10, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,165,0,0.12)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
        <span style={{ fontSize: 20 }}>🦊</span> Conectar com MetaMask
      </button>
      <button onClick={onConnectDynamic} style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "rgba(123,95,255,0.15)", border: "1px solid rgba(123,95,255,0.35)", color: "#B9ADFF", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(123,95,255,0.28)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(123,95,255,0.15)"}>
        <span style={{ fontSize: 20 }}>🔑</span> Conectar com Dynamic
      </button>
      <p style={{ color: "#3A5A70", fontSize: 10.5, marginTop: 14 }}>Dynamic aceita e-mail, Google, Apple e outras carteiras</p>
    </div>
  );
}

function CreateScreen({ onViewPay, walletLabel, onDisconnect }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 10px" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#2775CA,#5B8DEF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>💵</div>
          <div style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, borderRadius: "50%", background: "#0f0f1a", border: "2px solid #1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArcMark size={18} />
          </div>
        </div>
        <p style={{ color: "#7AAAC8", fontSize: 12, margin: 0 }}>Request USDC payments on Arc Testnet.<br />No ETH needed. Predictable dollar fees.</p>
      </div>
      {[
        { label: "RECIPIENT ADDRESS", val: recipient, set: setRecipient, placeholder: "0x..." },
        { label: "AMOUNT", val: amount, set: setAmount, placeholder: "$ 0.00", type: "number" },
        { label: "DESCRIPTION", val: desc, set: setDesc, placeholder: "Ex: freelance design, invoice #42..." },
      ].map(({ label, val, set, placeholder, type }) => (
        <div key={label} style={{ marginBottom: 12 }}>
          <label style={{ color: "#4A6A80", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>{label}</label>
          <input type={type || "text"} value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
            style={{ width: "100%", padding: "11px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#C8DAEA", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
      ))}
      <button onClick={() => { if (recipient && amount) onViewPay({ recipient, amount, desc }); }}
        style={{ width: "100%", padding: "14px 0", borderRadius: 10, background: "linear-gradient(90deg,#5000FF,#00C2FF)", border: "none", color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "0.07em", cursor: "pointer", marginTop: 4 }}>
        GENERATE PAYMENT LINK
      </button>
      <p style={{ color: "#3A5A70", fontSize: 10, textAlign: "center", marginTop: 10 }}>
        Conectado via {walletLabel} · <span style={{ cursor: "pointer", color: "#5B3FFF" }} onClick={onDisconnect}>Desconectar</span>
      </p>
    </>
  );
}

function HowScreen() {
  return (
    <div>
      {[
        { emoji: "🔗", title: "Connect Wallet", desc: "Use MetaMask or Dynamic (email, Google, Apple)." },
        { emoji: "📝", title: "Create Request", desc: "Enter recipient address, amount, and description." },
        { emoji: "🔗", title: "Share Link", desc: "Send the payment link to anyone." },
        { emoji: "💸", title: "Receive USDC", desc: "Get paid instantly on Arc Testnet." },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(80,0,255,0.18)", border: "1px solid rgba(123,47,255,0.40)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{s.emoji}</div>
          <div>
            <p style={{ color: "#9B5FFF", fontSize: 12, fontWeight: 700, margin: "0 0 3px" }}>{s.title}</p>
            <p style={{ color: "#7AAAC8", fontSize: 12, margin: 0 }}>{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PayScreen({ data, onBack }) {
  const link = `https://arcpayapp.com/pay?to=${data.recipient}&amount=${data.amount}&desc=${encodeURIComponent(data.desc)}`;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ background: "rgba(0,194,255,0.07)", border: "1px solid rgba(0,194,255,0.2)", borderRadius: 10, padding: "16px 14px", marginBottom: 16 }}>
        <p style={{ color: "#4A6A80", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 6px" }}>PAYMENT LINK</p>
        <p style={{ color: "#00C2FF", fontSize: 11, wordBreak: "break-all", margin: 0 }}>{link}</p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => navigator.clipboard.writeText(link)} style={{ flex: 1, padding: "11px 0", borderRadius: 9, background: "linear-gradient(90deg,#5000FF,#00C2FF)", border: "none", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>COPY LINK</button>
        <button onClick={onBack} style={{ flex: 1, padding: "11px 0", borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#7AAAC8", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>NEW REQUEST</button>
      </div>
    </div>
  );
}

function InnerApp() {
  const { setShowAuthFlow, primaryWallet, handleLogOut } = useDynamicContext();
  const [wallet, setWallet] = useState(null);
  const [screen, setScreen] = useState("create");
  const [payData, setPayData] = useState(null);

  if (primaryWallet && !wallet) setWallet("dynamic");

  const connectMetaMask = async () => {
    if (!window.ethereum) { alert("MetaMask não encontrado! Instale em metamask.io"); return; }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet("metamask");
    } catch (err) { console.error(err); }
  };

  const disconnect = async () => {
    if (wallet === "dynamic") await handleLogOut();
    setWallet(null); setScreen("create"); setPayData(null);
  };

  const walletLabel = wallet === "metamask" ? "🦊 MetaMask" : "🔑 Dynamic";
  const tabs = [{ id: "create", label: "Create Request" }, { id: "how", label: "How It Works" }];

  return (
    <div style={{ minHeight: "100vh", background: "#080818", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`@keyframes float { from { transform: translateY(0px); } to { transform: translateY(-18px); } } * { box-sizing: border-box; }`}</style>
      {bubbles.map(b => (
        <div key={b.id} style={{ position: "absolute", left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, rgba(39,117,202,0.18), rgba(39,117,202,0.04))", border: "1px solid rgba(39,117,202,0.15)", pointerEvents: "none", animation: `float ${b.duration}s ease-in-out ${b.delay}s infinite alternate` }} />
      ))}
      <div style={{ width: 370, background: "rgba(10,10,30,0.92)", borderRadius: 20, padding: "22px 24px 20px", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(18px)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <ArcMark size={22} />
            <div>
              <p style={{ color: "#fff", fontSize: 15, fontWeight: 800, margin: 0 }}>Arc Pay</p>
              <p style={{ color: "#3A5A70", fontSize: 9.5, margin: 0, letterSpacing: "0.06em" }}>BY MCIDINHA · USDC TESTNET</p>
            </div>
          </div>
          <span style={{ background: "rgba(0,194,255,0.12)", border: "1px solid rgba(0,194,255,0.25)", color: "#00C2FF", fontSize: 9.5, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>● TESTNET</span>
        </div>

        {!wallet ? (
          <WalletScreen onConnectMetaMask={connectMetaMask} onConnectDynamic={() => setShowAuthFlow(true)} />
        ) : (
          <>
            {screen !== "pay" && (
              <div style={{ display: "flex", gap: 4, marginBottom: 18, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4 }}>
                {tabs.map(({ id, label }) => (
                  <button key={id} onClick={() => setScreen(id)} style={{ flex: 1, padding: "9px 0", background: screen === id ? "rgba(80,0,255,0.18)" : "transparent", border: screen === id ? "1px solid rgba(123,47,255,0.40)" : "1px solid transparent", borderRadius: 9, color: screen === id ? "#9B5FFF" : "#3A5A70", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
            {screen === "create" && <CreateScreen onViewPay={(d) => { setPayData(d); setScreen("pay"); }} walletLabel={walletLabel} onDisconnect={disconnect} />}
            {screen === "how" && <HowScreen />}
            {screen === "pay" && <PayScreen data={payData} onBack={() => setScreen("create")} />}
          </>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
          <ArcMark size={14} />
          <span style={{ color: "#3A5A70", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.05em" }}>Arc Testnet · Circle USDC · Built with Claude</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DynamicContextProvider settings={{ environmentId: DYNAMIC_ENV_ID, walletConnectors: [EthereumWalletConnectors] }}>
      <InnerApp />
    </DynamicContextProvider>
  );
}
