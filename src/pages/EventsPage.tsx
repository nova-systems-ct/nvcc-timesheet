import { useState } from "react";
import { getEvents, saveEvents } from "../lib/trioData";
import type { TRIOEvent } from "../lib/trioData";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";
const SUB = "rgba(255,255,255,0.65)";
const GOLD = "#D4AF37";
const GOLD_GRADIENT = "linear-gradient(135deg,#FFF3B0 0%,#F7D774 15%,#D4AF37 30%,#FFF3B0 45%,#B8860B 60%,#F7D774 75%,#FFF8DC 100%)";

const EVENT_TYPES = ["Workshop", "Info Session", "Panel", "Field Trip", "Seminar", "Social", "Other"];

function uid() { return Math.random().toString(36).slice(2, 11) + Date.now().toString(36); }

export default function EventsPage() {
  const [events, setEvents] = useState<TRIOEvent[]>(() => getEvents());
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<TRIOEvent | null>(null);
  const [form, setForm] = useState({ title: "", date: "2026-06-16", time: "3:00 PM", location: "", capacity: "40", description: "", type: "Workshop" });

  const upcoming = events.filter((e) => e.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date));
  const completed = events.filter((e) => e.status === "completed");
  const today = events.filter((e) => e.date === "2026-06-16" && e.status === "upcoming");

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const newEvent: TRIOEvent = {
      id: uid(),
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      capacity: parseInt(form.capacity) || 40,
      registered: 0,
      description: form.description,
      type: form.type,
      status: "upcoming",
    };
    const updated = [newEvent, ...events];
    saveEvents(updated);
    setEvents(updated);
    setShowCreate(false);
    setForm({ title: "", date: "2026-06-16", time: "3:00 PM", location: "", capacity: "40", description: "", type: "Workshop" });
  };

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Events Center</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{upcoming.length} upcoming · {completed.length} completed</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, background: RED, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Upcoming", value: upcoming.length, color: "#60a5fa" },
          { label: "Today", value: today.length, color: RED },
          { label: "Total Registered", value: upcoming.reduce((s, e) => s + e.registered, 0), color: "#fff" },
          { label: "Completed", value: completed.length, color: "#22c55e" },
        ].map((s) => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* AI recommendation */}
      <div style={{ background: `${GOLD}0D`, border: `1px solid ${GOLD}30`, borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 700, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 4 }}>Nova AI Event Recommendation</p>
          <p style={{ fontSize: 12.5, color: SUB, lineHeight: 1.5, marginBottom: 8 }}>
            Based on student data, <strong style={{ color: "#fff" }}>27 students</strong> have not yet completed their scholarship applications. A <strong style={{ color: "#fff" }}>Scholarship Application Bootcamp</strong> is predicted to draw 31 attendees and could yield 18+ scholarship completions.
          </p>
          <button onClick={() => setShowCreate(true)}
            style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 7, background: GOLD_GRADIENT, border: "none", color: "#000", cursor: "pointer" }}>
            Create Recommended Event →
          </button>
        </div>
      </div>

      {/* Upcoming events grid */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 14 }}>Upcoming Events</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {upcoming.map((e) => {
            const pct = Math.round((e.registered / e.capacity) * 100);
            const isToday = e.date === "2026-06-16";
            return (
              <div key={e.id}
                onClick={() => setSelected(e)}
                style={{ background: CARD, border: `1px solid ${isToday ? `${RED}44` : BORDER}`, borderRadius: 12, padding: "18px", cursor: "pointer", transition: "all 0.15s", position: "relative" }}
                onMouseEnter={(e2) => { e2.currentTarget.style.background = CARD2; e2.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e2) => { e2.currentTarget.style.background = CARD; e2.currentTarget.style.transform = "translateY(0)"; }}>
                {isToday && (
                  <span style={{ position: "absolute", top: 12, right: 12, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(214,31,38,0.15)", color: "#FF6B6B", textTransform: "uppercase" }}>Today</span>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.06)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>{e.type}</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>{e.title}</p>
                <p style={{ fontSize: 11.5, color: MUTED, marginBottom: 12 }}>{e.date} · {e.time} · {e.location}</p>
                <p style={{ fontSize: 11.5, color: SUB, lineHeight: 1.5, marginBottom: 14 }}>{e.description}</p>

                {/* Capacity bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: MUTED }}>Registered</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: pct > 80 ? "#f59e0b" : "#fff" }}>{e.registered} / {e.capacity}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "#f59e0b" : RED, borderRadius: 2, transition: "width 0.5s" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed events */}
      {completed.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 14 }}>Completed Events</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {completed.map((e) => (
              <div key={e.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px", opacity: 0.7 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{e.title}</p>
                <p style={{ fontSize: 11, color: MUTED, marginBottom: 10 }}>{e.date} · {e.location}</p>
                {e.attended !== undefined && (
                  <div style={{ display: "flex", gap: 12 }}>
                    <div><p style={{ fontSize: 9, color: MUTED, textTransform: "uppercase" }}>Registered</p><p style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{e.registered}</p></div>
                    <div><p style={{ fontSize: 9, color: MUTED, textTransform: "uppercase" }}>Attended</p><p style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>{e.attended}</p></div>
                    <div><p style={{ fontSize: 9, color: MUTED, textTransform: "uppercase" }}>Rate</p><p style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{Math.round((e.attended / e.registered) * 100)}%</p></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }} onClick={() => setSelected(null)}>
          <div style={{ background: "#0D0D0D", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, width: 440, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{selected.title}</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {[
                ["Date & Time", `${selected.date} at ${selected.time}`],
                ["Location", selected.location],
                ["Type", selected.type],
                ["Capacity", `${selected.registered} / ${selected.capacity} registered`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", background: CARD, borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: MUTED }}>{l}</span>
                  <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: SUB, lineHeight: 1.6, marginBottom: 20 }}>{selected.description}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: RED, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Edit Event</button>
              <button style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel Event</button>
            </div>
          </div>
        </div>
      )}

      {/* Create event modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }} onClick={() => setShowCreate(false)}>
          <div style={{ background: "#0D0D0D", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, width: 440, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Create Event</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Event Title *", key: "title", type: "text" },
                { label: "Date", key: "date", type: "date" },
                { label: "Time", key: "time", type: "text" },
                { label: "Location", key: "location", type: "text" },
                { label: "Capacity", key: "capacity", type: "number" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} value={(form as Record<string, string>)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Event Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none" }}>
                  {EVENT_TYPES.map((t) => <option key={t} value={t} style={{ background: "#1a1a1a" }}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleCreate} disabled={!form.title.trim()} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: form.title.trim() ? RED : "#333", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: form.title.trim() ? "pointer" : "not-allowed" }}>Create Event</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
