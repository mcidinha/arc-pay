import { useState } from "react";

function USDCCoin({ size = 64, glow = false, rotate = 0, opacity = 1, style = {} }) {
  const id = `cg${size}${Math.round(opacity*10)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none"
      style={{
        flexShrink: 0, opacity,
        transform: `rotate(${rotate}deg)`,
        filter: glow
          ? "drop-shadow(0 0 24px rgba(39,117,202,0.9)) drop-shadow(0 0 48px rgba(0,194,255,0.4))"
          : "drop-shadow(0 6px 16px rgba(0,0,0,0.6))",
        transition: "filter 0.3s",
        ...style,
      }}
    >
      <defs>
        <radialGradient id={id} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#5AABF0" />
          <stop offset="45%" stopColor="#2775CA" />
          <stop offset="100%" stopColor="#0F3E80" />
        </radialGradient>
        <radialGradient id={`ch${id}`} cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="76" rx="24" ry="4" fill="rgba(0,0,0,0.4)" />
      <circle cx="40" cy="39" r="37" fill={`url(#${id})`} />
      <circle cx="40" cy="39" r="37" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <ellipse cx="40" cy="20" rx="20" ry="9" fill={`url(#ch${id})`} />
      <circle cx="40" cy="39" r="28" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
      <text x="40" y="47" textAnchor="middle" fontSize="27" fontWeight="800"
        fontFamily="sans-serif" fill="rgba(255,255,255,0.97)">$</text>
      <text x="40" y="60" textAnchor="middle" fontSize="8.5" fontWeight="700"
        fontFamily="sans-serif" fill="rgba(255,255,255,0.7)" letterSpacing="2.5">USDC</text>
    </svg>
  );
}

function ArcMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="ag" x1="4" y1="32" x2="36" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0055CC" />
          <stop offset="60%" stopColor="#0099FF" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
      </defs>
      <path d="M4 32 C4 32 12 6 20 6 C28 6 36 32 36 32" stroke="url(#ag)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <line x1="4" y1="32" x2="36" y2="32" stroke="url(#ag)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="25" x2="12" y2="32" stroke="rgba(0,194,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="20" x2="20" y2="32" stroke="rgba(0,194,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="25" x2="28" y2="32" stroke="rgba(0,194,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="6" r="3" fill="#00D4FF" />
      <circle cx="20" cy="6" r="5" fill="rgba(0,212,255,0.2)" />
    </svg>
  );
}

function Background() {
  // Coins on LEFT side
  const leftCoins = [
    { s: 70, top: "5%",  left: "0%",  rot: -20, op: 0.22, dur: "6s",  del: "0s"   },
    { s: 44, top: "22%", left: "2%",  rot: 10,  op: 0.18, dur: "8s",  del: "1s"   },
    { s: 56, top: "40%", left: "-1%", rot: -15, op: 0.20, dur: "7s",  del: "2s"   },
    { s: 36, top: "58%", left: "3%",  rot: 25,  op: 0.15, dur: "9s",  del: "0.5s" },
    { s: 60, top: "72%", left: "0%",  rot: -10, op: 0.18, dur: "10s", del: "1.5s" },
    { s: 28, top: "88%", left: "4%",  rot: 15,  op: 0.14, dur: "7s",  del: "3s"   },
    { s: 48, top: "14%", left: "6%",  rot: -5,  op: 0.12, dur: "11s", del: "2.5s" },
    { s: 32, top: "50%", left: "5%",  rot: 30,  op: 0.13, dur: "8s",  del: "0.8s" },
  ];
  // Coins on RIGHT side
  const rightCoins = [
    { s: 65, top: "8%",  right: "0%",  rot: 18,  op: 0.22, dur: "7s",  del: "0.3s" },
    { s: 40, top: "25%", right: "2%",  rot: -12, op: 0.17, dur: "9s",  del: "1.2s" },
    { s: 55, top: "42%", right: "-1%", rot: 20,  op: 0.20, dur: "6s",  del: "2.2s" },
    { s: 30, top: "60%", right: "3%",  rot: -25, op: 0.15, dur: "10s", del: "0.7s" },
    { s: 58, top: "75%", right: "0%",  rot: 8,   op: 0.19, dur: "8s",  del: "1.8s" },
    { s: 26, top: "90%", right: "4%",  rot: -18, op: 0.13, dur: "7s",  del: "3.2s" },
    { s: 45, top: "18%", right: "5%",  rot: 15,  op: 0.12, dur: "11s", del: "2.8s" },
    { s: 34, top: "52%", right: "6%",  rot: -30, op: 0.14, dur: "9s",  del: "1s"   },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,80,200,0.20) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(39,117,202,0.12) 0%, transparent 55%), radial-gradient(ellipse 40% 30% at 10% 60%, rgba(0,100,255,0.08) 0%, transparent 50%)",
      }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.045 }}>
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0L0 0 0 48" fill="none" stroke="#00C2FF" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* LEFT coins */}
      {leftCoins.map((c, i) => (
        <div key={`l${i}`} style={{
          position: "absolute", top: c.top, left: c.left,
          opacity: c.op,
          animation: `floatL ${c.dur} ease-in-out ${c.del} infinite alternate`,
        }}>
          <USDCCoin size={c.s} rotate={c.rot} />
        </div>
      ))}

      {/* RIGHT coins */}
      {rightCoins.map((c, i) => (
        <div key={`r${i}`} style={{
          position: "absolute", top: c.top, right: c.right,
          opacity: c.op,
          animation: `floatR ${c.dur} ease-in-out ${c.del} infinite alternate`,
        }}>
          <USDCCoin size={c.s} rotate={c.rot} />
        </div>
      ))}
    </div>
  );
}

