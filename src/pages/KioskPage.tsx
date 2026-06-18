import { useState, useEffect, useRef } from "react";
import { getStudentsTriο, getCheckIns, saveCheckIns } from "../lib/trioData";
import type { TRIOStudent, CheckIn } from "../lib/trioData";

// ── Design tokens ──────────────────────────────────────────────
const RED   = "#D72638";
const GOLD  = "#D4AF37";
const GOLDB = "rgba(212,175,55,0.35)";
const GOLDT = "linear-gradient(135deg, #FFF4B0 0%, #E6C76B 30%, #D4AF37 60%, #F7E8A4 100%)";
const CARD  = "#111111";
const CARD2 = "#181818";
const BDR   = "rgba(255,255,255,0.08)";
const MUTED = "rgba(255,255,255,0.45)";
const SUB   = "rgba(255,255,255,0.7)";

// ── Types ───────────────────────────────────────────────────────
type Mode = "in" | "out";
type Step =
  | "home"
  | "method"
  | "search"
  | "confirm"
  | "reason"
  | "success"
  | "co-confirm"
  | "co-success"
  | "not-found";

// ── Reason options ──────────────────────────────────────────────
const REASONS = [
  { id: "Appointment",      en: "Appointment",      es: "Cita",              icon: "📅" },
  { id: "Advisor Meeting",  en: "Advisor Meeting",  es: "Reunión Asesor",    icon: "👤" },
  { id: "Workshop",         en: "Workshop",         es: "Taller",            icon: "📚" },
  { id: "Event",            en: "Event",            es: "Evento",            icon: "⭐" },
  { id: "Study Space",      en: "Study Space",      es: "Área de Estudio",   icon: "📖" },
  { id: "Computer Lab",     en: "Computer Lab",     es: "Lab de Cómputo",    icon: "💻" },
  { id: "FAFSA Help",       en: "FAFSA Help",       es: "Ayuda FAFSA",       icon: "📋" },
  { id: "Transfer Help",    en: "Transfer Help",    es: "Transferencia",     icon: "🎓" },
  { id: "Career Services",  en: "Career Services",  es: "Servicios Carrera", icon: "💼" },
  { id: "General Visit",    en: "General Visit",    es: "Visita General",    icon: "🏠" },
  { id: "Other",            en: "Other",            es: "Otro",              icon: "✦"  },
];

