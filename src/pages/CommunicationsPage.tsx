import { useState } from "react";
import { getMessages, saveMessages } from "../lib/trioData";
import type { TRIOMessage } from "../lib/trioData";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";
const SUB = "rgba(255,255,255,0.65)";

const TEMPLATES = [
  { label: "FAFSA Reminder", subject: "Action Required: FAFSA Deadline Approaching", body: "Dear [Student Name],\n\nThis is a friendly reminder that the FAFSA deadline for the 2026-27 academic year is approaching. Please complete your FAFSA as soon as possible to secure your financial aid.\n\nIf you need assistance, please stop by the TRIO office or schedule an appointment.\n\nBest regards,\nTRIO Connect Team" },
  { label: "Appointment Reminder", subject: "Reminder: Upcoming Appointment with TRIO Advisor", body: "Dear [Student Name],\n\nThis is a reminder that you have a scheduled appointment tomorrow with your TRIO advisor.\n\nDate: [Date]\nTime: [Time]\nLocation: TRIO Office\n\nPlease reply to confirm or reschedule.\n\nBest regards,\nTRIO Connect Team" },
  { label: "Scholarship Alert", subject: "New Scholarship Opportunity — Act Now!", body: "Dear [Student Name],\n\nCongratulations! Based on your profile, you qualify for the following scholarship opportunities:\n\n• TRIO Achievement Award ($2,500)\n• CT State Foundation Grant ($1,500)\n\nDeadlines are approaching. Visit the TRIO office for application assistance.\n\nBest regards,\nTRIO Connect Team" },
  { label: "Workshop Reminder", subject: "Don't Miss Tomorrow's Workshop!", body: "Dear [Student Name],\n\nWe hope to see you at our upcoming workshop tomorrow! This event is designed specifically for TRIO students like you.\n\n[Workshop Name]\n[Date & Time]\n[Location]\n\nSeating is limited. Register at the TRIO office.\n\nBest regards,\nTRIO Connect Team" },
  { label: "Check-In Outreach", subject: "We Miss You — Check In With Your Advisor", body: "Dear [Student Name],\n\nWe noticed it's been a while since we've connected. Your success matters to us! Please schedule a time to meet with your TRIO advisor.\n\nSchedule online at: [Link]\nOr call: (203) 555-0100\n\nWe're here to support you.\n\nBest regards,\nTRIO Connect Team" },
];

function uid() { return Math.random().toString(36).slice(2, 11) + Date.now().toString(36); }

export default function CommunicationsPage() {
  const [messages, setMessages] = useState<TRIOMessage[]>(() => getMessages());
  const [tab, setTab] = useState<"compose" | "history" | "templates">("compose");
  const [form, setForm] = useState<{ to: string; subject: string; body: string; type: "email" | "sms" | "push" }>({ to: "", subject: "", body: "", type: "email" });
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!form.to.trim() || !form.subject.trim()) return;
    const msg: TRIOMessage = {
      id: uid(),
      to: form.to,
      subject: form.subject,
      body: form.body,
      sentAt: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      type: form.type,
      status: "sent",
    };
    const updated = [msg, ...messages];
    saveMessages(updated);
    setMessages(updated);
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ to: "", subject: "", body: "", type: "email" }); }, 2000);
  };

  const useTemplate = (t: typeof TEMPLATES[0]) => {
    setForm({ ...form, subject: t.subject, body: t.body });
    setTab("compose");
  };

  const inputStyle = { width: "100%", boxSizing: "border-box" as const, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "10px 12px", fontSize: 13, color: "#fff", outline: "none" };

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Communications</h1>
        <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Email · SMS · Push Notifications · Group Messages</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Sent Today", value: messages.filter((m) => m.status === "sent" || m.status === "delivered").length, color: "#fff" },
          { label: "Delivered", value: messages.filter((m) => m.status === "delivered" || m.status === "read").length, color: "#22c55e" },
          { label: "Read", value: messages.filter((m) => m.status === "read").length, color: "#60a5fa" },
          { label: "Failed", value: 0, color: RED },
        ].map((s) => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden", width: "fit-content", marginBottom: 20 }}>
        {(["compose", "templates", "history"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "9px 20px", background: tab === t ? RED : "transparent", border: "none", color: tab === t ? "#fff" : MUTED, fontSize: 13, fontWeight: tab === t ? 700 : 400, cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "compose" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {(["email", "sms", "push"] as const).map((t) => (
                <button key={t} onClick={() => setForm({ ...form, type: t })}
                  style={{ padding: "6px 14px", borderRadius: 7, border: `1px solid ${form.type === t ? RED : BORDER}`, background: form.type === t ? "rgba(214,31,38,0.12)" : "transparent", color: form.type === t ? "#fff" : MUTED, fontSize: 12, fontWeight: form.type === t ? 700 : 400, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>To</label>
                <input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} placeholder="Student name, group (All Students, All Freshmen)…" style={inputStyle} />
              </div>
              {form.type === "email" && (
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Subject</label>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Email subject…" style={inputStyle} />
                </div>
              )}
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Message</label>
                <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={10} placeholder="Write your message…"
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleSend} disabled={!form.to.trim() || sent}
                  style={{ flex: 1, padding: "11px 0", borderRadius: 9, background: sent ? "#22c55e" : form.to.trim() ? RED : "#333", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: form.to.trim() ? "pointer" : "not-allowed", transition: "background 0.3s" }}>
                  {sent ? "✓ Sent!" : `Send ${form.type.toUpperCase()}`}
                </button>
                <button style={{ padding: "11px 16px", borderRadius: 9, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Quick groups */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 18px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Quick Groups</p>
            {[
              { label: "All TRIO Students", count: 50 },
              { label: "At-Risk Students", count: 8 },
              { label: "Freshmen", count: 12 },
              { label: "Sophomores", count: 14 },
              { label: "Missing FAFSA", count: 18 },
              { label: "No Visit 30+ Days", count: 7 },
              { label: "Upcoming Appointments", count: 6 },
            ].map((g) => (
              <button key={g.label} onClick={() => setForm({ ...form, to: g.label })}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", marginBottom: 4, textAlign: "left", transition: "background 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = CARD2; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: 12.5, color: SUB }}>{g.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.06)", color: MUTED }}>{g.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "templates" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {TEMPLATES.map((t) => (
            <div key={t.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{t.label}</p>
              <p style={{ fontSize: 11.5, color: MUTED, marginBottom: 4 }}>{t.subject}</p>
              <p style={{ fontSize: 11.5, color: SUB, lineHeight: 1.5, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{t.body}</p>
              <button onClick={() => useTemplate(t)}
                style={{ width: "100%", padding: "8px 0", borderRadius: 8, background: RED, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          {messages.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: MUTED, fontSize: 13 }}>No messages sent yet</div>
          ) : (
            messages.map((m, i) => (
              <div key={m.id} style={{ display: "flex", gap: 14, padding: "14px 18px", borderBottom: i < messages.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "#1a1a1a", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12 }}>{m.type === "email" ? "✉️" : m.type === "sms" ? "💬" : "🔔"}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{m.subject || m.body.slice(0, 50)}</p>
                    <span style={{ fontSize: 10.5, color: MUTED, flexShrink: 0, marginLeft: 10 }}>{m.sentAt}</span>
                  </div>
                  <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>To: {m.to} · {m.type.toUpperCase()}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(34,197,94,0.12)", color: "#22c55e", alignSelf: "center", textTransform: "uppercase" }}>{m.status}</span>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