function Badge({ children, color = "#00C2FF" }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: `rgba(${color === "#00C2FF" ? "0,194,255" : "16,185,129"},0.10)`,
      border: `1px solid ${color}44`,
      borderRadius: 20, padding: "4px 12px",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, display: "inline-block" }} />
      <span style={{ color, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}

function CopyBtn({ text, small }) {
  const [done, setDone] = useState(false);
  function copy() { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }
  return (
    <button onClick={copy} style={{
      background: done ? "rgba(16,185,129,0.15)" : "rgba(0,194,255,0.10)",
      border: `1px solid ${done ? "rgba(16,185,129,0.4)" : "rgba(0,194,255,0.25)"}`,
      borderRadius: 8, color: done ? "#10B981" : "#00C2FF",
      padding: small ? "5px 10px" : "8px 14px",
      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", transition: "all 0.2s", fontFamily: "inherit",
    }}>
      {done ? "Copiado!" : "Copiar"}
    </button>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", error, prefix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#64849C", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#2775CA", fontWeight: 700, fontSize: 14 }}>{prefix}</span>}
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: focused ? "rgba(0,194,255,0.06)" : "rgba(255,255,255,0.04)",
            border: error ? "1px solid rgba(239,68,68,0.7)" : focused ? "1px solid rgba(0,194,255,0.6)" : "1px solid rgba(255,255,255,0.10)",
            borderRadius: 11, color: "#E8F0F8", fontSize: 14,
            padding: prefix ? "12px 15px 12px 30px" : "12px 15px",
            outline: "none", transition: "all 0.25s", fontFamily: "inherit",
            boxShadow: focused ? "0 0 0 3px rgba(0,194,255,0.10)" : "none",
          }}
        />
      </div>
      {error && <p style={{ color: "#F87171", fontSize: 11, marginTop: 5 }}>&#9888; {error}</p>}
    </div>
  );
}

