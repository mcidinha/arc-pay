import { useState, useEffect } from "react";
import { DynamicContextProvider, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors, isEthereumWallet } from "@dynamic-labs/ethereum";
import { parseUnits, formatUnits, publicActions, parseEventLogs } from "viem";

const DYNAMIC_ENV_ID = "1718fe30-45da-4a62-b094-53734f7f3f8a";
const BACKEND_URL = "/api";

// Contrato ArcPay na Arc Testnet + USDC (interface ERC-20, 6 decimais)
const ARCPAY_CONTRACT = "0x96e1D2564CB904445eF05688671Ee05c76aedeE4";
const USDC_CONTRACT = "0x3600000000000000000000000000000000000000";

const USDC_ABI = [
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
];

const ARCPAY_ABI = [
  { type: "function", name: "pay", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }, { name: "description", type: "string" }], outputs: [{ name: "id", type: "uint256" }] },
  { type: "event", name: "PaymentMade", inputs: [
    { name: "id", type: "uint256", indexed: true },
    { name: "from", type: "address", indexed: true },
    { name: "to", type: "address", indexed: true },
    { name: "amount", type: "uint256", indexed: false },
    { name: "description", type: "string", indexed: false },
    { name: "timestamp", type: "uint256", indexed: false },
  ] },
];

const stars = Array.from({ length: 60 }, (_, i) => ({
  id: i, size: Math.random() < 0.3 ? 2 : 1,
  left: Math.random() * 100, top: Math.random() * 100,
  delay: Math.random() * 5, duration: 2 + Math.random() * 3,
}));

const bubbles = Array.from({ length: 10 }, (_, i) => ({
  id: i, size: 35 + Math.random() * 70,
  left: Math.random() * 100, top: Math.random() * 100,
  delay: Math.random() * 4, duration: 6 + Math.random() * 6,
}));

function USDCIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" fill="rgba(39,117,202,0.25)" stroke="rgba(99,179,255,0.5)" strokeWidth="1.5"/>
      <circle cx="18" cy="18" r="12" fill="rgba(39,117,202,0.15)" stroke="rgba(99,179,255,0.25)" strokeWidth="1"/>
      <text x="18" y="23" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#93c5fd">$</text>
    </svg>
  );
}

