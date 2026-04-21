import { useState } from "react";

// ── SVG Components ──────────────────────────────────────────────────────────

function USDCCoin({ size = 64, glow = false, rotate = 0, opacity = 1 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 80 80" fill="none"
      style={{
        flexShrink: 0, opacity,
        transform: `rotate(${rotate}deg)`,
        filter: glow
          ? "drop-shadow(0 0 20px rgba(39,117,202,0.8)) drop-shadow(0 0 40px rgba(0,194,255,0.3))"
          : "drop-shadow(0 6px 16px rgba(0,0,0,0.6))",
        transition: "filter 0.3s",
      }}
    >
      <defs>
        <radialGradient id={`cg${size}`} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#5AABF0" />
          <stop offset="45%" stopColor="#2775CA" />
          <stop offset="100%" stopColor="#0F3E80" />
        </radialGradient>
        <radialGradient id={`ch${size}`} cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="40" cy="76" rx="24" ry="4" fill="rgba(0,0,0,0.4)" />
      {/* Body */}
      <circle cx="40" cy="39" r="37" fill={`url(#cg${size})`} />
      {/* Edge shine */}
      <circle cx="40" cy="39" r="37" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      {/* Top highlight */}
      <ellipse cx="40" cy="20" rx="20" ry="9" fill={`url(#ch${size})`} />
      {/* Inner ring */}
      <circle cx="40" cy="39" r="28" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
      {/* $ symbol */}
      <text x="40" y="47" textAnchor="middle" fontSize="27" fontWeight="800"
        fontFamily="'Syne',sans-serif" fill="rgba(255,255,255,0.96)">$</text>
      {/* USDC label */}
      <text x="40" y="60" textAnchor="middle" fontSize="8.5" fontWeight="700"
        fontFamily="'Syne',sans-serif" fill="rgba(255,255,255,0.6)" letterSpacing="2.5">USDC</text>
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
      {/* Main arc */}
      <path d="M4 32 C4 32 12 6 20 6 C28 6 36 32 36 32" stroke="url(#ag)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Base line */}
      <line x1="4" y1="32" x2="36" y2="32" stroke="url(#ag)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Vertical ticks */}
      <line x1="12" y1="25" x2="12" y2="32" stroke="rgba(0,194,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="20" x2="20" y2="32" stroke="rgba(0,194,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="25" x2="28" y2="32" stroke="rgba(0,194,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Apex dot */}
      <circle cx="20" cy="6" r="3" fill="#00D4FF" />
      <circle cx="20" cy="6" r="5" fill="rgba(0,212,255,0.2)" />
    </svg>
  );
}

// ── Background ──────────────────────────────────────────────────────────────

function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Deep gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,80,200,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(39,117,202,0.10) 0%, transparent 55%), radial-gradient(ellipse 40% 30% at 10% 80%, rgba(0,194,255,0.06) 0%, transparent 50%)",
      }} />
      {/* Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0L0 0 0 48" fill="none" stroke="#00C2FF" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Floating coins */}
      {[
        { s: 52, t: "6%",  l: "4%",  r: -12, d: "0s",   du: "7s",  op: 0.13 },
        { s: 30, t: "12%", r: "6%",  ro: 15, d: "1.8s", du: "9s",  op: 0.09 },
        { s: 68, t: "55%", l: "1%",  r: -8,  d: "3.2s", du: "11s", op: 0.08 },
        { s: 38, t: "75%", r: "4%",  ro: -10,d: "0.9s", du: "8s",  op: 0.10 },
        { s: 22, t: "40%", r: "11%", ro: 20, d: "2.5s", du: "6s",  op: 0.08 },
        { s: 44, t: "88%", l: "30%", r: 5,   d: "1.2s", du: "10s", op: 0.07 },
      ].map((c, i) => (
        <div key={i} style={{
          position: "absolute", top: c.t, left: c.l, right: c.r2,
          opacity: c.op, animation: `float ${c.du} ease-in-out ${c.d} infinite alternate`,
        }}>
          <USDCCoin size={c.s} rotate={c.r || 0} />
        </div>
      ))}
    </div>
  );
}

