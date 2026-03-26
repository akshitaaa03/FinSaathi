import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

// ─── Utility ────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ─── Sparkles ────────────────────────────────────────────────────────────────
function Sparkles({ active }) {
  const sparks = Array.from({ length: 18 }, (_, i) => i);
  return (
    <AnimatePresence>
      {active &&
        sparks.map((i) => {
          const angle = (i / sparks.length) * 360;
          const r = 80 + Math.random() * 60;
          const x = Math.cos((angle * Math.PI) / 180) * r;
          const y = Math.sin((angle * Math.PI) / 180) * r;
          const colors = ["#c084fc","#f9a8d4","#93c5fd","#6ee7b7","#fcd34d"];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{ opacity: 0, x, y, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: i * 0.03, ease: "easeOut" }}
              style={{
                position: "absolute", top: "50%", left: "50%",
                width: 8, height: 8, borderRadius: "50%",
                background: colors[i % colors.length],
                boxShadow: `0 0 6px ${colors[i % colors.length]}`,
                zIndex: 50, pointerEvents: "none",
              }}
            />
          );
        })}
    </AnimatePresence>
  );
}

// ─── Animated Score Ring ─────────────────────────────────────────────────────
function ScoreRing({ score, max = 100 }) {
  const r = 80, c = 2 * Math.PI * r;
  const pct = score / max;
  const dash = pct * c;
  const [displayed, setDisplayed] = useState(0);
  const [sparkle, setSparkle] = useState(false);

  useEffect(() => {
    let frame, start = null, dur = 1600;
    const tick = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      setDisplayed(Math.round(prog * score));
      if (prog < 1) frame = requestAnimationFrame(tick);
      else { setSparkle(true); setTimeout(() => setSparkle(false), 1400); }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const label = score >= 80 ? "Excellent 🌟" : score >= 60 ? "Good 👍" : score >= 40 ? "Fair 💛" : "Needs Work 💪";
  const gradient = score >= 80 ? ["#a78bfa","#34d399"] : score >= 60 ? ["#60a5fa","#a78bfa"] : score >= 40 ? ["#fbbf24","#f9a8d4"] : ["#f87171","#fbbf24"];

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {/* Blurred blob */}
      <div style={{
        position: "absolute", width: 240, height: 240, borderRadius: "50%",
        background: `radial-gradient(circle, ${gradient[0]}44, ${gradient[1]}22)`,
        filter: "blur(40px)", zIndex: 0,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Sparkles active={sparkle} />
        <svg width={200} height={200} style={{ transform: "rotate(-90deg)" }}>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="100%" stopColor={gradient[1]} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx={100} cy={100} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={14} />
          <motion.circle
            cx={100} cy={100} r={r} fill="none"
            stroke="url(#ringGrad)" strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - dash }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            filter="url(#glow)"
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: 42, fontWeight: 800, fontFamily: "'Playfair Display', serif",
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{displayed}</span>
          <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>/ 100</span>
        </div>
      </div>
      <div style={{
        background: `linear-gradient(135deg, ${gradient[0]}33, ${gradient[1]}22)`,
        border: `1px solid ${gradient[0]}55`,
        borderRadius: 999, padding: "6px 20px",
        color: gradient[0], fontWeight: 600, fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        backdropFilter: "blur(8px)",
      }}>{label}</div>
    </div>
  );
}

// ─── Glass Slider ─────────────────────────────────────────────────────────────
function GlassSlider({ label, icon, value, min, max, step = 1000, onChange, color }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.7)",
        borderRadius: 20, padding: "20px 24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: `linear-gradient(135deg, ${color}33, ${color}11)`,
            border: `1px solid ${color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>{icon}</div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#475569", fontSize: 14 }}>{label}</span>
        </div>
        <span style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#1e293b", fontSize: 16,
          background: `linear-gradient(135deg, ${color}, ${color}99)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{fmt(value)}</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{
          height: 6, borderRadius: 999, background: "rgba(0,0,0,0.06)", position: "relative", overflow: "hidden",
        }}>
          <motion.div
            style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${color}88, ${color})` }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: "absolute", top: -4, left: 0, right: 0, width: "100%",
            opacity: 0, cursor: "pointer", height: 14,
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>{fmt(min)}</span>
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>{fmt(max)}</span>
      </div>
    </motion.div>
  );
}

// ─── Glass Toggle ─────────────────────────────────────────────────────────────
function GlassToggle({ label, icon, value, onChange, color }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{
        background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.7)", borderRadius: 20, padding: "18px 24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: `linear-gradient(135deg, ${color}33, ${color}11)`,
          border: `1px solid ${color}44`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>{icon}</div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#475569", fontSize: 14 }}>{label}</span>
      </div>
      <motion.div
        onClick={() => onChange(!value)}
        whileTap={{ scale: 0.9 }}
        style={{
          width: 48, height: 26, borderRadius: 999, cursor: "pointer",
          background: value ? `linear-gradient(135deg, ${color}, ${color}bb)` : "rgba(0,0,0,0.1)",
          position: "relative", transition: "background 0.3s",
          boxShadow: value ? `0 0 12px ${color}66` : "none",
        }}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{
            position: "absolute", top: 3, width: 20, height: 20,
            borderRadius: "50%", background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Suggestion Card ─────────────────────────────────────────────────────────
function SuggestionCard({ icon, title, value, sub, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
      whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}22, ${gradient[1]}11)`,
        border: `1px solid ${gradient[0]}44`,
        backdropFilter: "blur(20px)",
        borderRadius: 24, padding: "24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        flex: "1 1 200px",
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 16,
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginBottom: 16,
        boxShadow: `0 8px 20px ${gradient[0]}44`,
      }}>{icon}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#64748b", fontSize: 13, marginBottom: 8 }}>{title}</div>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22,
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        marginBottom: 6,
      }}>{value}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>{sub}</div>
    </motion.div>
  );
}