function GalaxyBackground() {
  return (
    <>
      {stars.map(s => (
        <div key={s.id} style={{ position: "fixed", width: s.size, height: s.size, left: s.left + "%", top: s.top + "%", borderRadius: "50%", background: "white", animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`, pointerEvents: "none", zIndex: 0, opacity: 0.6 }} />
      ))}
      {bubbles.map(b => (
        <div key={b.id} style={{ position: "fixed", width: b.size, height: b.size, left: b.left + "%", top: b.top + "%", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, rgba(74,124,247,0.18), rgba(99,179,255,0.06) 60%, transparent)", border: "1px solid rgba(99,179,255,0.18)", animation: `floatBubble ${b.duration}s ease-in-out ${b.delay}s infinite alternate`, pointerEvents: "none", zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <USDCIcon size={b.size * 0.45} />
        </div>
      ))}
      <div style={{ position: "fixed", width: "600px", height: "600px", left: "-150px", top: "-150px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, animation: "nebula 10s ease-in-out infinite" }} />
      <div style={{ position: "fixed", width: "500px", height: "500px", right: "-100px", top: "20%", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, animation: "nebula 13s ease-in-out 3s infinite" }} />
      <div style={{ position: "fixed", width: "400px", height: "400px", left: "10%", bottom: "-100px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, animation: "nebula 11s ease-in-out 6s infinite" }} />
      <div style={{ position: "fixed", width: "350px", height: "350px", right: "15%", bottom: "10%", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, animation: "nebula 9s ease-in-out 2s infinite" }} />
    </>
  );
}

const ArcMark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" stroke="#63b3ff" strokeWidth="2" fill="none"/>
    <path d="M10 22 Q16 8 22 22" stroke="#63b3ff" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

const card = { background: "linear-gradient(145deg, rgba(4,8,20,0.92) 0%, rgba(8,16,40,0.95) 50%, rgba(4,10,25,0.92) 100%)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", border: "1px solid rgba(74,124,247,0.2)", borderRadius: "28px", padding: "36px 32px", width: "100%", maxWidth: "520px", position: "relative", zIndex: 1, boxShadow: "0 0 60px rgba(74,124,247,0.1), 0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)" };
const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(74,124,247,0.15)", background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box", outline: "none" };
const primaryBtn = { width: "100%", padding: "16px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #3b6ef7 0%, #1d4ed8 100%)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 30px rgba(59,110,247,0.35)", letterSpacing: "0.02em", marginBottom: "12px" };
const secondaryBtn = { width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.02em", marginBottom: "12px" };
const backBtn = { background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px", padding: 0 };
const labelStyle = { fontSize: "11px", color: "rgba(99,179,255,0.6)", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px", display: "block" };
const footer = { textAlign: "center", marginTop: "24px", fontSize: "11px", color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" };
const pulseDot = { display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", marginRight: "7px", animation: "pulseDot 2s infinite" };
const explorerBtn = { display: "block", textAlign: "center", marginTop: "12px", padding: "12px", background: "linear-gradient(135deg, #3b6ef7, #1d4ed8)", borderRadius: "12px", fontSize: "13px", color: "#fff", textDecoration: "none", fontWeight: "700" };

async function fetchTxHash(transferId) {
  try {
    const res = await fetch(BACKEND_URL + "/transaction/status", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transferId }),
    });
    const data = await res.json();
    return data.txHash || "";
  } catch (e) {
    console.error("Erro ao buscar txHash:", e);
    return "";
  }
}

function LoginScreen() {
  const { setShowAuthFlow } = useDynamicContext();
  return (
    <div style={card}>
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 250, height: 250, background: "radial-gradient(circle, rgba(74,124,247,0.25), transparent 70%)", pointerEvents: "none", borderRadius: "50%" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "linear-gradient(135deg, #3b6ef7, #1d4ed8)", borderRadius: "11px", padding: "8px", boxShadow: "0 0 20px rgba(59,110,247,0.4)" }}><ArcMark size={22} /></div>
          <span style={{ fontSize: "22px", fontWeight: "800", background: "linear-gradient(135deg, #fff, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Arc Pay</span>
        </div>
        <span style={{ background: "rgba(74,124,247,0.15)", border: "1px solid rgba(74,124,247,0.35)", borderRadius: "20px", padding: "5px 14px", fontSize: "11px", color: "#93c5fd", fontWeight: "700", letterSpacing: "0.08em" }}>TESTNET</span>
      </div>
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "34px", fontWeight: "800", lineHeight: "1.15", marginBottom: "14px", background: "linear-gradient(135deg, #fff 40%, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>USDC Payments on Arc Testnet</h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7" }}>Send and receive USDC instantly. Sign in with Google, email or any wallet.</p>
      </div>
      <button style={primaryBtn} onClick={() => setShowAuthFlow(true)}>Get Started</button>
      <div style={footer}><ArcMark size={12} />Arc Testnet · Circle USDC · Built with Claude by mcidinha</div>
    </div>
  );
}

function Dashboard({ onSend, onLink, onHow, walletData, loadingWallet }) {
  const { user, primaryWallet, handleLogOut } = useDynamicContext();
  const isWallet = !!(primaryWallet && isEthereumWallet(primaryWallet));
  // Login por carteira: mostra a carteira conectada. Email/Google: mantem a carteira Circle.
  const address = isWallet ? primaryWallet.address : (walletData?.address || "");
  const shortAddress = address ? address.slice(0, 8) + "..." + address.slice(-6) : "Creating wallet...";
  const userEmail = user?.email || "";
  const [onchainBalance, setOnchainBalance] = useState(null);
  useEffect(() => {
    let active = true;
    if (!isWallet) { setOnchainBalance(null); return; }
    (async () => {
      try {
        const walletClient = await primaryWallet.getWalletClient();
        const client = walletClient.extend(publicActions);
        const raw = await client.readContract({
          address: USDC_CONTRACT, abi: USDC_ABI, functionName: "balanceOf", args: [primaryWallet.address],
        });
        if (active) setOnchainBalance(formatUnits(raw, 6));
      } catch (e) { if (active) setOnchainBalance("0"); }
    })();
    return () => { active = false; };
  }, [isWallet, primaryWallet?.address]);
  const balance = isWallet ? (onchainBalance ?? "0") : (walletData?.balance || "0");
  const [faucetCopied, setFaucetCopied] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => { if (address) { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
  const handleFaucet = () => { if (address) { navigator.clipboard.writeText(address); setFaucetCopied(true); setTimeout(() => setFaucetCopied(false), 3000); } };

  return (
    <div style={card}>
      <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, background: "radial-gradient(circle, rgba(74,124,247,0.15), transparent 70%)", pointerEvents: "none", borderRadius: "50%" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "linear-gradient(135deg, #3b6ef7, #1d4ed8)", borderRadius: "11px", padding: "7px", boxShadow: "0 0 15px rgba(59,110,247,0.4)" }}><ArcMark size={20} /></div>
          <span style={{ fontSize: "19px", fontWeight: "800", background: "linear-gradient(135deg, #fff, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Arc Pay</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onHow} style={{ background: "rgba(74,124,247,0.08)", border: "1px solid rgba(74,124,247,0.2)", borderRadius: "10px", color: "rgba(255,255,255,0.5)", fontSize: "11px", padding: "7px 10px", cursor: "pointer" }}>How it works?</button>
          <button onClick={handleLogOut} style={{ background: "rgba(74,124,247,0.08)", border: "1px solid rgba(74,124,247,0.2)", borderRadius: "10px", color: "rgba(255,255,255,0.5)", fontSize: "11px", padding: "7px 10px", cursor: "pointer" }}>Sign out</button>
        </div>
      </div>
      {userEmail && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}><span style={pulseDot} />{userEmail}</div>}
      <div style={{ background: "linear-gradient(135deg, rgba(13,26,70,0.9) 0%, rgba(4,12,40,0.95) 100%)", border: "1px solid rgba(74,124,247,0.25)", borderRadius: "20px", padding: "26px", marginBottom: "14px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 0 40px rgba(74,124,247,0.1)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% -20%, rgba(74,124,247,0.2) 0%, transparent 65%)", borderRadius: "20px", pointerEvents: "none" }} />
        <div style={{ fontSize: "10px", color: "rgba(99,179,255,0.65)", fontWeight: "700", letterSpacing: "0.18em", marginBottom: "8px", textTransform: "uppercase" }}>Arc Testnet Balance</div>
        {loadingWallet ? <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", padding: "10px" }}>Loading...</div> : (
          <>
            <div style={{ fontSize: "56px", fontWeight: "900", lineHeight: 1, background: "linear-gradient(135deg, #ffffff 0%, #c7deff 40%, #63b3ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{parseFloat(balance).toFixed(2)}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #2775CA, #1557a0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: "white", border: "1.5px solid rgba(99,179,255,0.4)" }}>$</div>
              <span style={{ color: "#93c5fd", fontSize: "14px", fontWeight: "600", letterSpacing: "0.1em" }}>USDC</span>
            </div>
          </>
        )}
      </div>
      <div onClick={copyAddress} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "11px 16px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace", flex: 1 }}>{shortAddress}</span>
        <span style={{ fontSize: "11px", color: copied ? "#4ade80" : "#63b3ff" }}>{copied ? "copied!" : "copy"}</span>
      </div>
      <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" onClick={handleFaucet} style={{ display: "block", textAlign: "center", marginBottom: "12px", padding: "12px", background: faucetCopied ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.06)", border: faucetCopied ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(34,197,94,0.18)", borderRadius: "12px", fontSize: "12px", color: faucetCopied ? "#4ade80" : "rgba(74,222,128,0.8)", textDecoration: "none", fontWeight: "600" }}>
        {faucetCopied ? "✓ Address copied! Paste in faucet" : "✦ Get free USDC on Circle Faucet"}
      </a>
      <button onClick={onSend} style={primaryBtn}>Send USDC</button>
      <button onClick={onLink} style={secondaryBtn}>Generate Payment Link</button>

      <div style={{ background: "rgba(74,124,247,0.05)", border: "1px solid rgba(74,124,247,0.12)", borderRadius: "12px", padding: "18px 18px", marginTop: "18px" }}>
        <div style={{ fontSize: "15px", fontWeight: "700", color: "#63b3ff", marginBottom: "12px", letterSpacing: "0.03em" }}>POWERED BY ARC L1</div>
        <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: "1.9" }}>
          <div>⚡ USDC as native gas: fees always in USD, predictable and cheap</div>
          <div>✓ Finality in under 1 second</div>
          <div>✓ Fully EVM (works with MetaMask)</div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
        <a href="https://www.arc.io/" target="_blank" rel="noreferrer" style={{ color: "#63b3ff", textDecoration: "none" }}>Official Arc Site</a>
        <span>·</span>
        <a href="https://docs.arc.io/" target="_blank" rel="noreferrer" style={{ color: "#63b3ff", textDecoration: "none" }}>Documentation</a>
        <span>·</span>
        <a href="https://testnet.arcscan.app/" target="_blank" rel="noreferrer" style={{ color: "#63b3ff", textDecoration: "none" }}>Testnet Explorer</a>
        <span>·</span>
        <a href="https://testnet.arcscan.app/address/0x96e1D2564CB904445eF05688671Ee05c76aedeE4" target="_blank" rel="noreferrer" style={{ color: "#63b3ff", textDecoration: "none" }}>My Contract</a>
      </div>
      <div style={footer}><ArcMark size={11} />Arc Testnet · Circle USDC · Built with Claude by mcidinha</div>
    </div>
  );
}

function SendScreen({ onBack, walletData }) {
  const { user, primaryWallet } = useDynamicContext();
  const isWallet = !!(primaryWallet && isEthereumWallet(primaryWallet));
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [status, setStatus] = useState("");
  const [txId, setTxId] = useState("");
  const [invoice, setInvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const hasEmail = !!user?.email;
  const fromWalletId = walletData?.circle_wallet_id || "";

  const handleSend = async () => {
    if (!toAddress || !amount) { setStatus("error:Please fill in the address and amount."); return; }

    // Caminho onchain: paga pelo contrato ArcPay usando a carteira conectada (ex: MetaMask)
    if (primaryWallet && isEthereumWallet(primaryWallet)) {
      setLoading(true); setStatus(""); setTxId(""); setInvoice("");
      try {
        const walletClient = await primaryWallet.getWalletClient();
        // Le e escreve pela mesma conexao da carteira (MetaMask), que ja esta na Arc
        const client = walletClient.extend(publicActions);
        const account = primaryWallet.address;
        const value = parseUnits(String(amount), 6); // USDC = 6 casas decimais

        // 1) Aprova o contrato ArcPay a mover o USDC (sem checar allowance - diagnostico)
        const approveHash = await client.writeContract({
          address: USDC_CONTRACT, abi: USDC_ABI, functionName: "approve",
          args: [ARCPAY_CONTRACT, value], account,
        });
        await client.waitForTransactionReceipt({ hash: approveHash });

        // 2) Chama pay(): move o USDC e grava a invoice no contrato
        const payHash = await client.writeContract({
          address: ARCPAY_CONTRACT, abi: ARCPAY_ABI, functionName: "pay",
          args: [toAddress.trim(), value, description], account,
        });
        const receipt = await client.waitForTransactionReceipt({ hash: payHash });

        // Monta o numero da invoice (NNN/MM/AAAA) a partir do evento onchain
        let invoiceNumber = "";
        let paymentTs = 0;
        try {
          const evs = parseEventLogs({ abi: ARCPAY_ABI, eventName: "PaymentMade", logs: receipt.logs });
          if (evs.length > 0) {
            const id = Number(evs[0].args.id);
            const ts = Number(evs[0].args.timestamp);
            paymentTs = ts;
            const d = new Date(ts * 1000);
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            invoiceNumber = String(id + 1).padStart(3, "0") + "/" + mm + "/" + d.getFullYear();
            setInvoice(invoiceNumber);
          }
        } catch (_) {}

        // Envia o e-mail da invoice ao cliente (remetente entra em copia pelo backend)
        if (email) {
          fetch(BACKEND_URL + "/invoice-email", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email, invoiceNumber, from: account,
              toAddress: toAddress.trim(), amount, description, txHash: payHash, timestamp: paymentTs,
            }),
          }).catch(() => {});
        }

        setStatus("success");
        setTxId(payHash);
      } catch (e) {
        setStatus("error:" + (e.shortMessage || e.message || "Falha na transacao"));
      }
      setLoading(false);
      return;
    }

    // Caminho antigo (Circle/backend), usado no login por email/Google
    if (!fromWalletId) { setStatus("error:Wallet not found."); return; }
    setLoading(true); setStatus(""); setTxId("");
    try {
      const res = await fetch(BACKEND_URL + "/payment/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromWalletId, toAddress, amount, email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        const tid = data.transferId || data.transfer?.id || "";
        if (tid) {
          setTimeout(async () => {
            const hash = await fetchTxHash(tid);
            if (hash) setTxId(hash);
          }, 6000);
        }
      } else setStatus("error:" + JSON.stringify(data.error));
    } catch (e) { setStatus("error:" + e.message); }
    setLoading(false);
  };

  return (
    <div style={card}>
      <button style={backBtn} onClick={onBack}>← Back</button>
      <h2 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px", background: "linear-gradient(135deg, #fff, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Send USDC</h2>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "28px" }}>Instant transfer on Arc Testnet</p>
      {(isWallet ? primaryWallet.address : fromWalletId) && <div style={{ background: "rgba(74,124,247,0.06)", border: "1px solid rgba(74,124,247,0.15)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Wallet: {(isWallet ? primaryWallet.address : fromWalletId).slice(0, 16)}...</div>}
      <label style={labelStyle}>Destination address</label>
      <input style={inputStyle} placeholder="0x..." value={toAddress} onChange={e => setToAddress(e.target.value)} />
      <label style={labelStyle}>Amount (USDC)</label>
      <input style={inputStyle} placeholder="Ex: 1.00" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <label style={labelStyle}>Service description</label>
      <input style={inputStyle} placeholder="Ex: Accounting services - June/2026" value={description} onChange={e => setDescription(e.target.value)} />
      {!hasEmail && (<><label style={labelStyle}>Email for receipt</label><input style={inputStyle} placeholder="your@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} /></>)}
      {hasEmail && <div style={{ background: "rgba(74,124,247,0.08)", border: "1px solid rgba(74,124,247,0.2)", borderRadius: "10px", padding: "12px 14px", marginBottom: "16px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}><span style={pulseDot} />Receipt for {user.email}</div>}
      <button style={primaryBtn} onClick={handleSend} disabled={loading}>{loading ? "Sending..." : "Send USDC"}</button>
      {status === "success" && (
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "14px", padding: "20px", textAlign: "center", marginTop: "8px" }}>
          <div style={{ fontWeight: "700", marginBottom: "4px", color: "#4ade80" }}>✓ Payment sent!</div>
          {invoice && <div style={{ fontSize: "15px", color: "#fff", fontWeight: "700", marginBottom: "2px" }}>Invoice #{invoice}</div>}
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Recorded onchain on Arc Testnet</div>
          {txId ? (
            <a href={`https://testnet.arcscan.app/tx/${txId}`} target="_blank" rel="noreferrer" style={explorerBtn}>🔍 View on Arc Testnet Explorer</a>
          ) : (
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "10px" }}>Loading explorer link...</div>
          )}
        </div>
      )}
      {status.startsWith("error:") && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "14px", padding: "16px", textAlign: "center", marginTop: "8px", fontSize: "13px", color: "#f87171" }}>{status.replace("error:", "")}</div>}
    </div>
  );
}