// ── Clock ───────────────────────────────────────────────────────
function Clock({ lang }: { lang: "en" | "es" }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ textAlign: "center", marginBottom: 40 }}>
      <p style={{ fontSize: 64, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}>
        {now.toLocaleTimeString(lang === "es" ? "es" : "en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
      </p>
      <p style={{ fontSize: 15, color: MUTED, marginTop: 8, letterSpacing: "0.04em" }}>
        {now.toLocaleDateString(lang === "es" ? "es" : "en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

// ── Avatar ──────────────────────────────────────────────────────
function Avatar({ name, size = 96 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#D72638", "#2563EB", "#7C3AED", "#059669", "#D97706", "#DC2626"];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[idx],
      border: `3px solid ${GOLDB}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: size * 0.35, fontWeight: 900, color: "#fff" }}>{initials}</span>
    </div>
  );
}

// ── Gold button ─────────────────────────────────────────────────
function GoldBtn({ children, onClick, disabled, style: extStyle }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: disabled ? "#2a2a2a" : GOLDT,
        border: "none",
        borderRadius: 16,
        color: disabled ? MUTED : "#000",
        fontWeight: 800,
        fontSize: 18,
        cursor: disabled ? "not-allowed" : "pointer",
        transform: hover && !disabled ? "scale(1.02)" : "scale(1)",
        boxShadow: hover && !disabled ? `0 0 40px rgba(212,175,55,0.35)` : "none",
        transition: "all 0.2s",
        letterSpacing: "0.02em",
        ...extStyle,
      }}
    >
      {children}
    </button>
  );
}

// ── Red button ──────────────────────────────────────────────────
function RedBtn({ children, onClick, disabled, style: extStyle }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: disabled ? "#2a2a2a" : RED,
        border: "none",
        borderRadius: 16,
        color: disabled ? MUTED : "#fff",
        fontWeight: 800,
        fontSize: 18,
        cursor: disabled ? "not-allowed" : "pointer",
        transform: hover && !disabled ? "scale(1.02)" : "scale(1)",
        boxShadow: hover && !disabled ? `0 0 40px rgba(215,38,56,0.4)` : "none",
        transition: "all 0.2s",
        letterSpacing: "0.02em",
        ...extStyle,
      }}
    >
      {children}
    </button>
  );
}

// ── Ghost button ────────────────────────────────────────────────
function GhostBtn({ children, onClick, style: extStyle }: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(255,255,255,0.05)" : "transparent",
        border: `1px solid ${BDR}`,
        borderRadius: 14,
        color: hover ? "#fff" : MUTED,
        fontWeight: 500,
        fontSize: 15,
        cursor: "pointer",
        transition: "all 0.18s",
        ...extStyle,
      }}
    >
      {children}
    </button>
  );
}

// ── uid ─────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }

// ── Main component ──────────────────────────────────────────────
export default function KioskPage() {
  const [step, setStep]               = useState<Step>("home");
  const [mode, setMode]               = useState<Mode>("in");
  const [lang, setLang]               = useState<"en" | "es">("en");
  const [query, setQuery]             = useState("");
  const [results, setResults]         = useState<TRIOStudent[]>([]);
  const [student, setStudent]         = useState<TRIOStudent | null>(null);
  const [reason, setReason]           = useState("");
  const [activeCheckIn, setActiveCheckIn] = useState<CheckIn | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const L = lang;

  const t = {
    welcome:      L === "es" ? "Bienvenido a TRIO Connect"              : "Welcome to TRIO Connect",
    sub:          L === "es" ? "Sistema de Registro de Estudiantes"     : "Student Check-In System",
    checkIn:      L === "es" ? "Registrarse"                            : "Check In",
    checkOut:     L === "es" ? "Salir"                                  : "Check Out",
    howCheckIn:   L === "es" ? "¿Cómo desea registrarse?"               : "How would you like to check in?",
    howCheckOut:  L === "es" ? "¿Cómo desea salir?"                     : "How would you like to check out?",
    typeName:     L === "es" ? "Escribir Nombre"                        : "Type Your Name",
    typeId:       L === "es" ? "Ingresar Número de ID"                  : "Enter Student ID",
    scanQR:       L === "es" ? "Escanear Código QR"                     : "Scan QR Code",
    searchPlh:    L === "es" ? "Nombre o número de ID…"                 : "Name or student ID number…",
    searching:    L === "es" ? "Buscando…"                              : "Searching…",
    isThisYou:    L === "es" ? "¿Es usted?"                             : "Is this you?",
    yesThatsMe:   L === "es" ? "Sí, soy yo"                            : "Yes, that's me",
    notMe:        L === "es" ? "No soy yo"                              : "Not me",
    whyHere:      L === "es" ? "¿Por qué visita hoy?"                   : "Why are you visiting today?",
    checkedIn:    L === "es" ? "¡Registrado!"                           : "Checked In!",
    checkedOut:   L === "es" ? "¡Hasta Pronto!"                         : "See You Later!",
    resetting:    L === "es" ? "Reiniciando en"                         : "Resetting in",
    notFound:     L === "es" ? "Estudiante No Encontrado"               : "Student Not Found",
    notFoundSub:  L === "es" ? "Por favor visite la recepción."         : "Please see the front desk for assistance.",
    tryAgain:     L === "es" ? "Intentar de Nuevo"                      : "Try Again",
    back:         L === "es" ? "Regresar"                               : "Back",
    confirmOut:   L === "es" ? "Confirmar Salida"                       : "Confirm Check-Out",
    activeVisit:  L === "es" ? "Visita Activa"                          : "Active Visit",
    checkedInAt:  L === "es" ? "Registrado a las"                       : "Checked in at",
    confirmBtn:   L === "es" ? "Confirmar Salida"                       : "Check Out Now",
    visitReason:  L === "es" ? "Razón"                                  : "Reason",
    duration:     L === "es" ? "Duración"                               : "Duration",
    powered:      L === "es" ? "Desarrollado por Nova Systems"          : "Powered by Nova Systems",
    noResults:    L === "es" ? "Ningún resultado. Intente otro término." : "No results. Try a different term.",
    typeToSearch: L === "es" ? "Escriba para buscar…"                   : "Start typing to search…",
    scanDesc:     L === "es" ? "Escanee el código QR de su ID estudiantil" : "Scan the QR code on your student ID",
    checkInTitle: L === "es" ? "Registrar Entrada"                      : "Check In",
    checkOutTitle: L === "es" ? "Registrar Salida"                      : "Check Out",
  };

  // Live search
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    const all = getStudentsTriο();
    setResults(
      all.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      ).slice(0, 6)
    );
  }, [query]);

  // Auto-focus input when on search screen
  useEffect(() => {
    if (step === "search") {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [step]);

  // Countdown for success screen
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    if (step !== "success" && step !== "co-success") return;
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(interval); resetAll(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const resetAll = () => {
    setStep("home"); setMode("in"); setQuery(""); setResults([]);
    setStudent(null); setReason(""); setActiveCheckIn(null); setCountdown(5);
  };

  const selectStudent = (s: TRIOStudent) => {
    setStudent(s);
    if (mode === "out") {
      const today = new Date().toISOString().split("T")[0];
      const active = getCheckIns().find(
        (c) => c.studentId === s.studentId && !c.checkOutTime && c.date === today
      );
      if (active) { setActiveCheckIn(active); setStep("co-confirm"); }
      else { setActiveCheckIn(null); setStep("co-confirm"); }
    } else {
      setStep("confirm");
    }
  };

  const doCheckIn = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const ci: CheckIn = {
      id: uid(),
      studentId: student!.studentId,
      studentName: student!.name,
      purpose: reason,
      checkInTime: timeStr,
      advisor: student!.advisor,
      date: today,
    };
    saveCheckIns([ci, ...getCheckIns()]);
    setStep("success");
  };

  const doCheckOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const all = getCheckIns();
    if (activeCheckIn) {
      const updated = all.map((c) =>
        c.id === activeCheckIn.id ? { ...c, checkOutTime: timeStr } : c
      );
      saveCheckIns(updated);
    }
    setStep("co-success");
  };

  const getDuration = () => {
    if (!activeCheckIn) return "—";
    const [timeStr, period] = [
      activeCheckIn.checkInTime.replace(/\s?(AM|PM)/i, ""),
      activeCheckIn.checkInTime.match(/AM|PM/i)?.[0] ?? "AM",
    ];
    const [hStr, mStr] = timeStr.split(":");
    let h = parseInt(hStr);
    const m = parseInt(mStr);
    if (period.toUpperCase() === "PM" && h !== 12) h += 12;
    if (period.toUpperCase() === "AM" && h === 12) h = 0;
    const ciDate = new Date();
    ciDate.setHours(h, m, 0, 0);
    const diff = Math.round((Date.now() - ciDate.getTime()) / 60000);
    if (diff < 1) return "< 1 min";
    if (diff < 60) return `${diff} min`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  // ── Background decoration ──────────────────────────────────────
  const bg = (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 1200, height: 1200, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "70%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(215,38,56,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />
    </>
  );

  // ── Header bar ──────────────────────────────────────────────────
  const header = (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>TRIO Connect</p>
          <p style={{ fontSize: 10, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Student Check-In System</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {(["en", "es"] as const).map((l) => (
          <button key={l} onClick={() => setLang(l)}
            style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${lang === l ? GOLDB : BDR}`, background: lang === l ? "rgba(212,175,55,0.1)" : "transparent", color: lang === l ? GOLD : MUTED, fontSize: 12, fontWeight: lang === l ? 800 : 400, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );

  // ── Footer ──────────────────────────────────────────────────────
  const footer = (
    <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {t.powered} · CT State Community College
      </p>
    </div>
  );

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    background: "#050505",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "100px 24px 60px",
  };

  const center: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  // ══════════════════════════════════════════════════════════════
  // HOME
  // ══════════════════════════════════════════════════════════════
  if (step === "home") return (
    <div style={wrap}>
      {bg}{header}{footer}
      <div style={{ ...center, maxWidth: 560, textAlign: "center" }}>
        <Clock lang={lang} />
        {/* Logo mark */}
        <div style={{ width: 72, height: 72, borderRadius: 20, background: RED, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 0 60px rgba(215,38,56,0.25)" }}>
          <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
          </svg>
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 10px" }}>{t.welcome}</h1>
        <p style={{ fontSize: 17, color: MUTED, marginBottom: 52, letterSpacing: "0.01em" }}>{t.sub}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 380 }}>
          <RedBtn
            onClick={() => { setMode("in"); setStep("method"); }}
            style={{ width: "100%", height: 72, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {t.checkIn}
          </RedBtn>
          <GhostBtn
            onClick={() => { setMode("out"); setStep("method"); }}
            style={{ width: "100%", height: 72, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, border: `1px solid ${GOLDB}`, color: GOLD, fontSize: 18, fontWeight: 700 }}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {t.checkOut}
          </GhostBtn>
        </div>

        <p style={{ marginTop: 32, fontSize: 13, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
          {lang === "es" ? "TOCA UN BOTÓN PARA COMENZAR" : "TAP A BUTTON TO BEGIN"}
        </p>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // METHOD
  // ══════════════════════════════════════════════════════════════
  if (step === "method") return (
    <div style={wrap}>
      {bg}{header}{footer}
      <div style={{ ...center, maxWidth: 560 }}>
        <p style={{ fontSize: 13, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>
          {mode === "in" ? t.checkInTitle : t.checkOutTitle}
        </p>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: 40, textAlign: "center" }}>
          {mode === "in" ? t.howCheckIn : t.howCheckOut}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          {[
            { icon: "⌨", label: t.typeName, desc: lang === "es" ? "Escriba su nombre completo" : "Type your full name", method: "name" },
            { icon: "#", label: t.typeId,   desc: lang === "es" ? "Ingrese su número de ID" : "Enter your student ID number", method: "id" },
            { icon: "◻", label: t.scanQR,  desc: lang === "es" ? "Escanee el QR en su ID" : "Scan the QR code on your ID", method: "qr" },
          ].map((opt) => (
            <button key={opt.method}
              onClick={() => setStep("search")}
              style={{
                background: CARD, border: `1px solid ${BDR}`,
                borderRadius: 16, padding: "22px 24px",
                display: "flex", alignItems: "center", gap: 18,
                cursor: "pointer", textAlign: "left", transition: "all 0.18s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLDB; e.currentTarget.style.background = "#181818"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.background = CARD; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#1e1e1e", border: `1px solid ${BDR}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {opt.icon}
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{opt.label}</p>
                <p style={{ fontSize: 13, color: MUTED, margin: "4px 0 0" }}>{opt.desc}</p>
              </div>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={MUTED} strokeWidth={2} style={{ marginLeft: "auto", flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          ))}
        </div>

        <GhostBtn onClick={resetAll} style={{ marginTop: 28, padding: "12px 32px" }}>{t.back}</GhostBtn>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // SEARCH
  // ══════════════════════════════════════════════════════════════
  if (step === "search") return (
    <div style={wrap}>
      {bg}{header}{footer}
      <div style={{ ...center, maxWidth: 560 }}>
        <p style={{ fontSize: 13, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>
          {mode === "in" ? t.checkInTitle : t.checkOutTitle}
        </p>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: 28, textAlign: "center" }}>
          {lang === "es" ? "Buscar Estudiante" : "Find Student"}
        </h2>

        <div style={{ position: "relative", width: "100%", marginBottom: 20 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={MUTED} strokeWidth={2}
            style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlh}
            style={{
              width: "100%", boxSizing: "border-box",
              background: CARD, border: `2px solid ${BDR}`,
              borderRadius: 16, padding: "20px 20px 20px 52px",
              fontSize: 18, color: "#fff", outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = GOLDB; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = BDR; }}
          />
        </div>

        {/* Results */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          {query.trim() === "" && (
            <p style={{ textAlign: "center", color: MUTED, fontSize: 14, padding: "20px 0" }}>{t.typeToSearch}</p>
          )}
          {query.trim() !== "" && results.length === 0 && (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <p style={{ color: MUTED, fontSize: 15 }}>{t.noResults}</p>
              <button onClick={() => setStep("not-found")}
                style={{ marginTop: 12, padding: "10px 24px", borderRadius: 10, background: RED, border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                {lang === "es" ? "Ver ayuda" : "Get help"}
              </button>
            </div>
          )}
          {results.map((s) => (
            <button key={s.id}
              onClick={() => selectStudent(s)}
              style={{
                background: CARD, border: `1px solid ${BDR}`,
                borderRadius: 14, padding: "16px 18px",
                display: "flex", alignItems: "center", gap: 14,
                cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLDB; e.currentTarget.style.background = CARD2; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.background = CARD; }}
            >
              <Avatar name={s.name} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>{s.name}</p>
                <p style={{ fontSize: 13, color: MUTED, margin: "3px 0 0" }}>{s.studentId} · {s.school}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 12, color: s.status === "active" ? "#22c55e" : RED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{s.status}</p>
                <p style={{ fontSize: 11, color: MUTED, margin: "3px 0 0" }}>{s.advisor}</p>
              </div>
            </button>
          ))}
        </div>

        <GhostBtn onClick={() => setStep("method")} style={{ marginTop: 28, padding: "12px 32px" }}>{t.back}</GhostBtn>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // CONFIRM (check-in)
  // ══════════════════════════════════════════════════════════════
  if (step === "confirm" && student) return (
    <div style={wrap}>
      {bg}{header}{footer}
      <div style={{ ...center, maxWidth: 460, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28 }}>{t.isThisYou}</p>

        <Avatar name={student.name} size={110} />

        <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", margin: "20px 0 6px" }}>{student.name}</h2>
        <p style={{ fontSize: 16, color: MUTED, marginBottom: 6 }}>{student.studentId}</p>
        <p style={{ fontSize: 14, color: MUTED, marginBottom: 4 }}>{student.school}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(212,175,55,0.08)", border: `1px solid ${GOLDB}`, borderRadius: 20, padding: "6px 14px", marginBottom: 36 }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>{student.advisor}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <RedBtn onClick={() => setStep("reason")} style={{ width: "100%", height: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {t.yesThatsMe} →
          </RedBtn>
          <GhostBtn onClick={() => { setStudent(null); setStep("search"); setQuery(""); }}
            style={{ width: "100%", height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {t.notMe}
          </GhostBtn>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // REASON
  // ══════════════════════════════════════════════════════════════
  if (step === "reason") return (
    <div style={wrap}>
      {bg}{header}{footer}
      <div style={{ ...center, maxWidth: 680 }}>
        <h2 style={{ fontSize: 34, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8, textAlign: "center" }}>{t.whyHere}</h2>
        <p style={{ fontSize: 15, color: MUTED, marginBottom: 36, textAlign: "center" }}>
          {lang === "es" ? "Seleccione una opción" : "Select one option"}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, width: "100%" }}>
          {REASONS.map((r) => {
            const selected = reason === r.id;
            return (
              <button key={r.id}
                onClick={() => {
                  setReason(r.id);
                  setTimeout(() => doCheckIn(), 120);
                }}
                style={{
                  background: selected ? `rgba(215,38,56,0.15)` : CARD,
                  border: `2px solid ${selected ? RED : BDR}`,
                  borderRadius: 16, padding: "20px 12px",
                  cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = GOLDB; e.currentTarget.style.background = CARD2; e.currentTarget.style.transform = "scale(1.03)"; } }}
                onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.background = CARD; e.currentTarget.style.transform = "scale(1)"; } }}
              >
                <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>{r.icon}</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: selected ? RED : "#fff", margin: 0, lineHeight: 1.2 }}>
                  {lang === "es" ? r.es : r.en}
                </p>
              </button>
            );
          })}
        </div>

        <GhostBtn onClick={() => setStep("confirm")} style={{ marginTop: 28, padding: "12px 32px" }}>{t.back}</GhostBtn>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // SUCCESS (check-in)
  // ══════════════════════════════════════════════════════════════
  if (step === "success" && student) return (
    <div style={wrap}>
      {bg}{header}{footer}
      <div style={{ ...center, maxWidth: 480, textAlign: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", animation: "none" }}>
          <svg width="46" height="46" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p style={{ fontSize: 13, color: "#22c55e", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>{t.checkedIn}</p>
        <h2 style={{ fontSize: 46, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
          {lang === "es" ? `¡Bienvenido,` : `Welcome,`}<br />{student.name.split(" ")[0]}!
        </h2>
        <p style={{ fontSize: 17, color: MUTED, marginBottom: 8 }}>
          {reason} · {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
        </p>
        <p style={{ fontSize: 14, color: MUTED, marginBottom: 40 }}>
          {lang === "es" ? "Por favor diríjase al área de espera." : "Please proceed to the waiting area."}
        </p>

        <div style={{ width: "100%", height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#22c55e", width: `${(countdown / 5) * 100}%`, transition: "width 1s linear", borderRadius: 2 }} />
        </div>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 12 }}>{t.resetting} {countdown}…</p>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // CHECK-OUT CONFIRM
  // ══════════════════════════════════════════════════════════════
  if (step === "co-confirm" && student) return (
    <div style={wrap}>
      {bg}{header}{footer}
      <div style={{ ...center, maxWidth: 480, textAlign: "center" }}>
        <Avatar name={student.name} size={90} />
        <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", margin: "20px 0 6px" }}>{student.name}</h2>
        <p style={{ fontSize: 15, color: MUTED, marginBottom: 28 }}>{student.studentId} · {student.school}</p>

        {activeCheckIn ? (
          <div style={{ background: CARD, border: `1px solid ${GOLDB}`, borderRadius: 16, padding: "20px 24px", width: "100%", marginBottom: 28, textAlign: "left" }}>
            <p style={{ fontSize: 11, color: GOLD, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800, marginBottom: 12 }}>{t.activeVisit}</p>
            {[
              [t.visitReason, activeCheckIn.purpose],
              [t.checkedInAt, activeCheckIn.checkInTime],
              [t.duration,    getDuration()],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BDR}` }}>
                <span style={{ fontSize: 14, color: MUTED }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: SUB }}>{val}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: CARD, border: `1px solid rgba(215,38,56,0.3)`, borderRadius: 16, padding: "16px 20px", marginBottom: 28, width: "100%" }}>
            <p style={{ fontSize: 14, color: MUTED, textAlign: "center" }}>
              {lang === "es" ? "No se encontró una visita activa hoy." : "No active visit found for today."}
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          {activeCheckIn && (
            <GoldBtn onClick={doCheckOut} style={{ width: "100%", height: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {t.confirmBtn}
            </GoldBtn>
          )}
          <GhostBtn onClick={resetAll} style={{ width: "100%", height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.back}</GhostBtn>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // CHECK-OUT SUCCESS
  // ══════════════════════════════════════════════════════════════
  if (step === "co-success" && student) return (
    <div style={wrap}>
      {bg}{header}{footer}
      <div style={{ ...center, maxWidth: 480, textAlign: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(212,175,55,0.1)", border: `2px solid ${GOLDB}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
          <svg width="46" height="46" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p style={{ fontSize: 13, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>{t.checkedOut}</p>
        <h2 style={{ fontSize: 46, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
          {lang === "es" ? `¡Hasta Luego,` : `Goodbye,`}<br />{student.name.split(" ")[0]}!
        </h2>
        <p style={{ fontSize: 17, color: MUTED, marginBottom: 40 }}>
          {lang === "es" ? "Su visita ha sido registrada." : "Your visit has been recorded."} · {getDuration()}
        </p>

        <div style={{ width: "100%", height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", background: GOLD, width: `${(countdown / 5) * 100}%`, transition: "width 1s linear", borderRadius: 2 }} />
        </div>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 12 }}>{t.resetting} {countdown}…</p>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // NOT FOUND
  // ══════════════════════════════════════════════════════════════
  if (step === "not-found") return (
    <div style={wrap}>
      {bg}{header}{footer}
      <div style={{ ...center, maxWidth: 440, textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(215,38,56,0.1)", border: "2px solid rgba(215,38,56,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke={RED} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", marginBottom: 12 }}>{t.notFound}</h2>
        <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.6, marginBottom: 36 }}>{t.notFoundSub}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <RedBtn onClick={() => setStep("search")} style={{ flex: 1, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.tryAgain}</RedBtn>
          <GhostBtn onClick={resetAll} style={{ flex: 1, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>Cancel</GhostBtn>
        </div>
      </div>
    </div>
  );

  return null;
}