// ─── Chat Bubble ─────────────────────────────────────────────────────────────
function ChatPanel({ onClose, suggestions }) {
  const [msgs, setMsgs] = useState([
    { from: "ai", text: "Namaste! 🙏 I'm your FinSathi AI. I've analysed your finances — ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMsgs(m => [...m, { from: "user", text: userMsg }]);
    setLoading(true);

    const context = suggestions
      ? `User's financial data: Income ₹${suggestions.income}, Expenses ₹${suggestions.expenses}, Savings ₹${suggestions.savings}, Has Loans: ${suggestions.loans}, Score: ${suggestions.score}/100.`
      : "";

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are FinSathi AI, a warm, friendly, and brilliant Indian personal finance mentor. ${context} Give concise, practical advice in 2-3 sentences. Use Indian financial context (SIP, FD, PPF, etc). Be encouraging and use a gentle, supportive tone. Occasionally use emojis.`,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text).join("") || "Hmm, let me think on that! 🤔";
      setMsgs(m => [...m, { from: "ai", text: reply }]);
    } catch {
      setMsgs(m => [...m, { from: "ai", text: "Oops! Had a little hiccup. Try again? 🙏" }]);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        position: "fixed", bottom: 90, right: 24, width: 340, height: 480,
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(30px)",
        borderRadius: 28, border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "0 32px 80px rgba(139,92,246,0.2)",
        display: "flex", flexDirection: "column", zIndex: 100, overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "linear-gradient(135deg, #ede9fe, #dbeafe)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 4px 12px #a78bfa55",
          }}>🤖</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#1e293b" }}>FinSathi AI</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#a78bfa", fontWeight: 600 }}>● Online</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "rgba(0,0,0,0.06)", border: "none", borderRadius: 10,
          width: 30, height: 30, cursor: "pointer", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: m.from === "ai" ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              alignSelf: m.from === "ai" ? "flex-start" : "flex-end",
              maxWidth: "82%",
              background: m.from === "ai"
                ? "linear-gradient(135deg, #ede9fe, #dbeafe)"
                : "linear-gradient(135deg, #a78bfa, #60a5fa)",
              color: m.from === "ai" ? "#374151" : "#fff",
              borderRadius: m.from === "ai" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
              padding: "12px 16px",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6,
              boxShadow: m.from === "user" ? "0 4px 16px #a78bfa44" : "none",
            }}
          >{m.text}</motion.div>
        ))}
        {loading && (
          <div style={{
            alignSelf: "flex-start", background: "linear-gradient(135deg, #ede9fe, #dbeafe)",
            borderRadius: "18px 18px 18px 4px", padding: "12px 20px",
            display: "flex", gap: 5, alignItems: "center",
          }}>
            {[0,1,2].map(i => (
              <motion.div key={i} animate={{ y: [0,-6,0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i*0.15 }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa" }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask your money question..."
          style={{
            flex: 1, border: "1px solid rgba(167,139,250,0.3)", borderRadius: 14,
            padding: "10px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            background: "rgba(255,255,255,0.8)", outline: "none", color: "#374151",
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={send}
          style={{
            width: 42, height: 42, borderRadius: 14, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
            color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px #a78bfa44",
          }}
        >↑</motion.button>
      </div>
    </motion.div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function FinSathiAI() {
  const [step, setStep] = useState("hero"); // hero | form | result
  const [income, setIncome] = useState(80000);
  const [expenses, setExpenses] = useState(45000);
  const [savings, setSavings] = useState(15000);
  const [loans, setLoans] = useState(false);
  const [investments, setInvestments] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState(null);

  const computeScore = () => {
    const savingsRate = savings / income;
    const expenseRate = expenses / income;
    let s = 0;
    s += Math.min(savingsRate * 200, 40);
    s += expenseRate < 0.5 ? 30 : expenseRate < 0.7 ? 20 : 10;
    s += investments ? 20 : 0;
    s += loans ? -10 : 10;
    return Math.round(Math.max(10, Math.min(100, s)));
  };

  const handleAnalyze = () => {
    const sc = computeScore();
    setScore(sc);
    setSuggestions({
      income, expenses, savings, loans, investments, score: sc,
      sipAmt: Math.round(savings * 0.5 / 1000) * 1000,
      emergency: Math.round(expenses * 6 / 1000) * 1000,
      savingTarget: Math.round((income - expenses) * 0.8 / 1000) * 1000,
    });
    setStep("result");
  };

  // Floating blobs
  const blobs = [
    { color: "#c4b5fd", x: "10%", y: "15%", size: 340 },
    { color: "#93c5fd", x: "70%", y: "60%", size: 280 },
    { color: "#86efac", x: "50%", y: "10%", size: 200 },
    { color: "#fca5a5", x: "80%", y: "5%", size: 160 },
    { color: "#fde68a", x: "5%", y: "70%", size: 180 },
  ];

  return (
    <div style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
      background: "linear-gradient(135deg, #f8f6ff 0%, #eff6ff 40%, #f0fdf4 70%, #fff7ed 100%)",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd55; border-radius: 999px; }
      `}</style>

      {/* Animated background blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
          transition={{ repeat: Infinity, duration: 8 + i * 1.5, ease: "easeInOut" }}
          style={{
            position: "fixed", left: b.x, top: b.y,
            width: b.size, height: b.size, borderRadius: "50%",
            background: b.color + "44", filter: "blur(60px)",
            pointerEvents: "none", zIndex: 0,
          }}
        />
      ))}

      {/* ── HERO ── */}
      <AnimatePresence mode="wait">
        {step === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }}
            style={{
              minHeight: "100vh", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "40px 24px", position: "relative", zIndex: 1,
            }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(167,139,250,0.3)",
                borderRadius: 999, padding: "8px 18px", marginBottom: 32,
                boxShadow: "0 4px 20px rgba(167,139,250,0.15)",
              }}
            >
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed" }}>AI-Powered Financial Wellness</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 100 }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(42px, 8vw, 80px)", fontWeight: 800,
                textAlign: "center", lineHeight: 1.1, marginBottom: 20,
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #059669 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                maxWidth: 700,
              }}
            >
              Your AI Money Mentor
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2.5vw, 20px)",
                color: "#64748b", textAlign: "center", marginBottom: 52,
                maxWidth: 480, lineHeight: 1.7, fontWeight: 400,
              }}
            >
              Understand your financial life beautifully. Get personalized insights tailored just for you.
            </motion.p>

            {/* Hero glass card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.65, type: "spring", stiffness: 80 }}
              style={{
                background: "rgba(255,255,255,0.65)", backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: 32, padding: "40px 48px",
                boxShadow: "0 20px 60px rgba(124,58,237,0.12)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 28,
                maxWidth: 400, width: "100%",
              }}
            >
              {["🏦 Income & Expenses Analysis", "📈 Investment Recommendations", "🎯 Personalized Score", "🤖 AI Chat Mentor"].map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + i * 0.1 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    fontFamily: "'DM Sans', sans-serif", color: "#475569",
                    fontSize: 15, fontWeight: 500, width: "100%",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: "linear-gradient(135deg, #ede9fe, #dbeafe)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0,
                  }}>{f.split(" ")[0]}</div>
                  {f.split(" ").slice(1).join(" ")}
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 20px 50px rgba(124,58,237,0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep("form")}
                style={{
                  width: "100%", padding: "16px", borderRadius: 20, border: "none",
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  color: "#fff", fontSize: 16, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  boxShadow: "0 12px 32px rgba(124,58,237,0.35)",
                  letterSpacing: "0.3px",
                }}
              >
                Start My Journey ✨
              </motion.button>
            </motion.div>

            {/* Floating decorative elements */}
            {[
              { emoji: "💰", x: "8%", y: "20%", delay: 1 },
              { emoji: "📊", x: "88%", y: "25%", delay: 1.3 },
              { emoji: "🌱", x: "12%", y: "75%", delay: 0.8 },
              { emoji: "💎", x: "85%", y: "70%", delay: 1.6 },
            ].map((el, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -12, 0] }}
                transition={{ delay: el.delay, y: { repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut" } }}
                style={{
                  position: "absolute", left: el.x, top: el.y,
                  fontSize: 32, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
                  pointerEvents: "none", display: "none",
                }}
              >{el.emoji}</motion.div>
            ))}
          </motion.div>
        )}

        {/* ── FORM ── */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            transition={{ type: "spring", stiffness: 80 }}
            style={{
              maxWidth: 680, margin: "0 auto", padding: "60px 24px 100px",
              position: "relative", zIndex: 1,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 800,
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                marginBottom: 12,
              }}>Tell Me About You</h2>
              <p style={{ color: "#94a3b8", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
                All data stays private — I'll craft your personalized money portrait 💜
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <GlassSlider label="Monthly Income" icon="💼" value={income} min={10000} max={500000} step={5000} onChange={setIncome} color="#7c3aed" />
              <GlassSlider label="Monthly Expenses" icon="🛒" value={expenses} min={5000} max={400000} step={5000} onChange={setExpenses} color="#2563eb" />
              <GlassSlider label="Monthly Savings" icon="🏦" value={savings} min={0} max={300000} step={1000} onChange={setSavings} color="#059669" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <GlassToggle label="Active Loans" icon="💳" value={loans} onChange={setLoans} color="#f59e0b" />
                <GlassToggle label="Investing in SIP" icon="📈" value={investments} onChange={setInvestments} color="#10b981" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(124,58,237,0.35)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                style={{
                  width: "100%", padding: "18px", borderRadius: 20, border: "none",
                  background: "linear-gradient(135deg, #7c3aed, #2563eb, #059669)",
                  color: "#fff", fontSize: 17, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  boxShadow: "0 12px 40px rgba(124,58,237,0.3)",
                  marginTop: 8, letterSpacing: "0.3px",
                }}
              >
                Reveal My Financial Score ✨
              </motion.button>

              <button onClick={() => setStep("hero")}
                style={{
                  background: "none", border: "none", color: "#94a3b8",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer", textAlign: "center",
                }}>
                ← Back
              </button>
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && suggestions && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 120px", position: "relative", zIndex: 1 }}
          >
            <motion.div style={{ textAlign: "center", marginBottom: 52 }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800,
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                marginBottom: 10,
              }}>Your Financial Portrait</h2>
              <p style={{ color: "#94a3b8", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
                Here's what FinSathi sees in your money story 🌸
              </p>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
              style={{
                background: "rgba(255,255,255,0.6)", backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: 32, padding: "48px 40px", textAlign: "center",
                boxShadow: "0 16px 60px rgba(124,58,237,0.1)", marginBottom: 28,
              }}
            >
              <ScoreRing score={score} />
              <div style={{ marginTop: 24, fontFamily: "'DM Sans', sans-serif", color: "#94a3b8", fontSize: 14 }}>
                Based on your savings rate of <strong style={{ color: "#7c3aed" }}>{Math.round(savings / income * 100)}%</strong>
              </div>
            </motion.div>

            {/* Suggestion Cards */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
              <SuggestionCard
                icon="💰" title="Recommended Monthly Savings"
                value={fmt(suggestions.savingTarget)}
                sub="Based on your income-expense gap. Automate this every month!"
                gradient={["#7c3aed", "#a78bfa"]} delay={0.4}
              />
              <SuggestionCard
                icon="📈" title="Suggested SIP Amount"
                value={fmt(suggestions.sipAmt)}
                sub="Start with an index fund SIP. Let compounding do the magic 🚀"
                gradient={["#2563eb", "#60a5fa"]} delay={0.5}
              />
              <SuggestionCard
                icon="🛡️" title="Emergency Fund Goal"
                value={fmt(suggestions.emergency)}
                sub="6 months of expenses. Park it in a liquid fund or FD."
                gradient={["#059669", "#34d399"]} delay={0.6}
              />
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
                marginBottom: 28,
              }}
            >
              {[
                { label: "Savings Rate", value: `${Math.round(savings / income * 100)}%`, color: "#7c3aed" },
                { label: "Expense Ratio", value: `${Math.round(expenses / income * 100)}%`, color: "#2563eb" },
                { label: "Free Cash", value: fmt(income - expenses - savings), color: "#059669" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: "rgba(255,255,255,0.6)", backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.8)", borderRadius: 20,
                  padding: "18px 16px", textAlign: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22,
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}88)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>{stat.value}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#94a3b8", fontSize: 12, marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setChatOpen(true)}
                style={{
                  flex: 1, padding: "16px", borderRadius: 18, border: "none",
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  color: "#fff", fontSize: 15, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(124,58,237,0.3)",
                }}
              >Chat with FinSathi AI 🤖</motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setStep("form")}
                style={{
                  padding: "16px 24px", borderRadius: 18, cursor: "pointer",
                  background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  color: "#7c3aed", fontSize: 15, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >Recalculate ↺</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Chat Button ── */}
      {step !== "hero" && (
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1, boxShadow: "0 16px 40px rgba(124,58,237,0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            position: "fixed", bottom: 24, right: 24, width: 58, height: 58,
            borderRadius: 20, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            color: "#fff", fontSize: 24, zIndex: 99,
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <motion.span animate={{ rotate: chatOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
            {chatOpen ? "✕" : "🤖"}
          </motion.span>
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} suggestions={suggestions} />}
      </AnimatePresence>
    </div>
  );
}