function LinkScreen({ onBack, walletData }) {
  const { user, primaryWallet } = useDynamicContext();
  const address = walletData?.address || primaryWallet?.address || "";
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const baseUrl = window.location.origin;

  const generateLink = () => {
    if (!address) { alert("Wallet not found!"); return; }
    const params = new URLSearchParams({ to: address });
    if (amount) params.set("amount", amount);
    if (description) params.set("desc", description);
    if (recipientEmail) params.set("recipientEmail", recipientEmail);
    setLink(baseUrl + "/pay?" + params.toString());
  };

  const copyLink = () => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={card}>
      <button style={backBtn} onClick={onBack}>← Back</button>
      <h2 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px", background: "linear-gradient(135deg, #fff, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Payment Link</h2>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "28px" }}>Generate a link to receive USDC from anyone</p>
      <label style={labelStyle}>Amount (optional)</label>
      <input style={inputStyle} placeholder="Ex: 10 USDC" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <label style={labelStyle}>Description (optional)</label>
      <input style={inputStyle} placeholder="Ex: Service payment" value={description} onChange={e => setDescription(e.target.value)} />
      <div style={{ background: "rgba(74,124,247,0.05)", border: "1px solid rgba(74,124,247,0.12)", borderRadius: "12px", padding: "12px 16px", marginBottom: "12px", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
        {address ? address.slice(0, 10) + "..." + address.slice(-8) : "Loading wallet..."}
      </div>
      <label style={labelStyle}>Recipient email for receipt (optional)</label>
      <input style={inputStyle} placeholder="email@recipient.com" type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
      <button style={primaryBtn} onClick={generateLink}>Generate Link</button>
      {link && (
        <div style={{ marginTop: "8px" }}>
          <div style={{ background: "rgba(74,124,247,0.08)", border: "1px solid rgba(74,124,247,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", color: "rgba(99,179,255,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Your payment link</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", wordBreak: "break-all", fontFamily: "monospace", lineHeight: "1.5" }}>{link}</div>
          </div>
          <button onClick={copyLink} style={{ ...secondaryBtn, marginBottom: 0, background: copied ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)", border: copied ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.1)", color: copied ? "#4ade80" : "#fff" }}>
            {copied ? "✓ Copied!" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}

function PayScreen() {
  const params = new URLSearchParams(window.location.search);
  const toAddress = params.get("to") || "";
  const amount = params.get("amount") || "";
  const desc = params.get("desc") || "";
  const recipientEmail = params.get("recipientEmail") || "";
  const { isAuthenticated, user, primaryWallet } = useDynamicContext();
  const { setShowAuthFlow } = useDynamicContext();
  const [walletData, setWalletData] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [status, setStatus] = useState("");
  const [txId, setTxId] = useState("");
  const [invoice, setInvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [faucetCopied, setFaucetCopied] = useState(false);
  const [onchainBalance, setOnchainBalance] = useState(null);
  const isWallet = !!(primaryWallet && isEthereumWallet(primaryWallet));
  const loggedIn = isAuthenticated || !!user || !!primaryWallet;
  const hasEmail = !!user?.email;
  const balance = isWallet ? (onchainBalance ?? "0") : (walletData?.balance || "0");
  const address = isWallet ? primaryWallet.address : (walletData?.address || "");
  const hasEnoughBalance = parseFloat(balance) >= parseFloat(amount || "0");

  useEffect(() => {
    if (!loggedIn) return;
    const userId = user?.userId || user?.id || primaryWallet?.address || "guest";
    const userEmail = user?.email || "";
    setLoadingWallet(true);
    fetch(BACKEND_URL + "/wallet/get-or-create", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email: userEmail }),
    }).then(r => r.json()).then(data => { if (data.success) setWalletData({ ...data.wallet, balance: data.balance }); }).catch(e => console.error("Erro:", e)).finally(() => setLoadingWallet(false));
  }, [loggedIn]);

  const handleFaucet = () => { if (address) { navigator.clipboard.writeText(address); setFaucetCopied(true); setTimeout(() => setFaucetCopied(false), 3000); } };

  useEffect(() => {
    let active = true;
    if (!isWallet) { setOnchainBalance(null); return; }
    (async () => {
      try {
        const wc = await primaryWallet.getWalletClient();
        const client = wc.extend(publicActions);
        const raw = await client.readContract({ address: USDC_CONTRACT, abi: USDC_ABI, functionName: "balanceOf", args: [primaryWallet.address] });
        if (active) setOnchainBalance(formatUnits(raw, 6));
      } catch (e) { if (active) setOnchainBalance("0"); }
    })();
    return () => { active = false; };
  }, [isWallet, primaryWallet?.address]);

  const handlePay = async () => {
    // Caminho onchain: paga pelo contrato com a carteira conectada
    if (isWallet) {
      setLoading(true); setStatus(""); setTxId(""); setInvoice("");
      try {
        const walletClient = await primaryWallet.getWalletClient();
        const client = walletClient.extend(publicActions);
        const account = primaryWallet.address;
        const value = parseUnits(String(amount || "0"), 6);

        const approveHash = await client.writeContract({
          address: USDC_CONTRACT, abi: USDC_ABI, functionName: "approve",
          args: [ARCPAY_CONTRACT, value], account,
        });
        await client.waitForTransactionReceipt({ hash: approveHash });

        const payHash = await client.writeContract({
          address: ARCPAY_CONTRACT, abi: ARCPAY_ABI, functionName: "pay",
          args: [toAddress, value, desc], account,
        });
        const receipt = await client.waitForTransactionReceipt({ hash: payHash });

        let invoiceNumber = "";
        let paymentTs = 0;
        try {
          const evs = parseEventLogs({ abi: ARCPAY_ABI, eventName: "PaymentMade", logs: receipt.logs });
          if (evs.length > 0) {
            const id = Number(evs[0].args.id);
            paymentTs = Number(evs[0].args.timestamp);
            const d = new Date(paymentTs * 1000);
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            invoiceNumber = String(id + 1).padStart(3, "0") + "/" + mm + "/" + d.getFullYear();
            setInvoice(invoiceNumber);
          }
        } catch (_) {}

        const emailTo = recipientEmail || email;
        if (emailTo) {
          fetch(BACKEND_URL + "/invoice-email", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: emailTo, invoiceNumber, from: account, toAddress, amount, description: desc, txHash: payHash, timestamp: paymentTs }),
          }).catch(() => {});
        }

        setStatus("success");
        setTxId(payHash);
      } catch (e) {
        setStatus("error:" + (e.shortMessage || e.message || "Falha na transacao"));
      }
      setLoading(false);
      return;
    }

    // Caminho antigo (Circle/backend), usado no login por email/Google
    if (!walletData?.circle_wallet_id) { setStatus("error:Wallet not found."); return; }
    setLoading(true); setStatus(""); setTxId("");
    try {
      const res = await fetch(BACKEND_URL + "/payment/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromWalletId: walletData.circle_wallet_id, toAddress, amount, email: user?.email || email, recipientEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        const tid = data.transferId || data.transfer?.id || "";
        if (tid) {
          setTimeout(async () => {
            const hash = await fetchTxHash(tid);
            if (hash) setTxId(hash);
          }, 6000);
        }
      } else setStatus("error:" + JSON.stringify(data.error));
    } catch (e) { setStatus("error:" + e.message); }
    setLoading(false);
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "28px" }}>
        <div style={{ background: "linear-gradient(135deg, #3b6ef7, #1d4ed8)", borderRadius: "11px", padding: "8px", boxShadow: "0 0 15px rgba(59,110,247,0.4)" }}><ArcMark size={22} /></div>
        <span style={{ fontSize: "20px", fontWeight: "800", background: "linear-gradient(135deg, #fff, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Arc Pay</span>
      </div>
      <div style={{ background: "linear-gradient(135deg, rgba(13,26,70,0.9), rgba(4,12,40,0.95))", border: "1px solid rgba(74,124,247,0.25)", borderRadius: "20px", padding: "28px", marginBottom: "16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% -20%, rgba(74,124,247,0.2) 0%, transparent 65%)", borderRadius: "20px" }} />
        <div style={{ fontSize: "10px", color: "rgba(99,179,255,0.65)", fontWeight: "700", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "10px" }}>Amount to Pay</div>
        <div style={{ fontSize: "56px", fontWeight: "900", lineHeight: 1, background: "linear-gradient(135deg, #ffffff 0%, #c7deff 40%, #63b3ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{amount || "?"}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #2775CA, #1557a0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "white", border: "1.5px solid rgba(99,179,255,0.4)" }}>$</div>
          <span style={{ color: "#93c5fd", fontSize: "14px", fontWeight: "600", letterSpacing: "0.1em" }}>USDC</span>
        </div>
        {desc && <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "10px" }}>{desc}</div>}
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace", wordBreak: "break-all" }}>To: {toAddress}</div>
      {!loggedIn ? (
        <><p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", textAlign: "center" }}>Sign in to complete payment</p><button style={primaryBtn} onClick={() => setShowAuthFlow(true)}>Get Started</button></>
      ) : (loadingWallet && !isWallet) ? (
        <div style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Creating your wallet...</div>
      ) : (
        <>
          <div style={{ background: "linear-gradient(135deg, rgba(13,26,70,0.9) 0%, rgba(4,12,40,0.95) 100%)", border: "1px solid rgba(74,124,247,0.25)", borderRadius: "16px", padding: "18px", marginBottom: "12px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% -20%, rgba(74,124,247,0.15) 0%, transparent 65%)", borderRadius: "16px" }} />
            <div style={{ fontSize: "10px", color: "rgba(99,179,255,0.65)", fontWeight: "700", letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }}>Your Balance</div>
            <div style={{ fontSize: "36px", fontWeight: "900", lineHeight: 1, background: "linear-gradient(135deg, #ffffff 0%, #c7deff 40%, #63b3ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{parseFloat(balance).toFixed(2)}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "6px" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "linear-gradient(135deg, #2775CA, #1557a0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "white" }}>$</div>
              <span style={{ color: "#93c5fd", fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em" }}>USDC</span>
            </div>
          </div>
          {address && (
            <div onClick={() => { navigator.clipboard.writeText(address); handleFaucet(); }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "10px 14px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace", flex: 1 }}>{address.slice(0, 10)}...{address.slice(-8)}</span>
              <span style={{ fontSize: "11px", color: faucetCopied ? "#4ade80" : "#63b3ff" }}>{faucetCopied ? "copied!" : "copy"}</span>
            </div>
          )}
          <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" onClick={handleFaucet} style={{ display: "block", textAlign: "center", marginBottom: "16px", padding: "12px", background: faucetCopied ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.06)", border: faucetCopied ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(34,197,94,0.18)", borderRadius: "12px", fontSize: "12px", color: faucetCopied ? "#4ade80" : "rgba(74,222,128,0.8)", textDecoration: "none", fontWeight: "600" }}>
            {faucetCopied ? "✓ Address copied! Paste in faucet" : "✦ Get free USDC on Circle Faucet"}
          </a>
          {!hasEnoughBalance && <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", padding: "12px 16px", marginBottom: "12px", fontSize: "12px", color: "#fbbf24", textAlign: "center" }}>⚠ Insufficient balance. Get free USDC from the faucet above, then refresh the page.</div>}
          {hasEmail && <div style={{ background: "rgba(74,124,247,0.08)", border: "1px solid rgba(74,124,247,0.2)", borderRadius: "10px", padding: "12px 14px", marginBottom: "16px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}><span style={pulseDot} />Receipt for {user.email}</div>}
          {!hasEmail && (<><label style={labelStyle}>Email for receipt</label><input style={inputStyle} placeholder="your@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} /></>)}
          {recipientEmail && <div style={{ background: "rgba(74,124,247,0.05)", border: "1px solid rgba(74,124,247,0.12)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Recipient email: {recipientEmail}</div>}
          <button style={{ ...primaryBtn, opacity: hasEnoughBalance ? 1 : 0.4, cursor: hasEnoughBalance ? "pointer" : "not-allowed" }} onClick={handlePay} disabled={loading || !hasEnoughBalance}>
            {loading ? "Processing..." : "Pay " + (amount || "?") + " USDC"}
          </button>
        </>
      )}
      {status === "success" && (
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "14px", padding: "20px", textAlign: "center", marginTop: "8px" }}>
          <div style={{ fontWeight: "700", marginBottom: "4px", color: "#4ade80" }}>✓ Payment confirmed!</div>
          {invoice && <div style={{ fontSize: "15px", color: "#fff", fontWeight: "700", marginBottom: "2px" }}>Invoice #{invoice}</div>}
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Recorded onchain on Arc Testnet</div>
          {txId ? (
            <a href={`https://testnet.arcscan.app/tx/${txId}`} target="_blank" rel="noreferrer" style={explorerBtn}>🔍 View on Arc Testnet Explorer</a>
          ) : (
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "10px" }}>Loading explorer link...</div>
          )}
        </div>
      )}
      {status.startsWith("error:") && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "14px", padding: "16px", textAlign: "center", marginTop: "8px", fontSize: "13px", color: "#f87171" }}>{status.replace("error:", "")}</div>}
      <div style={footer}><ArcMark size={11} />Arc Testnet · Circle USDC · Built with Claude by mcidinha</div>
    </div>
  );
}

function HowScreen({ onBack }) {
  const steps = [
    { icon: "⬡", title: "1. Sign in", desc: "Google or email via Dynamic Auth for instant, passwordless login. Or connect your own Web3 wallet." },
    { icon: "✦", title: "2. Your USDC wallet", desc: "Signing in via email/Google automatically creates a wallet for you. Or connect and use your own." },
    { icon: "◈", title: "3. Send USDC", desc: "Enter the destination address and amount. USDC is transferred instantly on Arc Testnet and you receive a receipt by email." },
    { icon: "◎", title: "4. Generate a payment link", desc: "Set the amount and description. Whoever receives the link opens it in the browser, logs in, and pays with USDC." },
    { icon: "✉", title: "5. Receipt for both sides", desc: "Both the payer and recipient are notified by email with full details of the confirmed transaction." },
    { icon: "◑", title: "6. Traceable on the blockchain", desc: "Every transaction is publicly recorded on Arc Testnet and can be verified at any time by transaction ID." },
  ];
  return (
    <div style={card}>
      <button style={backBtn} onClick={onBack}>← Back</button>
      <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "6px", background: "linear-gradient(135deg, #fff, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>How it works</h2>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "28px" }}>ArcPay - Simple USDC payments on Arc Testnet</p>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "12px", padding: "16px 18px", background: "rgba(74,124,247,0.05)", border: "1px solid rgba(74,124,247,0.12)", borderRadius: "14px", alignItems: "flex-start" }}>
          <div style={{ fontSize: "20px", color: "#63b3ff", minWidth: "28px" }}>{step.icon}</div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px", color: "#fff" }}>{step.title}</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.5" }}>{step.desc}</div>
          </div>
        </div>
      ))}
      <div style={{ background: "rgba(74,124,247,0.08)", border: "1px solid rgba(74,124,247,0.2)", borderRadius: "14px", padding: "16px", textAlign: "center", marginTop: "8px" }}>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>Arc Testnet · Circle USDC · Dynamic Auth · Built with Claude by mcidinha</div>
      </div>
    </div>
  );
}

function InnerApp() {
  const { isAuthenticated, user, primaryWallet } = useDynamicContext();
  const [screen, setScreen] = useState("dashboard");
  const [walletData, setWalletData] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const loggedIn = isAuthenticated || !!user || !!primaryWallet;
  const isPay = window.location.pathname === "/pay";

  if (isPay) return <PayScreen />;

  useEffect(() => {
    if (!loggedIn) return;
    const userId = user?.userId || user?.id || primaryWallet?.address || "guest";
    const email = user?.email || "";
    setLoadingWallet(true);
    fetch(BACKEND_URL + "/wallet/get-or-create", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email }),
    }).then(r => r.json()).then(data => { if (data.success) setWalletData({ ...data.wallet, balance: data.balance }); }).catch(e => console.error("Erro:", e)).finally(() => setLoadingWallet(false));
  }, [loggedIn]);

  if (!loggedIn) return <LoginScreen />;
  if (screen === "send") return <SendScreen onBack={() => setScreen("dashboard")} walletData={walletData} />;
  if (screen === "link") return <LinkScreen onBack={() => setScreen("dashboard")} walletData={walletData} />;
  if (screen === "how") return <HowScreen onBack={() => setScreen("dashboard")} />;
  return <Dashboard onSend={() => setScreen("send")} onLink={() => setScreen("link")} onHow={() => setScreen("how")} walletData={walletData} loadingWallet={loadingWallet} />;
}

export default function App() {
  return (
    <>
      <style>{`
        @keyframes floatBubble { from { transform: translateY(0px) scale(1); opacity: 0.5; } to { transform: translateY(-28px) scale(1.08); opacity: 0.85; } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes nebula { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
        @keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #020510; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { border-color: rgba(74,124,247,0.5) !important; box-shadow: 0 0 0 3px rgba(74,124,247,0.1); }
      `}</style>
      <GalaxyBackground />
      <DynamicContextProvider settings={{ environmentId: DYNAMIC_ENV_ID, walletConnectors: [EthereumWalletConnectors] }} theme="dark">
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative" }}>
          <InnerApp />
        </div>
      </DynamicContextProvider>
    </>
  );
}
