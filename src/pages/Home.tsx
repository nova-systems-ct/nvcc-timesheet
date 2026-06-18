import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCheckIns, getAppointments, getTasks } from "../lib/trioData";
import type { ReactNode } from "react";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";
const SUB = "rgba(255,255,255,0.65)";
const GOLD = "#D4AF37";
const GOLD_GRADIENT = "linear-gradient(135deg,#FFF3B0 0%,#F7D774 15%,#D4AF37 30%,#FFF3B0 45%,#B8860B 60%,#F7D774 75%,#FFF8DC 100%)";

function StatCard({ value, label, sub, color, icon }: { value: string | number; label: string; sub?: string; color?: string; icon?: ReactNode }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 8 }}>{label}</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: color || "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</p>
          {sub && <p style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>{sub}</p>}
        </div>
        {icon && <div style={{ opacity: 0.25, color: color || "#fff", marginTop: 2 }}>{icon}</div>}
      </div>
    </div>
  );
}

interface ScheduleItem { time: string; title: string; student: string; type: string; status: string; }
interface FollowUp { name: string; reason: string; daysSince: number; risk: "medium" | "high"; }

export default function Home() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const checkins = getCheckIns();
  const appointments = getAppointments();
  const tasks = getTasks();
  const todayCheckins = checkins.filter((c) => c.date === "2026-06-16");
  const todayAppts = appointments.filter((a) => a.date === "2026-06-16");
  const pendingTasks = tasks.filter((t) => t.status !== "completed");

  const hour = time.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const schedule: ScheduleItem[] = [
    { time: "9:00 AM", title: "Academic Advising", student: "Aaliyah Williams", type: "Appointment", status: "completed" },
    { time: "10:00 AM", title: "Transfer Planning", student: "Emma Garcia", type: "Appointment", status: "completed" },
    { time: "11:00 AM", title: "Graduation Review", student: "Jasmine Chen", type: "Appointment", status: "scheduled" },
    { time: "12:00 PM", title: "Financial Literacy Workshop", student: "32 registered", type: "Event", status: "upcoming" },
    { time: "1:00 PM", title: "Career Counseling", student: "Leila Adams", type: "Appointment", status: "scheduled" },
    { time: "2:00 PM", title: "Academic Advising", student: "Priya Sharma", type: "Appointment", status: "scheduled" },
    { time: "3:00 PM", title: "Financial Aid Review", student: "Amara Wilson", type: "Appointment", status: "scheduled" },
    { time: "5:30 PM", title: "Transfer Planning Info Session", student: "28 registered", type: "Event", status: "upcoming" },
  ];

  const followUps: FollowUp[] = [
    { name: "Marcus Johnson", reason: "Missed appointment · No FAFSA on file", daysSince: 42, risk: "high" },
    { name: "Jordan Scott", reason: "No visit in 38 days · 3 missing documents", daysSince: 38, risk: "high" },
    { name: "Malik Anderson", reason: "No visit in 52 days · Critical intervention", daysSince: 52, risk: "high" },
    { name: "Elijah Thompson", reason: "Attendance declining · Missed 3 appointments", daysSince: 25, risk: "medium" },
    { name: "Deon James", reason: "No FAFSA · Last visit 49 days ago", daysSince: 49, risk: "high" },
  ];

  const quickActions = [
    { label: "Create Appointment", icon: "📅", path: "/dashboard/appointments" },
    { label: "Create Event", icon: "⭐", path: "/dashboard/events" },
    { label: "Send Message", icon: "💬", path: "/dashboard/communications" },
    { label: "Find Student", icon: "🔍", path: "/dashboard/students" },
    { label: "Check In Student", icon: "✅", path: "/dashboard/attendance" },
    { label: "Generate Report", icon: "📊", path: "/dashboard/reports" },
  ];

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Tuesday, June 16, 2026</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{greeting}, Maria</h1>
        <p style={{ fontSize: 13, color: SUB, marginTop: 4 }}>Here's what needs your attention today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard value={todayCheckins.length} label="Students Today" sub="Checked in" color="#fff"
          icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
        />
        <StatCard value={todayAppts.length} label="Appointments" sub="Today" color="#fff" />
        <StatCard value="2" label="Events Today" sub="4:00 PM & 5:30 PM" color="#fff" />
        <StatCard value={followUps.length} label="Follow Ups" sub="Need attention" color={RED} />
        <StatCard value="3" label="AI Alerts" sub="Action needed" color={GOLD} />
        <StatCard value={pendingTasks.length} label="Pending Tasks" sub="Assigned to you" color="#fff" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 20 }}>
        {/* Nova AI Feed */}
        <div style={{ background: CARD, border: `1px solid ${GOLD}33`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nova Intelligence</p>
              <p style={{ fontSize: 10, color: MUTED }}>AI Daily Briefing · Tuesday, June 16</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>Live</span>
            </div>
          </div>
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "⚠️", color: "#f59e0b", title: "18 students missing FAFSA", detail: "Deadline in 30 days. Marcus Johnson, Jordan Scott, Malik Anderson +15 more.", action: "Send Reminders", actionPath: "/dashboard/communications" },
              { icon: "📅", color: RED, title: "2 students missed appointments", detail: "Marcus Johnson (Oct 14) and Jordan Scott (Oct 13) did not show. Rescheduling recommended.", action: "Reschedule", actionPath: "/dashboard/appointments" },
              { icon: "🎓", color: GOLD, title: "8 students qualify for new scholarships", detail: "CT State Foundation, TRIO Achievement Award, and First-Generation Scholar. Deadlines approaching.", action: "View Matches", actionPath: "/dashboard/ai" },
              { icon: "📈", color: "#22c55e", title: "Attendance up 12% vs last week", detail: "24 students checked in today. Great momentum — workshop engagement is driving traffic.", action: "", actionPath: "" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#0D0D0D", borderRadius: 10, border: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{item.title}</p>
                  <p style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.5 }}>{item.detail}</p>
                  {item.action && (
                    <button onClick={() => navigate(item.actionPath)}
                      style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: item.color, background: "none", border: `1px solid ${item.color}33`, borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
                      {item.action} →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Today's Schedule</p>
              <p style={{ fontSize: 10, color: MUTED }}>8 items · Tuesday</p>
            </div>
            <button onClick={() => navigate("/dashboard/appointments")}
              style={{ fontSize: 11, color: RED, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          <div style={{ padding: "8px 0", maxHeight: 420, overflowY: "auto" }}>
            {schedule.map((item, i) => {
              const isCompleted = item.status === "completed";
              const isNow = item.time === "1:00 PM";
              return (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 20px", borderLeft: isNow ? `2px solid ${RED}` : "2px solid transparent", background: isNow ? "rgba(214,31,38,0.04)" : "transparent" }}>
                  <div style={{ width: 52, flexShrink: 0 }}>
                    <p style={{ fontSize: 10.5, fontWeight: 700, color: isCompleted ? MUTED : "#fff", whiteSpace: "nowrap" }}>{item.time}</p>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: isCompleted ? MUTED : "#fff", textDecoration: isCompleted ? "line-through" : "none" }}>{item.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 10.5, color: MUTED }}>{item.student}</span>
                      <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 20, background: item.type === "Event" ? "rgba(214,31,38,0.15)" : "rgba(255,255,255,0.06)", color: item.type === "Event" ? "#FF6B6B" : MUTED, fontWeight: 600 }}>{item.type}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Follow Up Queue */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Follow Up Queue</p>
              <p style={{ fontSize: 10, color: MUTED }}>{followUps.length} students need attention</p>
            </div>
            <button onClick={() => navigate("/dashboard/students")}
              style={{ fontSize: 11, color: RED, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          <div style={{ padding: "8px 0" }}>
            {followUps.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderBottom: i < followUps.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: f.risk === "high" ? "rgba(214,31,38,0.15)" : "rgba(245,158,11,0.12)", border: `1px solid ${f.risk === "high" ? "rgba(214,31,38,0.3)" : "rgba(245,158,11,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: f.risk === "high" ? RED : "#f59e0b" }}>
                    {f.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "#fff" }}>{f.name}</p>
                  <p style={{ fontSize: 11, color: MUTED }}>{f.reason}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: f.risk === "high" ? "rgba(214,31,38,0.15)" : "rgba(245,158,11,0.12)", color: f.risk === "high" ? "#FF6B6B" : "#f59e0b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.risk}</span>
                  <span style={{ fontSize: 10, color: MUTED }}>{f.daysSince}d ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Recent Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick Actions */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 20px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Quick Actions</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {quickActions.map((a) => (
                <button key={a.label} onClick={() => navigate(a.path)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", borderRadius: 10, border: `1px solid ${BORDER}`, background: CARD2, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#202020"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = CARD2; e.currentTarget.style.borderColor = BORDER; }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: SUB, textAlign: "center", lineHeight: 1.3 }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", flex: 1 }}>
            <div style={{ padding: "14px 20px 12px", borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Recent Activity</p>
            </div>
            <div style={{ padding: "4px 0" }}>
              {[
                { text: "Priya Sharma checked in", time: "1:55 PM", dot: "#22c55e" },
                { text: "Cameron Allen checked in", time: "1:14 PM", dot: "#22c55e" },
                { text: "Leila Adams — Appointment completed", time: "1:00 PM", dot: RED },
                { text: "Emma Garcia — Transfer planning completed", time: "10:50 AM", dot: RED },
                { text: "Kevin Nguyen checked in", time: "9:15 AM", dot: "#22c55e" },
                { text: "Aaliyah Williams — Advising completed", time: "9:35 AM", dot: RED },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 20px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: SUB, flex: 1 }}>{item.text}</span>
                  <span style={{ fontSize: 10.5, color: MUTED, flexShrink: 0 }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
