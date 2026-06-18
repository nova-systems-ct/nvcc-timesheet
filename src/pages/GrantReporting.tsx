import { useState } from "react";
import { getStudentsTriο, getCheckIns, getAppointments, getEvents } from "../lib/trioData";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";
const SUB = "rgba(255,255,255,0.65)";
const GOLD_GRADIENT = "linear-gradient(135deg,#FFF3B0 0%,#F7D774 15%,#D4AF37 30%,#FFF3B0 45%,#B8860B 60%,#F7D774 75%,#FFF8DC 100%)";

const REPORTS = [
  { id: "attendance", title: "Attendance Report", desc: "Daily, weekly, and monthly attendance records. Student visit logs with purpose and duration.", icon: "📊", category: "Operations", time: "~3 sec" },
  { id: "appointments", title: "Appointment Report", desc: "Advisor meeting records, completion rates, no-show analysis, and meeting types.", icon: "📅", category: "Operations", time: "~3 sec" },
  { id: "events", title: "Event Participation Report", desc: "Workshop and event attendance, registration vs. participation rates, student engagement.", icon: "⭐", category: "Operations", time: "~4 sec" },
  { id: "student-outcomes", title: "Student Outcomes Report", desc: "GPA trends, retention rates, transfer success, graduation rates, and milestone completions.", icon: "🎓", category: "Outcomes", time: "~5 sec" },
  { id: "advisor-activity", title: "Advisor Activity Report", desc: "Advisor meeting counts, student caseloads, follow-up completion, and productivity metrics.", icon: "👩‍💼", category: "Operations", time: "~3 sec" },
  { id: "engagement", title: "Engagement & Retention Report", desc: "Student engagement scores, at-risk identification, retention predictions, and intervention tracking.", icon: "📈", category: "Outcomes", time: "~5 sec" },
  { id: "fafsa", title: "FAFSA Completion Report", desc: "FAFSA submission rates, missing documentation, financial aid status, and Pell eligibility.", icon: "💰", category: "Financial Aid", time: "~4 sec" },
  { id: "scholarship", title: "Scholarship Report", desc: "Scholarship applications, awards, and amounts by student. AI-matched opportunities.", icon: "🏆", category: "Financial Aid", time: "~3 sec" },
  { id: "trio-apr", title: "TRIO Annual Performance Report", desc: "Federal DOE APR data — enrollment, persistence, academic standing, and program outcomes.", icon: "🇺🇸", category: "Federal", time: "~8 sec" },
  { id: "federal", title: "Federal Compliance Report", desc: "GPRA performance measures, target vs. actual metrics, and grant compliance documentation.", icon: "📋", category: "Federal", time: "~6 sec" },
  { id: "state", title: "State TRIO Report", desc: "CT State-specific program metrics, DOE reporting requirements, and program impact summary.", icon: "🏛️", category: "State", time: "~6 sec" },
  { id: "custom", title: "Custom Report Builder", desc: "Build a custom report with any combination of metrics, date ranges, and student filters.", icon: "⚙️", category: "Custom", time: "Varies" },
];

const CATEGORIES = ["All", "Operations", "Outcomes", "Financial Aid", "Federal", "State", "Custom"];

export default function GrantReporting() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-06-16");

  const students = getStudentsTriο();
  const checkins = getCheckIns();
  const appointments = getAppointments();
  const events = getEvents();

  const filtered = activeCategory === "All" ? REPORTS : REPORTS.filter((r) => r.category === activeCategory);

  const handleGenerate = async (reportId: string) => {
    setGenerating(reportId);
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
    setGenerating(null);
    setGenerated(reportId);
    setTimeout(() => setGenerated(null), 3000);
  };

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Grant Reporting Center</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>One-click federal, state, and operational reports · PDF & Excel export</p>
        </div>
      </div>

      {/* Live program stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Enrolled Students", value: students.length, color: "#fff" },
          { label: "Total Check-Ins", value: checkins.length, color: "#fff" },
          { label: "Appointments", value: appointments.length, color: "#fff" },
          { label: "Events Hosted", value: events.length, color: "#fff" },
          { label: "First-Gen Students", value: students.filter((s) => s.firstGen).length, color: "#22c55e" },
        ].map((s) => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "13px 16px" }}>
            <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 5 }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Date range */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>Report Date Range</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#fff", outline: "none" }} />
            <span style={{ color: MUTED, fontSize: 13 }}>to</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#fff", outline: "none" }} />
          </div>
        </div>
        <div style={{ height: 40, width: 1, background: BORDER }} />
        <div style={{ display: "flex", gap: 8 }}>
          {["Q1 2026", "Q2 2026", "Semester 1", "Full Year"].map((p) => (
            <button key={p} style={{ padding: "7px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 11.5, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = CARD2; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: activeCategory === cat ? 700 : 400, border: `1px solid ${activeCategory === cat ? RED : BORDER}`, background: activeCategory === cat ? "rgba(214,31,38,0.12)" : "transparent", color: activeCategory === cat ? "#fff" : MUTED, cursor: "pointer" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Report cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {filtered.map((report) => {
          const isGenerating = generating === report.id;
          const isDone = generated === report.id;
          return (
            <div key={report.id} style={{ background: CARD, border: `1px solid ${isDone ? "#22c55e44" : BORDER}`, borderRadius: 12, padding: "18px", transition: "all 0.3s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{report.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{report.title}</p>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>{report.category}</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: SUB, lineHeight: 1.5, marginBottom: 14 }}>{report.desc}</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => handleGenerate(report.id)}
                  disabled={!!generating}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 9, background: isDone ? "#22c55e" : isGenerating ? "rgba(214,31,38,0.5)" : RED, border: "none", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {isGenerating ? (
                    <>
                      <div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Generating…
                    </>
                  ) : isDone ? "✓ Ready — Download" : "Generate Report"}
                </button>
                <button style={{ padding: "9px 12px", borderRadius: 9, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 12, cursor: "pointer" }} title={`~${report.time}`}>
                  XLS
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Reporting assistant */}
      <div style={{ background: `rgba(212,175,55,0.04)`, border: `1px solid ${`rgba(212,175,55,0.2)`}`, borderRadius: 14, padding: "18px 22px", marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nova AI Grant Assistant</p>
            <p style={{ fontSize: 11, color: MUTED }}>AI-powered report narrative and compliance analysis</p>
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: SUB, lineHeight: 1.6, marginBottom: 14 }}>
          Nova AI can write the narrative sections of your TRIO APR and grant reports automatically. Based on current program data, your program is performing above target on <strong style={{ color: "#fff" }}>3 of 5 GPRA measures</strong>. One-click to generate a complete report narrative ready for submission.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "9px 18px", borderRadius: 9, background: GOLD_GRADIENT, border: "none", color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Generate APR Narrative
          </button>
          <button style={{ padding: "9px 18px", borderRadius: 9, border: `1px solid rgba(212,175,55,0.3)`, background: "transparent", color: "#D4AF37", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            View Compliance Checklist
          </button>
        </div>
      </div>
    </main>
  );
}