function CreateScreen({ onViewPay }) {
  const [form, setForm] = useState({ recipient: "", amount: "", description: "" });
  const [errors, setErrors] = useState({});
  const [link, setLink] = useState("");

  function set(k) { return v => setForm(f => ({ ...f, [k]: v })); }

  function validate() {
    const e = {};
    if (!form.recipient.match(/^0x[a-fA-F0-9]{40}$/)) e.recipient = "Endereco invalido (0x + 40 hex)";
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) e.amount = "Valor invalido";
    if (!form.description.trim()) e.description = "Descricao obrigatoria";
    return e;
  }

  function generate() {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    const data = btoa(JSON.stringify({ recipient: form.recipient, amount: form.amount, description: form.description }));
    setLink(window.location.origin + window.location.pathname + "?pay=" + data);
  }

  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <USDCCoin size={76} glow />
          <div style={{
            position: "absolute", bottom: -6, right: -14,
            background: "linear-gradient(135deg,#060D1A,#0A1628)",
            border: "1px solid rgba(0,194,255,0.4)",
            borderRadius: 14, padding: "3px 9px",
            display: "flex", alignItems: "center", gap: 5,
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}>
            <ArcMark size={14} />
            <span style={{ color: "#00C2FF", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em" }}>ARC</span>
          </div>
        </div>
      </div>

      <p style={{ color: "#7A9BB5", fontSize: 12, textAlign: "center", marginBottom: 22, lineHeight: 1.65 }}>
        Peca pagamento em USDC na Arc Testnet.<br />Sem ETH, sem taxas volateis.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Endereco do destinatario" value={form.recipient} onChange={set("recipient")} placeholder="0x..." error={errors.recipient} />
        <Field label="Valor" value={form.amount} onChange={set("amount")} placeholder="0.00" type="number" error={errors.amount} prefix="$" />
        <Field label="Descricao" value={form.description} onChange={set("description")} placeholder="Ex: freelance design, invoice #42..." error={errors.description} />

        <button onClick={generate} style={{
          background: "linear-gradient(135deg, #0055CC 0%, #0099FF 60%, #00C2FF 100%)",
          border: "none", borderRadius: 12, color: "#fff",
          fontSize: 14, fontWeight: 800, padding: "14px 0",
          cursor: "pointer", letterSpacing: "0.05em", fontFamily: "inherit",
          boxShadow: "0 6px 28px rgba(0,100,255,0.45)",
          transition: "transform 0.15s, box-shadow 0.15s",
          textTransform: "uppercase",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(0,100,255,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,100,255,0.45)"; }}
        >
          Gerar Link de Pagamento
        </button>
      </div>

      {link && (
        <div style={{ marginTop: 20, animation: "fadeUp 0.4s ease both" }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0 16px" }} />
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
            <Badge color="#10B981">Link gerado com sucesso</Badge>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 13, overflow: "hidden", marginBottom: 12 }}>
            {[["Para", form.recipient.slice(0,6)+"..."+form.recipient.slice(-4)], ["Valor", form.amount + " USDC"], ["Descricao", form.description]].map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ color: "#64849C", fontSize: 12 }}>{k}</span>
                <span style={{ color: k === "Valor" ? "#00C2FF" : "#C8D8E8", fontSize: 13, fontWeight: k === "Valor" ? 800 : 400 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(0,194,255,0.06)", border: "1px solid rgba(0,194,255,0.18)", borderRadius: 11, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#4A7090", fontSize: 11, fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link}</span>
            <CopyBtn text={link} small />
          </div>
          <button onClick={onViewPay} style={{
            width: "100%", marginTop: 10,
            background: "transparent", border: "1px solid rgba(0,194,255,0.2)",
            borderRadius: 10, color: "#4A7090", fontSize: 12, fontWeight: 600,
            padding: "10px 0", cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.2s", letterSpacing: "0.04em",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.5)"; e.currentTarget.style.color = "#00C2FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.2)"; e.currentTarget.style.color = "#4A7090"; }}
          >
            Ver tela de pagamento (demo)
          </button>
        </div>
      )}
    </div>
  );
}

function PayScreen({ onBack }) {
  const demo = { recipient: "0xAbCd1234...4F2a", amount: "25.00", description: "Freelance design - invoice #42" };
  const [status, setStatus] = useState("pending");

  function simulatePay() {
    setStatus("polling");
    setTimeout(() => setStatus("paid"), 3000);
  }

  if (status === "paid") return (
    <div style={{ textAlign: "center", padding: "12px 0 8px", animation: "fadeUp 0.5s ease both" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <div style={{ position: "relative" }}>
          <USDCCoin size={84} glow />
          <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "2px solid #10B981", animation: "ring 1.6s ease infinite" }} />
          <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "1px solid rgba(16,185,129,0.3)", animation: "ring 1.6s ease 0.4s infinite" }} />
        </div>
      </div>
      <h2 style={{ color: "#10B981", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Pagamento Confirmado!</h2>
      <p style={{ color: "#7A9BB5", fontSize: 13, marginBottom: 4 }}>25.00 USDC enviados com sucesso</p>
      <p style={{ color: "#4A6880", fontSize: 12 }}>Verificado na Arc Testnet</p>
      <div style={{ marginTop: 20, padding: "10px 16px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10 }}>
        <span style={{ color: "#10B981", fontSize: 11, fontFamily: "monospace" }}>Tx: 0x7f3a...c891</span>
      </div>
      <button onClick={onBack} style={{ marginTop: 16, width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#4A6880", fontSize: 12, fontWeight: 600, padding: "10px 0", cursor: "pointer", fontFamily: "inherit" }}>
        Voltar
      </button>
    </div>
  );

  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 20px", marginBottom: 16 }}>
        <USDCCoin size={60} glow />
        <div>
          <p style={{ color: "#64849C", fontSize: 11, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Voce esta pagando</p>
          <p style={{ color: "#F0F6FF", fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
            {demo.amount} <span style={{ color: "#2775CA", fontSize: 18, fontWeight: 700 }}>USDC</span>
          </p>
          <p style={{ color: "#64849C", fontSize: 12, marginTop: 5 }}>{demo.description}</p>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
        {[
          ["Destinatario", demo.recipient, false],
          ["Rede", null, true],
          ["Taxa de rede", "~$0.001 USDC", false],
        ].map(([k, v, isNet], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <span style={{ color: "#64849C", fontSize: 12 }}>{k}</span>
            {isNet ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ArcMark size={16} />
                <span style={{ color: "#00C2FF", fontSize: 12, fontWeight: 700 }}>Arc Testnet</span>
              </div>
            ) : (
              <span style={{ color: k === "Taxa de rede" ? "#10B981" : "#C8D8E8", fontSize: 12, fontFamily: k === "Destinatario" ? "monospace" : "inherit", fontWeight: k === "Taxa de rede" ? 700 : 400 }}>{v}</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        {status === "polling"
          ? <Badge color="#3B82F6">Verificando na blockchain...</Badge>
          : <Badge color="#F59E0B">Aguardando confirmacao</Badge>}
      </div>

      <button onClick={simulatePay} disabled={status === "polling"} style={{
        width: "100%",
        background: status === "polling" ? "rgba(59,130,246,0.2)" : "linear-gradient(135deg, #0055CC, #0099FF 60%, #00C2FF)",
        border: status === "polling" ? "1px solid rgba(59,130,246,0.3)" : "none",
        borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800,
        padding: "14px 0", cursor: status === "polling" ? "not-allowed" : "pointer",
        fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase",
        boxShadow: status === "polling" ? "none" : "0 6px 28px rgba(0,100,255,0.45)",
        transition: "all 0.2s",
      }}>
        {status === "polling" ? "Verificando pagamento..." : "Conectar MetaMask e Pagar"}
      </button>

      <p style={{ color: "#2A4A60", fontSize: 11, textAlign: "center", marginTop: 10 }}>
        Sem ETH necessario - Gas pago em USDC - Arc Testnet
      </p>
      <button onClick={onBack} style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", color: "#2A4A60", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
        Voltar
      </button>
    </div>
  );
}

function HowScreen() {
  return (
    <div style={{ animation: "fadeUp 0.4s ease both" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ position: "relative", width: 120, height: 80 }}>
          <div style={{ position: "absolute", left: 0, top: 18, animation: "floatL 7s ease-in-out 0s infinite alternate" }}><USDCCoin size={46} rotate={-18} opacity={0.65} /></div>
          <div style={{ position: "absolute", left: 32, top: 0, animation: "floatR 6s ease-in-out 0.5s infinite alternate" }}><USDCCoin size={58} glow /></div>
          <div style={{ position: "absolute", right: 0, top: 18, animation: "floatL 8s ease-in-out 1s infinite alternate" }}><USDCCoin size={46} rotate={18} opacity={0.65} /></div>
        </div>
      </div>

      <p style={{ color: "#7A9BB5", fontSize: 13, textAlign: "center", marginBottom: 24, lineHeight: 1.7 }}>
        Pagamentos em USDC na Arc Testnet.<br />Sem ETH. Fees previsiveis em dolar.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { n: "01", title: "Crie o pedido",       desc: "Preencha endereco, valor e descricao. O link e gerado instantaneamente." },
          { n: "02", title: "Compartilhe o link",  desc: "Envie para quem vai pagar. Funciona em qualquer dispositivo." },
          { n: "03", title: "MetaMask conecta",    desc: "A Arc Testnet e adicionada automaticamente a carteira do pagador." },
          { n: "04", title: "Confirmado onchain",  desc: "O app verifica a transacao diretamente na blockchain Arc em tempo real." },
        ].map(({ n, title, desc }) => (
          <div key={n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ minWidth: 42, height: 42, borderRadius: 12, background: "rgba(0,194,255,0.10)", border: "1px solid rgba(0,194,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#00C2FF", fontSize: 13, fontWeight: 800 }}>{n}</span>
            </div>
            <div style={{ paddingTop: 3 }}>
              <p style={{ color: "#D0E4F4", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{title}</p>
              <p style={{ color: "#7A9BB5", fontSize: 12, lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(39,117,202,0.09)", border: "1px solid rgba(39,117,202,0.25)", borderRadius: 12 }}>
        <USDCCoin size={32} glow />
        <p style={{ color: "#7A9BB5", fontSize: 12, lineHeight: 1.6 }}>
          Precisa de USDC de teste?{" "}
          <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" style={{ color: "#4A9FE8", fontWeight: 700, textDecoration: "none" }}>
            faucet.circle.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ArcPay() {
  const [screen, setScreen] = useState("create");
  const tabs = [
    { id: "create", label: "Criar Pedido" },
    { id: "how",    label: "Como Funciona" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #040B18; font-family: 'Syne', sans-serif; min-height: 100vh; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes floatL { from { transform:translateY(0) rotate(-8deg) scale(1) } to { transform:translateY(-28px) rotate(8deg) scale(1.05) } }
        @keyframes floatR { from { transform:translateY(-10px) rotate(6deg) scale(1.03) } to { transform:translateY(18px) rotate(-6deg) scale(0.97) } }
        @keyframes ring { 0% { transform:scale(1); opacity:.7 } 100% { transform:scale(1.3); opacity:0 } }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 2px; }
      `}</style>

      <Background />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 16px" }}>
        <div style={{
          width: "100%", maxWidth: 440,
          background: "rgba(6,14,28,0.93)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 24, padding: "28px 28px 24px",
          boxShadow: "0 48px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 0 1px rgba(0,194,255,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <ArcMark size={36} />
              <div>
                <div style={{ color: "#F0F6FF", fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>Arc Pay</div>
                <div style={{ color: "#2A4A60", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", marginTop: 3 }}>by Mcidinha - USDC Testnet</div>
              </div>
            </div>
            <Badge>Testnet</Badge>
          </div>

          {screen !== "pay" && (
            <div style={{ display: "flex", gap: 4, marginBottom: 22, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4 }}>
              {tabs.map(({ id, label }) => (
                <button key={id} onClick={() => setScreen(id)} style={{
                  flex: 1, padding: "9px 0",
                  background: screen === id ? "rgba(0,100,255,0.20)" : "transparent",
                  border: screen === id ? "1px solid rgba(0,194,255,0.35)" : "1px solid transparent",
                  borderRadius: 9, color: screen === id ? "#00C2FF" : "#3A5A70",
                  fontSize: 11.5, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "inherit", letterSpacing: "0.04em",
                }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {screen === "create" && <CreateScreen onViewPay={() => setScreen("pay")} />}
          {screen === "how"    && <HowScreen />}
          {screen === "pay"    && <PayScreen onBack={() => setScreen("create")} />}
        </div>

        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <ArcMark size={16} />
          <span style={{ color: "#1A3040", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em" }}>
            Arc Testnet - Circle USDC - Built with Claude
          </span>
        </div>
      </div>
    </>
  );
}
