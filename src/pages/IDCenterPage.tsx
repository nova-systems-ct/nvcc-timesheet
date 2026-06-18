import { useState, useEffect } from "react";
import { getStudentsTriο } from "../lib/trioData";
import type { TRIOStudent } from "../lib/trioData";

// ── Design tokens ──────────────────────────────────────────────
const GOLD   = "#D4AF37";
const GOLDT  = "linear-gradient(135deg, #FFF4B0 0%, #E6C76B 30%, #D4AF37 60%, #F7E8A4 100%)";
const GOLDB  = "rgba(212,175,55,0.4)";
const RED    = "#D72638";
const CARD   = "#111111";
const CARD2  = "#0D0D0D";
const BG     = "#050505";
const BDR    = "rgba(255,255,255,0.07)";
const MUTED  = "rgba(255,255,255,0.45)";
const TEXT2  = "rgba(255,255,255,0.7)";

// ── Deterministic helpers ──────────────────────────────────────
function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return Math.abs(h);
}

function generateQRMatrix(sid: string): boolean[][] {
  const S = 21;
  const m: boolean[][] = Array.from({ length: S }, () => Array(S).fill(false));

  function finder(r: number, c: number) {
    for (let dr = 0; dr < 7; dr++) for (let dc = 0; dc < 7; dc++) {
      const border = dr === 0 || dr === 6 || dc === 0 || dc === 6;
      const inner  = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
      m[r + dr][c + dc] = border || inner;
    }
    for (let i = 0; i < 8; i++) {
      if (r + 7 < S && c + i < S) m[r + 7][c + i] = false;
      if (c + 7 < S && r + i < S) m[r + i][c + 7] = false;
    }
  }

  finder(0, 0); finder(0, 14); finder(14, 0);

  for (let i = 8; i < 13; i++) { m[6][i] = i % 2 === 0; m[i][6] = i % 2 === 0; }

  const seed = hash(sid);
  const reserved = new Set<string>();
  for (let r = 0; r < S; r++) for (let c = 0; c < S; c++) {
    const inTL = r < 9 && c < 9;
    const inTR = r < 9 && c >= 12;
    const inBL = r >= 12 && c < 9;
    const isTiming = r === 6 || c === 6;
    if (inTL || inTR || inBL || isTiming) reserved.add(`${r},${c}`);
  }

  const dataCells: [number, number][] = [];
  for (let r = 0; r < S; r++) for (let c = 0; c < S; c++) {
    if (!reserved.has(`${r},${c}`)) dataCells.push([r, c]);
  }
  dataCells.forEach(([r, c], i) => {
    const v = (seed + i * 7919 + r * 1009 + c * 997) & 0xFFFFFF;
    m[r][c] = (v % 3) !== 0;
  });

  return m;
}

function generateBarcodeWidths(sid: string): number[] {
  const h = hash(sid);
  const bars: number[] = [3];
  const chars = sid.replace(/[^0-9A-Z]/gi, "");
  for (let i = 0; i < Math.max(chars.length, 8); i++) {
    const c = i < chars.length ? chars.charCodeAt(i) : (h + i) % 36;
    bars.push(1 + (((c * 7)  + h + i * 13) % 3));
    bars.push(1 + (((c * 11) + h + i * 7)  % 2));
    bars.push(1 + (((c * 5)  + h + i * 17) % 3));
    bars.push(1 + (((c * 3)  + h + i * 11) % 2));
  }
  bars.push(2, 1, 2);
  return bars;
}

// ── QR SVG ─────────────────────────────────────────────────────
function QRCode({ studentId, size = 96, fgColor = "#fff", bgColor = "transparent" }: {
  studentId: string; size?: number; fgColor?: string; bgColor?: string;
}) {
  const matrix = generateQRMatrix(studentId);
  const S = matrix.length;
  const cell = size / S;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {bgColor !== "transparent" && <rect width={size} height={size} fill={bgColor} />}
      {matrix.flatMap((row, r) =>
        row.map((on, c) => on ? (
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={fgColor} />
        ) : null)
      )}
    </svg>
  );
}

// ── Barcode SVG ─────────────────────────────────────────────────
function Barcode({ studentId, width = 200, height = 44, fgColor = "#fff" }: {
  studentId: string; width?: number; height?: number; fgColor?: string;
}) {
  const bars = generateBarcodeWidths(studentId);
  const total = bars.reduce((a, b) => a + b, 0);
  const scale = width / total;
  let x = 0;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {bars.map((w, i) => {
        const rx = x;
        x += w * scale;
        return i % 2 === 0 ? (
          <rect key={i} x={rx} y={0} width={w * scale} height={height} fill={fgColor} />
        ) : null;
      })}
    </svg>
  );
}