// ── Small Components ────────────────────────────────────────────────────────

function Badge({ children, color = "#00C2FF" }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: `rgba(${color === "#00C2FF" ? "0,194,255" : "16,185,129"},0.08)`,
      border: `1px solid ${color}33`,
      borderRadius: 20, padding: "4px 12px",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, display: "inline-block" }} />
      <span style={{ color, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />;
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
      {done ? "✓ Copiado!" : "⎘ Copiar"}
    </button>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", error, prefix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#3D5A80", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#2775CA", fontWeight: 700, fontSize: 14 }}>{prefix}</span>}
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: focused ? "rgba(0,194,255,0.05)" : "rgba(255,255,255,0.03)",
            border: error ? "1px solid rgba(239,68,68,0.6)" : focused ? "1px solid rgba(0,194,255,0.55)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: 11, color: "#F1F5F9", fontSize: 14,
            padding: prefix ? "12px 15px 12px 30px" : "12px 15px",
            outline: "none", transition: "all 0.25s", fontFamily: "inherit",
            boxShadow: focused ? "0 0 0 3px rgba(0,194,255,0.08)" : "none",
          }}
        />
      </div>
      {error && <p style={{ color: "#EF4444", fontSize: 11, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>⚠ {error}</p>}
    </div>
  );
}

// ── SCREEN: Create ──────────────────────────────────────────────────────────

