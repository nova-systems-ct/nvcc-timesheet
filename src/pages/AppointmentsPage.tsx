import { useState } from "react";
import { getAppointments, saveAppointments, getStudentsTriο } from "../lib/trioData";
import type { TRIOAppointment } from "../lib/trioData";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  scheduled: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa" },
  completed: { bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
  "no-show": { bg: "rgba(214,31,38,0.12)", color: "#FF6B6B" },
  cancelled: { bg: "rgba(255,255,255,0.06)", color: MUTED },
};

const TYPES = ["Academic Advising", "Transfer Planning", "Financial Aid Review", "Career Counseling", "Graduation Review", "Emergency Advising", "Follow-Up", "Other"];
const ADVISORS = ["Maria Santos", "James Wilson", "Keisha Brown"];

function uid() { return Math.random().toString(36).slice(2, 11) + Date.now().toString(36); }

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<TRIOAppointment[]>(() => getAppointments());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<TRIOAppointment | null>(null);
  const [form, setForm] = useState({ studentName: "", advisor: "Maria Santos", date: "2026-06-16", time: "9:00 AM", endTime: "9:30 AM", type: "Academic Advising", notes: "" });
  const students = getStudentsTriο();

  const today = "2026-06-16";
  const todayAppts = appointments.filter((a) => a.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = appointments.filter((a) => a.date > today && a.status === "scheduled").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  const handleCreate = () => {
    if (!form.studentName.trim()) return;
    const student = students.find((s) => s.name.toLowerCase().includes(form.studentName.toLowerCase()));
    const newAppt: TRIOAppointment = {
      id: uid(),
      studentId: student?.id || "manual",
      studentName: form.studentName,
      advisor: form.advisor,
      date: form.date,
      time: form.time,
      endTime: form.endTime,
      type: form.type,
      status: "scheduled",
      notes: form.notes || undefined,
    };
    const updated = [newAppt, ...appointments];
    saveAppointments(updated);
    setAppointments(updated);
    setShowCreate(false);
    setForm({ studentName: "", advisor: "Maria Santos", date: "2026-06-16", time: "9:00 AM", endTime: "9:30 AM", type: "Academic Advising", notes: "" });
  };

  const updateStatus = (id: string, status: TRIOAppointment["status"]) => {
    const updated = appointments.map((a) => a.id === id ? { ...a, status } : a);
    saveAppointments(updated);
    setAppointments(updated);
    setSelectedAppt(null);
  };

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Appointments</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{todayAppts.length} scheduled today</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, overflow: "hidden" }}>
            {(["day", "week", "month"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: "8px 14px", background: view === v ? RED : "transparent", border: "none", color: view === v ? "#fff" : MUTED, fontSize: 12, fontWeight: view === v ? 700 : 400, cursor: "pointer", textTransform: "capitalize" }}>
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => setShowCreate(true)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, background: RED, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Create Appointment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Today", value: todayAppts.length, color: "#fff" },
          { label: "Completed", value: todayAppts.filter((a) => a.status === "completed").length, color: "#22c55e" },
          { label: "Remaining", value: todayAppts.filter((a) => a.status === "scheduled").length, color: "#60a5fa" },
          { label: "No Shows", value: appointments.filter((a) => a.status === "no-show").length, color: RED },
        ].map((s) => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* Today's appointments */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Today — June 16, 2026</p>
          </div>
          {todayAppts.length === 0 ? (
            <div style={{ padding: "48px 18px", textAlign: "center", color: MUTED, fontSize: 13 }}>No appointments today</div>
          ) : (
            todayAppts.map((a) => (
              <div key={a.id}
                onClick={() => setSelectedAppt(a)}
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = CARD2; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <div style={{ width: 56, flexShrink: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{a.time}</p>
                  <p style={{ fontSize: 10, color: MUTED }}>{a.endTime}</p>
                </div>
                <div style={{ width: 3, height: 40, borderRadius: 2, background: STATUS_STYLES[a.status].color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>{a.studentName}</p>
                  <p style={{ fontSize: 11.5, color: MUTED }}>{a.type} · {a.advisor}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: STATUS_STYLES[a.status].bg, color: STATUS_STYLES[a.status].color, textTransform: "capitalize" }}>
                  {a.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Upcoming + no shows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "13px 16px", borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>Upcoming</p>
            </div>
            {upcoming.map((a) => (
              <div key={a.id} style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{a.studentName}</p>
                <p style={{ fontSize: 11, color: MUTED }}>{a.date} at {a.time}</p>
                <p style={{ fontSize: 10.5, color: MUTED, marginTop: 2 }}>{a.type}</p>
              </div>
            ))}
          </div>

          {/* No shows */}
          <div style={{ background: CARD, border: "1px solid rgba(214,31,38,0.2)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "13px 16px", borderBottom: "1px solid rgba(214,31,38,0.15)", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: RED }} />
              <p style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>No Shows</p>
            </div>
            {appointments.filter((a) => a.status === "no-show").map((a) => (
              <div key={a.id} style={{ padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{a.studentName}</p>
                <p style={{ fontSize: 11, color: MUTED }}>{a.date}</p>
                <button style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: RED, background: "rgba(214,31,38,0.1)", border: "1px solid rgba(214,31,38,0.2)", borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>
                  Reschedule
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment detail modal */}
      {selectedAppt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }} onClick={() => setSelectedAppt(null)}>
          <div style={{ background: "#0D0D0D", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, width: 400, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Appointment Details</h3>
              <button onClick={() => setSelectedAppt(null)} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {[
                ["Student", selectedAppt.studentName],
                ["Type", selectedAppt.type],
                ["Advisor", selectedAppt.advisor],
                ["Date", selectedAppt.date],
                ["Time", `${selectedAppt.time} – ${selectedAppt.endTime}`],
                ["Status", selectedAppt.status.charAt(0).toUpperCase() + selectedAppt.status.slice(1)],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: CARD, borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: MUTED }}>{label}</span>
                  <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
            {selectedAppt.status === "scheduled" && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => updateStatus(selectedAppt.id, "completed")}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 8, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Mark Completed
                </button>
                <button onClick={() => updateStatus(selectedAppt.id, "no-show")}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 8, background: "rgba(214,31,38,0.1)", border: "1px solid rgba(214,31,38,0.25)", color: "#FF6B6B", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  No Show
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create appointment modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }} onClick={() => setShowCreate(false)}>
          <div style={{ background: "#0D0D0D", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, width: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Create Appointment</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Student *", value: form.studentName, onChange: (v: string) => setForm({ ...form, studentName: v }), type: "text", list: "appt-students" },
                { label: "Date", value: form.date, onChange: (v: string) => setForm({ ...form, date: v }), type: "date" },
                { label: "Start Time", value: form.time, onChange: (v: string) => setForm({ ...form, time: v }), type: "text" },
                { label: "End Time", value: form.endTime, onChange: (v: string) => setForm({ ...form, endTime: v }), type: "text" },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    list={f.list}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none" }}
                  />
                  {f.list && <datalist id={f.list}>{students.map((s) => <option key={s.id} value={s.name} />)}</datalist>}
                </div>
              ))}
              {[
                { label: "Appointment Type", value: form.type, onChange: (v: string) => setForm({ ...form, type: v }), options: TYPES },
                { label: "Advisor", value: form.advisor, onChange: (v: string) => setForm({ ...form, advisor: v }), options: ADVISORS },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>{f.label}</label>
                  <select value={f.value} onChange={(e) => f.onChange(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none" }}>
                    {f.options.map((o) => <option key={o} value={o} style={{ background: "#1a1a1a" }}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                  style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowCreate(false)}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleCreate} disabled={!form.studentName.trim()}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: form.studentName.trim() ? RED : "#333", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: form.studentName.trim() ? "pointer" : "not-allowed" }}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