// ── Avatar ──────────────────────────────────────────────────────
function Avatar({ name, size = 64 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const palette = ["#D72638", "#2563EB", "#7C3AED", "#059669", "#D97706"];
  const bg = palette[name.charCodeAt(0) % palette.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.36, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>{initials}</span>
    </div>
  );
}

// ── ID Card Front ───────────────────────────────────────────────
function IDFront({ student }: { student: TRIOStudent }) {
  const W = 380;
  const H = 240;
  return (
    <div style={{
      width: W, height: H,
      background: CARD,
      borderRadius: 20,
      border: `1px solid ${GOLDB}`,
      boxShadow: `0 0 0 1px rgba(212,175,55,0.1), 0 24px 60px rgba(0,0,0,0.7)`,
      overflow: "hidden",
      position: "relative",
      fontFamily: "system-ui, -apple-system, sans-serif",
      flexShrink: 0,
    }}>
      {/* Gold top stripe */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: GOLDT }} />

      {/* Subtle grid texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

      {/* Glow */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Header row */}
      <div style={{ position: "absolute", top: 20, left: 20, right: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: RED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "0.05em" }}>TRIO Connect</p>
            <p style={{ fontSize: 8, color: MUTED, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Student Support Services</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 8, color: MUTED, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>CT State</p>
          <p style={{ fontSize: 8, color: MUTED, margin: "2px 0 0", letterSpacing: "0.05em" }}>Community College</p>
        </div>
      </div>

      {/* Student info */}
      <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Avatar name={student.name} size={52} />
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2 }}>{student.name}</p>
            <p style={{ fontSize: 11, color: GOLD, margin: "3px 0 2px", fontWeight: 600, letterSpacing: "0.04em" }}>{student.studentId}</p>
            <p style={{ fontSize: 10, color: MUTED, margin: 0 }}>{student.school.replace("CT State ", "")}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: student.status === "active" ? "#22c55e" : RED, flexShrink: 0 }} />
              <p style={{ fontSize: 9, color: student.status === "active" ? "#22c55e" : RED, margin: 0, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{student.status}</p>
            </div>
          </div>
        </div>

        {/* QR code */}
        <div style={{ background: "#fff", borderRadius: 10, padding: 6, border: `1px solid ${GOLDB}` }}>
          <QRCode studentId={student.studentId} size={60} fgColor="#000" bgColor="#fff" />
        </div>
      </div>

      {/* Advisor bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 26, background: "rgba(212,175,55,0.06)", borderTop: `1px solid ${GOLDB}`, display: "flex", alignItems: "center", paddingLeft: 20, paddingRight: 20 }}>
        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={2} style={{ marginRight: 5, flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        <p style={{ fontSize: 9, color: GOLD, margin: 0, letterSpacing: "0.05em" }}>Advisor: {student.advisor}</p>
        <p style={{ fontSize: 9, color: MUTED, margin: "0 0 0 auto", letterSpacing: "0.04em" }}>{student.major}</p>
      </div>
    </div>
  );
}

// ── ID Card Back ────────────────────────────────────────────────
function IDBack({ student }: { student: TRIOStudent }) {
  const W = 380;
  const H = 240;
  const issueYear = new Date(student.enrolledDate).getFullYear();
  const expYear = issueYear + 4;
  return (
    <div style={{
      width: W, height: H,
      background: CARD2,
      borderRadius: 20,
      border: `1px solid ${GOLDB}`,
      boxShadow: `0 0 0 1px rgba(212,175,55,0.1), 0 24px 60px rgba(0,0,0,0.7)`,
      overflow: "hidden",
      position: "relative",
      fontFamily: "system-ui, -apple-system, sans-serif",
      flexShrink: 0,
    }}>
      {/* Gold bottom stripe */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: GOLDT }} />

      {/* Magnetic stripe area */}
      <div style={{ position: "absolute", top: 28, left: 0, right: 0, height: 40, background: "rgba(255,255,255,0.04)" }} />

      {/* QR - center */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 8, border: `2px solid ${GOLDB}`, boxShadow: `0 0 20px rgba(212,175,55,0.2)` }}>
          <QRCode studentId={student.studentId} size={72} fgColor="#000" bgColor="#fff" />
        </div>
        <p style={{ fontSize: 9, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Scan to Check In</p>
      </div>

      {/* Left column — info */}
      <div style={{ position: "absolute", left: 20, top: 80, bottom: 28 }}>
        {[
          ["ID", student.studentId],
          ["Status", student.status.toUpperCase()],
          ["Issued", `${issueYear}`],
          ["Expires", `${expYear}`],
        ].map(([label, val]) => (
          <div key={label} style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 8, color: MUTED, margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
            <p style={{ fontSize: 10, color: label === "Status" ? (student.status === "active" ? "#22c55e" : RED) : TEXT2, margin: "2px 0 0", fontWeight: 700, letterSpacing: "0.02em" }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Right column — barcode */}
      <div style={{ position: "absolute", right: 16, top: 82, bottom: 32, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6 }}>
        <Barcode studentId={student.studentId} width={80} height={52} fgColor="rgba(255,255,255,0.7)" />
        <p style={{ fontSize: 7.5, color: MUTED, letterSpacing: "0.05em", margin: 0 }}>{student.studentId}</p>
      </div>

      {/* Top right badge */}
      <div style={{ position: "absolute", top: 10, right: 16, display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
          </svg>
        </div>
        <p style={{ fontSize: 8, color: MUTED, margin: 0, letterSpacing: "0.06em" }}>TRIO SSS</p>
      </div>
    </div>
  );
}

// ── Card in list view ──────────────────────────────────────────
function StudentIDCard({ student, onClick }: { student: TRIOStudent; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#181818" : CARD,
        border: `1px solid ${hover ? GOLDB : BDR}`,
        borderRadius: 16,
        padding: "16px 18px",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "all 0.18s",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hover ? `0 8px 24px rgba(0,0,0,0.4)` : "none",
      }}
    >
      <Avatar name={student.name} size={48} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{student.name}</p>
        <p style={{ fontSize: 12, color: GOLD, margin: "3px 0 3px", fontWeight: 600, letterSpacing: "0.04em" }}>{student.studentId}</p>
        <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{student.school.replace("CT State ", "")} · {student.advisor}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <QRCode studentId={student.studentId} size={40} fgColor="rgba(255,255,255,0.7)" />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: student.status === "active" ? "#22c55e" : RED }} />
          <p style={{ fontSize: 9, color: student.status === "active" ? "#22c55e" : RED, margin: 0, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{student.status}</p>
        </div>
      </div>
    </button>
  );
}

// ── Full-screen ID modal ───────────────────────────────────────
function IDModal({ student, onClose }: { student: TRIOStudent; onClose: () => void }) {
  const [face, setFace] = useState<"front" | "back">("front");

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(12px)" }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

        {/* Close */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>{student.name}</p>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", color: MUTED, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", gap: 4, background: "#0a0a0a", borderRadius: 12, padding: 4, border: `1px solid ${BDR}` }}>
          {(["front", "back"] as const).map((f) => (
            <button key={f} onClick={() => setFace(f)}
              style={{ padding: "8px 24px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", background: face === f ? CARD : "transparent", color: face === f ? "#fff" : MUTED, transition: "all 0.18s" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{ transition: "all 0.25s" }}>
          {face === "front" ? <IDFront student={student} /> : <IDBack student={student} />}
        </div>

        {/* Details */}
        <div style={{ width: 380, background: "#0a0a0a", border: `1px solid ${BDR}`, borderRadius: 16, overflow: "hidden" }}>
          {[
            ["Student ID",   student.studentId],
            ["Major",        student.major],
            ["Advisor",      student.advisor],
            ["Classification", student.classification],
            ["GPA",          student.gpa.toFixed(2)],
            ["First Gen",    student.firstGen ? "Yes" : "No"],
            ["Pell Eligible", student.pell ? "Yes" : "No"],
          ].map(([label, value], i, arr) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 18px", borderBottom: i < arr.length - 1 ? `1px solid ${BDR}` : "none" }}>
              <span style={{ fontSize: 13, color: MUTED }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: TEXT2 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Print button */}
        <button
          onClick={() => window.print()}
          style={{ padding: "12px 28px", borderRadius: 12, border: `1px solid ${GOLDB}`, background: "rgba(212,175,55,0.08)", color: GOLD, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, letterSpacing: "0.04em" }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
          Print ID
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
export default function IDCenterPage() {
  const [students, setStudents] = useState<TRIOStudent[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TRIOStudent | null>(null);

  useEffect(() => { setStudents(getStudentsTriο()); }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q);
  });

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui, -apple-system, sans-serif", padding: "32px 32px" }}>
      {selected && <IDModal student={selected} onClose={() => setSelected(null)} />}

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(212,175,55,0.1)", border: `1px solid ${GOLDB}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>Digital Student IDs</h1>
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>{students.length} students · QR codes for instant check-in</p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background: "rgba(212,175,55,0.05)", border: `1px solid ${GOLDB}`, borderRadius: 14, padding: "14px 18px", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 18.75h.75v.75h-.75v-.75zM18.75 13.5h.75v.75h-.75v-.75zM18.75 18.75h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
        </svg>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: GOLD, margin: "0 0 3px", letterSpacing: "0.02em" }}>Every student has a unique QR code</p>
          <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.5 }}>
            Students can present their digital ID at the kiosk. Scan the QR code to instantly identify and check in the student — no typing required.
            Click any card below to view the full ID, front and back.
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={MUTED} strokeWidth={2}
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or student ID…"
          style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: "11px 14px 11px 40px", fontSize: 14, color: "#fff", outline: "none", transition: "border-color 0.18s" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = GOLDB; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = BDR; }}
        />
      </div>

      {/* Count */}
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, letterSpacing: "0.04em" }}>
        {filtered.length} {filtered.length === 1 ? "student" : "students"}
        {search && ` matching "${search}"`}
      </p>

      {/* Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: "40px 24px", textAlign: "center" }}>
            <p style={{ color: MUTED, fontSize: 15 }}>No students found.</p>
          </div>
        )}
        {filtered.map((s) => (
          <StudentIDCard key={s.id} student={s} onClick={() => setSelected(s)} />
        ))}
      </div>
    </div>
  );
}