function CreateScreen({ onViewPay }) {
  const [form, setForm] = useState({ recipient: "", amount: "", description: "" });
  const [errors, setErrors] = useState({});
  const [link, setLink] = useState("");

  function set(k) { return v => setForm(f => ({ ...f, [k]: v })); }

  function validate() {
    const e = {};
    if (!form.recipient.match(/^0x[a-fA-F0-9]{40}$/)) e.recipient = "Endereço inválido (0x + 40 hex)";
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) e.amount = "Valor inválido";
    if (!form.description.trim()) e.description = "Descrição obrigatória";
    return e;
  }

  function generate() {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    const data = btoa(JSON.stringify({ recipient: form.recipient, amount: form.amount, description: form.description }));
    setLink("https://arc-pay.vercel.app/pay?d=" + data);
  }

  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      {/* Hero coin */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, position: "relative" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <USDCCoin size={76} glow />
          {/* Arc badge on coin */}
          <div style={{
            position: "absolute", bottom: -6, right: -14,
            background: "linear-gradient(135deg,#060D1A,#0A1628)",
            border: "1px solid rgba(0,194,255,0.35)",
            borderRadius: 14, padding: "3px 9px",
            display: "flex", alignItems: "center", gap: 5,
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}>
            <ArcMark size={14} />
            <span style={{ color: "#00C2FF", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em" }}>ARC</span>
          </div>
        </div>
      </div>

      <p style={{ color: "#3D5A80", fontSize: 12, textAlign: "center", marginBottom: 22, lineHeight: 1.65, letterSpacing: "0.01em" }}>
        Peça pagamento em USDC na Arc Testnet.<br />Sem ETH, sem taxas voláteis.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Endereço do destinatário" value={form.recipient} onChange={set("recipient")} placeholder="0x..." error={errors.recipient} />
        <Field label="Valor" value={form.amount} onChange={set("amount")} placeholder="0.00" type="number" error={errors.amount} prefix="$" />
        <Field label="Descrição" value={form.description} onChange={set("description")} placeholder="Ex: freelance design, invoice #42..." error={errors.description} />

        <button onClick={generate} style={{
          background: "linear-gradient(135deg, #0055CC 0%, #0099FF 60%, #00C2FF 100%)",
          border: "none", borderRadius: 12, color: "#fff",
          fontSize: 14, fontWeight: 800, padding: "14px 0",
          cursor: "pointer", letterSpacing: "0.05em", fontFamily: "inherit",
          boxShadow: "0 6px 28px rgba(0,100,255,0.4), 0 2px 8px rgba(0,0,0,0.3)",
          transition: "transform 0.15s, box-shadow 0.15s",
          textTransform: "uppercase",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(0,100,255,0.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,100,255,0.4)"; }}
        >
          Gerar Link de Pagamento
        </button>
      </div>

      {link && (
        <div style={{ marginTop: 20, animation: "fadeUp 0.4s ease both" }}>
          <Divider />
          <div style={{ margin: "16px 0 12px", display: "flex", justifyContent: "center" }}>
            <Badge color="#10B981">Link gerado com sucesso</Badge>
          </div>

          {/* Summary card */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 13, overflow: "hidden", marginBottom: 12,
          }}>
            {[
              ["Para", form.recipient.slice(0,6)+"..."+form.recipient.slice(-4)],
              ["Valor", form.amount + " USDC"],
              ["Descrição", form.description],
            ].map(([k, v], i) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 15px",
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <span style={{ color: "#3D5A80", fontSize: 12 }}>{k}</span>
                <span style={{ color: k === "Valor" ? "#00C2FF" : "#94A3B8", fontSize: 13, fontWeight: k === "Valor" ? 800 : 400 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Link row */}
          <div style={{ background: "rgba(0,194,255,0.05)", border: "1px solid rgba(0,194,255,0.15)", borderRadius: 11, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#3D5A80", fontSize: 11, fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link}</span>
            <CopyBtn text={link} small />
          </div>

          {/* Preview button */}
          <button onClick={onViewPay} style={{
            width: "100%", marginTop: 10,
            background: "transparent", border: "1px solid rgba(0,194,255,0.2)",
            borderRadius: 10, color: "#3D5A80", fontSize: 12, fontWeight: 600,
            padding: "10px 0", cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.2s", letterSpacing: "0.04em",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.4)"; e.currentTarget.style.color = "#00C2FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.2)"; e.currentTarget.style.color = "#3D5A80"; }}
          >
            → Ver tela de pagamento (demo)
          </button>
        </div>
      )}
    </div>
  );
}

// ── SCREEN: Pay ─────────────────────────────────────────────────────────────

function PayScreen({ onBack }) {
  const demo = { recipient: "0xAbCd...4F2a", amount: "25.00", description: "Freelance design — invoice #42" };
  const [status, setStatus] = useState("pending");

  function simulatePay() {
    setStatus("polling");
    setTimeout(() => setStatus("paid"), 3000);
  }

  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      {status === "paid" ? (
        <div style={{ textAlign: "center", padding: "12px 0 8px", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18, position: "relative" }}>
            <div style={{ position: "relative" }}>
              <USDCCoin size={84} glow />
              <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "2px solid #10B981", animation: "ring 1.6s ease infinite" }} />
              <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "1px solid rgba(16,185,129,0.3)", animation: "ring 1.6s ease 0.4s infinite" }} />
            </div>
          </div>
          <h2 style={{ color: "#10B981", fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>Pagamento Confirmado!</h2>
          <p style={{ color: "#3D5A80", fontSize: 13, marginBottom: 4 }}>25.00 USDC enviados com sucesso</p>
          <p style={{ color: "#1E3A5F", fontSize: 12 }}>Verificado na Arc Testnet ✓</p>
          <div style={{ marginTop: 20, padding: "10px 16px", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10 }}>
            <span style={{ color: "#10B981", fontSize: 11, fontFamily: "monospace" }}>Tx: 0x7f3a...c891 ↗</span>
          </div>
          <button onClick={onBack} style={{
            marginTop: 16, width: "100%",
            background: "transparent", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10, color: "#3D5A80", fontSize: 12, fontWeight: 600,
            padding: "10px 0", cursor: "pointer", fontFamily: "inherit",
          }}>
            ← Voltar
          </button>
        </div>
      ) : (
        <>
          {/* Amount hero */}
          <div style={{
            display: "flex", alignItems: "center", gap: 18,
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: "18px 20px", marginBottom: 16,
          }}>
            <USDCCoin size={60} glow />
            <div>
              <p style={{ color: "#3D5A80", fontSize: 11, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Você está pagando</p>
              <p style={{ color: "#F1F5F9", fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {demo.amount} <span style={{ color: "#2775CA", fontSize: 18, fontWeight: 700 }}>USDC</span>
              </p>
              <p style={{ color: "#3D5A80", fontSize: 12, marginTop: 5 }}>{demo.description}</p>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ color: "#3D5A80", fontSize: 12 }}>Destinatário</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#94A3B8", fontSize: 12, fontFamily: "monospace" }}>{demo.recipient}</span>
                <CopyBtn text={demo.recipient} small />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ color: "#3D5A80", fontSize: 12 }}>Rede</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ArcMark size={16} />
                <span style={{ color: "#00C2FF", fontSize: 12, fontWeight: 700 }}>Arc Testnet</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px" }}>
              <span style={{ color: "#3D5A80", fontSize: 12 }}>Taxa de rede</span>
              <span style={{ color: "#10B981", fontSize: 12, fontWeight: 700 }}>~$0.001 USDC</span>
            </div>
          </div>

          {/* Status */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            {status === "polling"
              ? <Badge color="#3B82F6">Verificando na blockchain...</Badge>
              : <Badge color="#F59E0B">Aguardando confirmação</Badge>}
          </div>

          <button onClick={simulatePay} disabled={status === "polling"} style={{
            width: "100%",
            background: status === "polling"
              ? "rgba(59,130,246,0.2)"
              : "linear-gradient(135deg, #0055CC, #0099FF 60%, #00C2FF)",
            border: status === "polling" ? "1px solid rgba(59,130,246,0.3)" : "none",
            borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800,
            padding: "14px 0", cursor: status === "polling" ? "not-allowed" : "pointer",
            fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase",
            boxShadow: status === "polling" ? "none" : "0 6px 28px rgba(0,100,255,0.4)",
            transition: "all 0.2s",
          }}>
            {status === "polling" ? "⟳  Verificando pagamento..." : "🦊  Conectar MetaMask e Pagar"}
          </button>

          <p style={{ color: "#1E293B", fontSize: 11, textAlign: "center", marginTop: 10, letterSpacing: "0.02em" }}>
            Sem ETH necessário · Gas pago em USDC · Arc Testnet
          </p>

          <button onClick={onBack} style={{
            display: "block", margin: "10px auto 0",
            background: "none", border: "none", color: "#2D3F55",
            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          }}>
            ← Voltar
          </button>
        </>
      )}
    </div>
  );
}

// ── SCREEN: How It Works ────────────────────────────────────────────────────

function HowScreen() {
  return (
    <div style={{ animation: "fadeUp 0.4s ease both" }}>
      {/* Stacked coins */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ position: "relative", width: 100, height: 72 }}>
          <div style={{ position: "absolute", left: 0, top: 16 }}><USDCCoin size={44} rotate={-18} opacity={0.5} /></div>
          <div style={{ position: "absolute", left: 28, top: 0 }}><USDCCoin size={56} glow /></div>
          <div style={{ position: "absolute", right: 0, top: 16 }}><USDCCoin size={44} rotate={18} opacity={0.5} /></div>
        </div>
      </div>

      <p style={{ color: "#3D5A80", fontSize: 12, textAlign: "center", marginBottom: 22, lineHeight: 1.7 }}>
        Pagamentos em USDC na Arc Testnet.<br />Sem ETH. Fees previsíveis em dólar.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { n: "01", icon: "01", title: "Crie o pedido", desc: "Preencha endereço, valor e descrição. O link é gerado instantaneamente." },
          { n: "02", icon: "02", title: "Compartilhe o link", desc: "Envie para quem vai pagar. Funciona em qualquer dispositivo." },
          { n: "03", icon: "03", title: "MetaMask conecta", desc: "A Arc Testnet é adicionada automaticamente à carteira do pagador." },
          { n: "04", icon: "04", title: "Confirmado onchain", desc: "O app verifica a transação diretamente na blockchain Arc em tempo real." },
        ].map(({ n, icon, title, desc }) => (
          <div key={n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{
              minWidth: 40, height: 40, borderRadius: 11,
              background: "rgba(0,194,255,0.07)", border: "1px solid rgba(0,194,255,0.15)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 18 }}>{n}</span>
            </div>
            <div style={{ paddingTop: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ color: "#1E3A5F", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em" }}>{n}</span>
                <span style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 700 }}>{title}</span>
              </div>
              <p style={{ color: "#3D5A80", fontSize: 12, lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: "rgba(39,117,202,0.07)", border: "1px solid rgba(39,117,202,0.18)", borderRadius: 12 }}>
        <USDCCoin size={30} />
        <p style={{ color: "#3D5A80", fontSize: 12, lineHeight: 1.6 }}>
          Precisa de USDC de teste?{" "}
          <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" style={{ color: "#2775CA", fontWeight: 700, textDecoration: "none" }}>faucet.circle.com</a>
        </p>
      </div>
    </div>
  );
}

// ── MAIN APP ────────────────────────────────────────────────────────────────

export default function ArcPay() {
  const [screen, setScreen] = useState("create"); // create | pay | how

  const tabs = [
    { id: "create", label: "Criar Pedido" },
    { id: "how",    label: "Como Funciona" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #050C1A; font-family: 'Syne', sans-serif; min-height: 100vh; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float   { from { transform:translateY(0) rotate(-6deg) } to { transform:translateY(-22px) rotate(6deg) } }
        @keyframes ring    { 0% { transform:scale(1); opacity:.7 } 100% { transform:scale(1.3); opacity:0 } }
        @keyframes spin    { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 2px; }
      `}</style>

      <Background />

      <div style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "28px 16px",
      }}>
        {/* Card */}
        <div style={{
          width: "100%", maxWidth: 440,
          background: "rgba(8,16,32,0.92)",
          backdropFilter: "blur(28px)",
          border: "1px solid rgba(255,255,255,0.065)",
          borderRadius: 24, padding: "28px 28px 24px",
          boxShadow: "0 48px 120px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(0,194,255,0.03)",
        }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <ArcMark size={36} />
              <div>
                <div style={{ color: "#F1F5F9", fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  Arc Pay
                </div>
                <div style={{ color: "#1E3A5F", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", marginTop: 3 }}>
                  by Mcidinha · USDC Testnet
                </div>
              </div>
            </div>
            <Badge>Testnet</Badge>
          </div>

          {/* Tabs — hide when on pay screen */}
          {screen !== "pay" && (
            <div style={{ display: "flex", gap: 4, marginBottom: 22, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4 }}>
              {tabs.map(({ id, label }) => (
                <button key={id} onClick={() => setScreen(id)} style={{
                  flex: 1, padding: "9px 0",
                  background: screen === id ? "rgba(0,100,255,0.18)" : "transparent",
                  border: screen === id ? "1px solid rgba(0,194,255,0.30)" : "1px solid transparent",
                  borderRadius: 9, color: screen === id ? "#00C2FF" : "#2D3F55",
                  fontSize: 11.5, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "inherit", letterSpacing: "0.04em",
                }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          {screen === "create" && <CreateScreen onViewPay={() => setScreen("pay")} />}
          {screen === "how"    && <HowScreen />}
          {screen === "pay"    && <PayScreen onBack={() => setScreen("create")} />}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <ArcMark size={16} />
          <span style={{ color: "#1A2A3A", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em" }}>
            Arc Testnet · Circle USDC · Built with Claude
          </span>
        </div>
      </div>
    </>
  );
}
