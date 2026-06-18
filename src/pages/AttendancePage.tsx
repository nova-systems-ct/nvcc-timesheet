import { useState } from "react";
import { getCheckIns, saveCheckIns, getStudentsTriο } from "../lib/trioData";
import type { CheckIn } from "../lib/trioData";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";

const PURPOSES = ["Appointment", "Walk-In Visit", "Workshop", "Study Time", "Computer Lab", "Event", "Tutoring", "Document Help", "General Visit"];

function uid() { return Math.random().toString(36).slice(2, 11) + Date.now().toString(36); }

export default function AttendancePage() {
  const [checkins, setCheckins] = useState<CheckIn[]>(() => getCheckIns());
  const [filter, setFilter] = useState("all");
  const [showManual, setShowManual] = useState(false);
  const [form, setForm] = useState({ studentName: "", purpose: "Walk-In Visit", advisor: "" });
  const students = getStudentsTriο();

  const today = "2026-06-16";
  const todayCheckins = checkins.filter((c) => c.date === today).sort((a, b) => b.checkInTime.localeCompare(a.checkInTime));
  const filtered = filter === "all" ? todayCheckins : todayCheckins.filter((c) => c.purpose === filter);

  const stillIn = todayCheckins.filter((c) => !c.checkOutTime);
  const completed = todayCheckins.filter((c) => c.checkOutTime);

  const handleCheckIn = () => {
    if (!form.studentName.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const student = students.find((s) => s.name.toLowerCase().includes(form.studentName.toLowerCase()));
    const newCI: CheckIn = {
      id: uid(),
      studentId: student?.id || "manual",
      studentName: form.studentName,
      purpose: form.purpose,
      checkInTime: timeStr,
      advisor: form.advisor || undefined,
      date: today,
    };
    const updated = [newCI, ...checkins];
    saveCheckIns(updated);
    setCheckins(updated);
    setForm({ studentName: "", purpose: "Walk-In Visit", advisor: "" });
    setShowManual(false);
  };

  const handleCheckOut = (id: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const updated = checkins.map((c) => c.id === id ? { ...c, checkOutTime: timeStr } : c);
    saveCheckIns(updated);
    setCheckins(updated);
  };

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Attendance Center</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Tuesday, June 16, 2026 · Live Check-Ins</p>
        </div>
        <button onClick={() => setShowManual(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, background: RED, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Manual Check-In
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Total Today", value: todayCheckins.length, color: "#fff" },
          { label: "Currently In", value: stillIn.length, color: "#22c55e" },
          { label: "Checked Out", value: completed.length, color: MUTED },
          { label: "Capacity", value: `${todayCheckins.length}/80`, color: "#fff" },
        ].map((s) => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", ...PURPOSES].map((p) => (
          <button key={p} onClick={() => setFilter(p)}
            style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: filter === p ? 700 : 400, border: `1px solid ${filter === p ? RED : BORDER}`, background: filter === p ? "rgba(214,31,38,0.12)" : "transparent", color: filter === p ? "#fff" : MUTED, cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize" }}>
            {p === "all" ? "All Visits" : p}
          </button>
        ))}
      </div>

      {/* Live feed */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Currently in */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse-dot 2s infinite" }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Currently Checked In</p>
            <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, marginLeft: "auto" }}>{stillIn.length} students</span>
          </div>
          <div style={{ maxHeight: 440, overflowY: "auto" }}>
            {(filter === "all" ? stillIn : stillIn.filter((c) => c.purpose === filter)).length === 0 ? (
              <div style={{ padding: "30px 18px", textAlign: "center", color: MUTED, fontSize: 12 }}>No students currently checked in</div>
            ) : (
              (filter === "all" ? stillIn : stillIn.filter((c) => c.purpose === filter)).map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{c.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.studentName}</p>
                    <p style={{ fontSize: 11, color: MUTED }}>{c.purpose} · In at {c.checkInTime}</p>
                  </div>
                  <button onClick={() => handleCheckOut(c.id)}
                    style={{ fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: "#22c55e", cursor: "pointer" }}>
                    Check Out
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's log */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Today's Log</p>
            <span style={{ fontSize: 11, color: MUTED }}>{filtered.length} visits</span>
          </div>
          <div style={{ maxHeight: 440, overflowY: "auto" }}>
            {filtered.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "#fff" }}>{c.studentName}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 10.5, color: MUTED }}>{c.purpose}</span>
                    {c.advisor && <span style={{ fontSize: 10.5, color: MUTED }}>· {c.advisor}</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{c.checkInTime}</p>
                  {c.checkOutTime ? (
                    <p style={{ fontSize: 10.5, color: "#22c55e" }}>Out {c.checkOutTime}</p>
                  ) : (
                    <p style={{ fontSize: 10.5, color: "#f59e0b" }}>Still in</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Purpose breakdown */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 20px", marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Visit Breakdown Today</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {PURPOSES.map((p) => {
            const count = todayCheckins.filter((c) => c.purpose === p).length;
            if (!count) return null;
            return (
              <div key={p} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{count}</span>
                <span style={{ fontSize: 11, color: MUTED }}>{p}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual check-in modal */}
      {showManual && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }} onClick={() => setShowManual(false)}>
          <div style={{ background: "#0D0D0D", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, width: 380, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Manual Check-In</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 7 }}>Student Name *</label>
                <input
                  list="students-list"
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  placeholder="Search student…"
                  style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "10px 12px", fontSize: 13, color: "#fff", outline: "none" }}
                />
                <datalist id="students-list">
                  {students.map((s) => <option key={s.id} value={s.name} />)}
                </datalist>
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 7 }}>Purpose</label>
                <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "10px 12px", fontSize: 13, color: "#fff", outline: "none" }}>
                  {PURPOSES.map((p) => <option key={p} value={p} style={{ background: "#1a1a1a" }}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 7 }}>Advisor (optional)</label>
                <select value={form.advisor} onChange={(e) => setForm({ ...form, advisor: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "10px 12px", fontSize: 13, color: "#fff", outline: "none" }}>
                  <option value="" style={{ background: "#1a1a1a" }}>None</option>
                  {["Maria Santos", "James Wilson", "Keisha Brown"].map((a) => <option key={a} value={a} style={{ background: "#1a1a1a" }}>{a}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => setShowManual(false)}
                style={{ flex: 1, padding: "10px 0", borderRadius: 9, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleCheckIn} disabled={!form.studentName.trim()}
                style={{ flex: 1, padding: "10px 0", borderRadius: 9, background: form.studentName.trim() ? RED : "#333", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: form.studentName.trim() ? "pointer" : "not-allowed" }}>
                Check In
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
