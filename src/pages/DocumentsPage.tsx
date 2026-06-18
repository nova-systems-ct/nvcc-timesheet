import { useState } from "react";
import { getDocuments } from "../lib/trioData";
import type { TRIODocument } from "../lib/trioData";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";
const SUB = "rgba(255,255,255,0.65)";
const GOLD_GRADIENT = "linear-gradient(135deg,#FFF3B0 0%,#F7D774 15%,#D4AF37 30%,#FFF3B0 45%,#B8860B 60%,#F7D774 75%,#FFF8DC 100%)";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  verified: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", label: "Verified" },
  pending: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", label: "Pending" },
  missing: { bg: "rgba(214,31,38,0.12)", color: "#FF6B6B", label: "Missing" },
  expired: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Expired" },
};

const DOC_TYPES = ["FAFSA", "Transcript", "Enrollment Verification", "Financial Aid Letter", "ID Copy", "Emergency Contact", "Transfer Agreement", "Essay", "Resume", "Other"];

export default function DocumentsPage() {
  const [documents] = useState<TRIODocument[]>(() => getDocuments());
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dragOver, setDragOver] = useState(false);

  const filtered = documents.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.studentName.toLowerCase().includes(q) || d.type.toLowerCase().includes(q) || d.fileName.toLowerCase().includes(q);
    const matchType = filterType === "all" || d.type === filterType;
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const missing = documents.filter((d) => d.status === "missing");
  const expired = documents.filter((d) => d.status === "expired");

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Documents</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{documents.length} documents · {missing.length} missing</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, background: RED, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total", value: documents.length, color: "#fff" },
          { label: "Verified", value: documents.filter((d) => d.status === "verified").length, color: "#22c55e" },
          { label: "Missing", value: missing.length, color: RED },
          { label: "Expired", value: expired.length, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* AI missing doc detection */}
      {missing.length > 0 && (
        <div style={{ background: "rgba(214,31,38,0.05)", border: "1px solid rgba(214,31,38,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 700, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 4 }}>Nova AI — Missing Document Alert</p>
            <p style={{ fontSize: 12.5, color: SUB, lineHeight: 1.5 }}>
              AI has detected <strong style={{ color: "#fff" }}>{missing.length} missing documents</strong> across {new Set(missing.map((d) => d.studentId)).size} students. These are required for TRIO compliance and grant reporting.
            </p>
            {missing.map((d) => (
              <div key={d.id} style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11.5, color: "#FF6B6B" }}>• {d.studentName} — {d.type} required</span>
                <button style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "rgba(214,31,38,0.15)", border: "1px solid rgba(214,31,38,0.3)", color: "#FF6B6B", cursor: "pointer" }}>Request</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        style={{ border: `2px dashed ${dragOver ? RED : BORDER}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", marginBottom: 20, background: dragOver ? "rgba(214,31,38,0.04)" : "transparent", transition: "all 0.2s", cursor: "pointer" }}>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={dragOver ? RED : MUTED} strokeWidth={1.5} style={{ margin: "0 auto 10px" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p style={{ fontSize: 13, color: dragOver ? RED : MUTED, fontWeight: 600 }}>Drop files here or click to upload</p>
        <p style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>PDF, DOC, JPG supported · Max 10MB per file</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input placeholder="Search documents…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "9px 12px 9px 34px", fontSize: 13, color: "#fff", outline: "none" }} />
        </div>
        {[
          { value: filterType, onChange: setFilterType, options: [["all", "All Types"], ...DOC_TYPES.map((t) => [t, t])] },
          { value: filterStatus, onChange: setFilterStatus, options: [["all", "All Status"], ["verified", "Verified"], ["pending", "Pending"], ["missing", "Missing"], ["expired", "Expired"]] },
        ].map((f, i) => (
          <select key={i} value={f.value} onChange={(e) => f.onChange(e.target.value)}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none", cursor: "pointer" }}>
            {f.options.map(([v, l]) => <option key={v} value={v} style={{ background: "#1a1a1a" }}>{l}</option>)}
          </select>
        ))}
      </div>

      {/* Document list */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${BORDER}`, display: "grid", gridTemplateColumns: "1fr 120px 120px 100px 80px", gap: 12 }}>
          {["Document", "Student", "Type", "Date", "Status"].map((h) => (
            <p key={h} style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED }}>{h}</p>
          ))}
        </div>
        {filtered.map((d) => (
          <div key={d.id} style={{ padding: "12px 18px", borderBottom: `1px solid ${BORDER}`, display: "grid", gridTemplateColumns: "1fr 120px 120px 100px 80px", gap: 12, alignItems: "center", cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = CARD2; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>📄</span>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: d.status === "missing" ? MUTED : "#fff" }}>{d.fileName || `${d.type} Required`}</p>
                {d.size && <p style={{ fontSize: 10, color: MUTED }}>{d.size}</p>}
              </div>
            </div>
            <p style={{ fontSize: 12, color: SUB }}>{d.studentName.split(" ")[0]} {d.studentName.split(" ")[1]?.[0]}.</p>
            <p style={{ fontSize: 12, color: MUTED }}>{d.type}</p>
            <p style={{ fontSize: 12, color: MUTED }}>{d.uploadDate || "—"}</p>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: STATUS_STYLES[d.status].bg, color: STATUS_STYLES[d.status].color, display: "inline-block" }}>
              {STATUS_STYLES[d.status].label}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "40px 18px", textAlign: "center", color: MUTED, fontSize: 13 }}>No documents found</div>
        )}
      </div>
    </main>
  );
}
