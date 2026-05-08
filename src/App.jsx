import { useState } from "react";
import { DynamicContextProvider, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const DYNAMIC_ENV_ID = "1718fe30-45da-4a62-b094-53734f7f3f8a";

const ArcMark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" stroke="#7B5FFF" strokeWidth="2.5" fill="none"/>
    <path d="M10 22 Q16 8 22 22" stroke="#7B5FFF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const bubbles = Array.from({ length: 14 }, (_, i) => ({
  id: i, size: 36 + Math.random() * 48, left: Math.random() * 100,
  top: Math.random() * 100, delay: Math.random() * 4, duration: 5 + Math.random() * 5,
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
      <p style={{ color: "#3A5A70", fontSize: 10.5, marginTop: 14 }}>Dynamic aceita e-mail, Google e outras carteiras</p>
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
        { emoji: "🔗", title: "Connect Wallet", desc: "Use MetaMask or Dynamic (email, Google and more)." },
        { emoji: "📝", title: "Create Request", desc: "Enter recipient address, amount, and description." },
        { emoji: "🔗", title: "Share Link", desc: "Send the payment link to anyone." },
        { emoji: "💸", title: "Receive USDC", desc: "Get paid instantly on Arc Testnet." },
        { emoji: "🚰", title: "Need test USDC?", desc: <span>Get free USDC on <a href="https://faucet.circle.com/" target="_blank" rel="noreferrer" style={{ color: "#00C2FF" }}>faucet.circle.com</a></span> },
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
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 50% 50%, #0a1628 0%, #050d1a 50%, #020810 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes float { 0% { transform: translateY(0px) scale(1) rotate(0deg); } 50% { transform: translateY(-28px) scale(1.08) rotate(3deg); } 100% { transform: translateY(0px) scale(1) rotate(0deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
        @keyframes twinkle { 0%, 100% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes drift { 0% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-15px) translateX(8px); } 66% { transform: translateY(8px) translateX(-5px); } 100% { transform: translateY(0) translateX(0); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Glow central da galáxia */}
      <div style={{ position: "absolute", width: "70vw", height: "70vh", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(39,117,202,0.25) 0%, rgba(80,40,180,0.15) 35%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Partículas azuis brilhantes */}
      {Array.from({ length: 120 }, (_, i) => {
        const size = Math.random() * 3 + 1;
        const brightness = Math.random();
        return (
          <div key={`p-${i}`} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: size, height: size, borderRadius: "50%", background: brightness > 0.7 ? "#ffffff" : brightness > 0.4 ? "#7ec8ff" : "#2775CA", boxShadow: brightness > 0.7 ? `0 0 ${size * 3}px #7ec8ff` : brightness > 0.4 ? `0 0 ${size * 2}px #2775CA` : "none", opacity: Math.random() * 0.6 + 0.3, animation: `twinkle ${2 + Math.random() * 5}s ease-in-out ${Math.random() * 5}s infinite`, pointerEvents: "none" }} />
        );
      })}

      {/* Nuvem de partículas concentrada (galáxia) */}
      {Array.from({ length: 60 }, (_, i) => {
        const angle = Math.random() * 360;
        const dist = Math.random() * 35 + 5;
        const x = 50 + dist * Math.cos(angle * Math.PI / 180);
        const y = 50 + dist * Math.sin(angle * Math.PI / 180) * 0.5;
        const size = Math.random() * 4 + 1;
        return (
          <div key={`g-${i}`} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: "50%", background: "#4a9eff", boxShadow: `0 0 ${size * 4}px #2775CA`, opacity: Math.random() * 0.5 + 0.2, animation: `drift ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite`, pointerEvents: "none" }} />
        );
      })}

      {/* Bolhas USDC */}
      {bubbles.map(b => (
        <div key={b.id} style={{ position: "absolute", left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, #4a9eff, #2775CA 50%, #1a4fa0)", border: "2px solid rgba(100,180,255,0.5)", boxShadow: "0 0 25px rgba(39,117,202,0.6), 0 0 50px rgba(39,117,202,0.2), inset 0 0 20px rgba(255,255,255,0.15)", pointerEvents: "none", animation: `float ${b.duration}s ease-in-out ${b.delay}s infinite, pulse ${b.duration * 1.2}s ease-in-out ${b.delay}s infinite`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={b.size * 0.58} height={b.size * 0.58} viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="50" fill="url(#usdcGrad)"/>
            <defs>
              <radialGradient id="usdcGrad" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#5aabff"/>
                <stop offset="100%" stopColor="#1a5fb0"/>
              </radialGradient>
            </defs>
            <path d="M50 18C32.3 18 18 32.3 18 50S32.3 82 50 82 82 67.7 82 50 67.7 18 50 18zM50 76C35.6 76 24 64.4 24 50S35.6 24 50 24 76 35.6 76 50 64.4 76 50 76z" fill="rgba(255,255,255,0.3)"/>
            <path d="M57 35h-4v-4h-6v4c-5.5 1-9 4.8-9 9.5 0 5.5 3.5 8.5 10 10.2v6.8c-2.8-.5-4.5-2.2-4.5-4.5h-5c0 5 3.8 8.8 9.5 9.5V70h6v-3.5c5.8-.7 9.5-4.5 9.5-9.5 0-5.5-3.2-8.2-10-10v-7c2.5.4 4 2 4 4h5c0-4.8-3.5-8.5-9-9.5V35zm-4 10v7c-3-.8-4.5-2.2-4.5-4 0-1.5 1.5-2.8 4.5-3zm5.5 15.5c0 1.8-1.8 3.2-5.5 3.8v-7.5c3.5.9 5.5 2.2 5.5 3.7z" fill="white"/>
          </svg>
        </div>
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
    <DynamicContextProvider settings={{ environmentId: DYNAMIC_ENV_ID, walletConnectors: [EthereumWalletConnectors] }} theme="dark">
      <InnerApp />
    </DynamicContextProvider>
  );
}
