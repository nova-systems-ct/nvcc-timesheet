import { getStudentsTriο } from "../lib/trioData";
import { useNavigate } from "react-router-dom";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";
const SUB = "rgba(255,255,255,0.65)";
const GOLD = "#D4AF37";
const GOLD_GRADIENT = "linear-gradient(135deg,#FFF3B0 0%,#F7D774 15%,#D4AF37 30%,#FFF3B0 45%,#B8860B 60%,#F7D774 75%,#FFF8DC 100%)";

export default function AICenter() {
  const navigate = useNavigate();
  const students = getStudentsTriο();

  const atRisk = students.filter((s) => s.riskLevel === "high");
  const mediumRisk = students.filter((s) => s.riskLevel === "medium");
  const noVisit30 = students.filter((s) => s.lastVisit === null || (new Date("2026-06-16").getTime() - new Date(s.lastVisit).getTime()) / 86400000 > 30);
  const missingFAFSA = students.filter((s) => s.missingDocuments > 0);
  const firstGenPell = students.filter((s) => s.firstGen && s.pell);
  const highGPA = students.filter((s) => s.gpa >= 3.5);

  const healthScore = Math.round(((students.length - atRisk.length) / students.length) * 100 - 5);

  const scholarships = [
    { name: "TRIO Achievement Award", amount: "$2,500", deadline: "Jul 15", eligible: firstGenPell.length, match: "98%" },
    { name: "CT State Foundation Grant", amount: "$1,500", deadline: "Aug 1", eligible: students.filter((s) => s.pell).length, match: "91%" },
    { name: "First-Generation Excellence", amount: "$3,000", deadline: "Sep 1", eligible: students.filter((s) => s.firstGen).length, match: "94%" },
    { name: "Academic Excellence Award", amount: "$2,000", deadline: "Jul 30", eligible: highGPA.length, match: "88%" },
  ];

  const eventRecs = [
    { name: "Scholarship Application Bootcamp", reason: "27 students have incomplete scholarship apps", expectedAttendance: 31, impact: "+18 scholarship completions" },
    { name: "Financial Literacy Night", reason: "18 students missing FAFSA, financial stress indicators", expectedAttendance: 28, impact: "+$45,000 in aid recovered" },
    { name: "Resume & Career Fair Prep", reason: "14 seniors approaching graduation, job readiness low", expectedAttendance: 22, impact: "+62% job placement rate" },
    { name: "Transfer Planning Workshop", reason: "12 juniors/seniors interested in 4-year transfer", expectedAttendance: 18, impact: "+8 successful transfers" },
  ];

  const predictions = [
    { name: "Marcus Johnson", risk: "high", reason: "No visits in 42 days, missing FAFSA, GPA 2.4", action: "Emergency outreach" },
    { name: "Malik Anderson", risk: "high", reason: "No visits in 52 days, 3 missing documents", action: "Immediate intervention" },
    { name: "Deon James", risk: "high", reason: "No FAFSA, last visit 49 days ago", action: "Phone call + email" },
    { name: "Tre Mitchell", risk: "high", reason: "44 days no visit, missed 3 appointments", action: "Advisor reassignment" },
    { name: "Jordan Scott", risk: "high", reason: "38 days no visit, 3 missing docs, low GPA", action: "Emergency advising" },
    { name: "DeShawn Harris", risk: "medium", reason: "31 days no visit, 2 missing docs", action: "Schedule check-in" },
    { name: "Caleb Moore", risk: "medium", reason: "20 days no visit, GPA declining", action: "Academic coaching" },
    { name: "Elijah Thompson", risk: "medium", reason: "Missed 3 appointments, attendance down", action: "Reschedule + outreach" },
  ];

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>Nova Intelligence</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>AI Intelligence Center · Student Success Analytics · Powered by Nova Systems</p>
        </div>
      </div>

      {/* Program Health Score + key metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: CARD, border: `1px solid ${GOLD}33`, borderRadius: 14, padding: "20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, marginBottom: 12 }}>Program Health</p>
          <div style={{ position: "relative", width: 100, height: 100, marginBottom: 12 }}>
            <svg viewBox="0 0 100 100" width="100" height="100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={GOLD} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - healthScore / 100)}`}
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dashoffset 1s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{healthScore}%</p>
            </div>
          </div>
          <p style={{ fontSize: 11, color: MUTED }}>Good Standing</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { label: "Total Students", value: students.length, sub: "Enrolled", color: "#fff" },
            { label: "At Risk", value: atRisk.length, sub: "Need intervention", color: RED },
            { label: "Watch List", value: mediumRisk.length, sub: "Medium risk", color: "#f59e0b" },
            { label: "No Visit 30d", value: noVisit30.length, sub: "Need outreach", color: RED },
            { label: "Missing FAFSA", value: missingFAFSA.length, sub: "Documents needed", color: "#f59e0b" },
            { label: "High Performers", value: highGPA.length, sub: "GPA 3.5+", color: "#22c55e" },
          ].map((s) => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
              <p style={{ fontSize: 10, color: MUTED, marginTop: 3 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Student Risk Engine */}
        <div style={{ background: CARD, border: "1px solid rgba(214,31,38,0.2)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(214,31,38,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED, animation: "pulse-dot 2s infinite" }} />
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Student Risk Engine</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(214,31,38,0.12)", color: "#FF6B6B" }}>{predictions.length} alerts</span>
          </div>
          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {predictions.map((p, i) => (
              <div key={i} style={{ padding: "12px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.risk === "high" ? RED : "#f59e0b", flexShrink: 0, marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{p.name}</p>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 20, background: p.risk === "high" ? "rgba(214,31,38,0.12)" : "rgba(245,158,11,0.1)", color: p.risk === "high" ? "#FF6B6B" : "#f59e0b", textTransform: "uppercase" }}>{p.risk}</span>
                  </div>
                  <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.4, marginBottom: 6 }}>{p.reason}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => navigate("/dashboard/students")}
                      style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "rgba(214,31,38,0.12)", border: "1px solid rgba(214,31,38,0.25)", color: "#FF6B6B", cursor: "pointer" }}>
                      {p.action}
                    </button>
                    <button style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, cursor: "pointer" }}>
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(214,31,38,0.15)" }}>
            <button
              style={{ width: "100%", padding: "9px 0", borderRadius: 8, background: RED, border: "none", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
              Launch Outreach Campaign for All At-Risk Students
            </button>
          </div>
        </div>

        {/* Scholarship Matching */}
        <div style={{ background: CARD, border: `1px solid ${GOLD}25`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${GOLD}20`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Scholarship Matching</p>
          </div>
          <div style={{ padding: "14px 18px" }}>
            {scholarships.map((s) => (
              <div key={s.name} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{s.name}</p>
                    <p style={{ fontSize: 11, color: MUTED }}>{s.amount} · Deadline: {s.deadline}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.match}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, color: SUB }}><strong style={{ color: "#fff" }}>{s.eligible}</strong> students qualify</span>
                  <button style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 7, background: GOLD_GRADIENT, border: "none", color: "#000", cursor: "pointer" }}>Send Alerts</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Event Intelligence */}
        <div style={{ background: CARD, border: `1px solid ${GOLD}25`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${GOLD}20`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Event Planner</p>
          </div>
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
            {eventRecs.map((e, i) => (
              <div key={i} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{e.name}</p>
                <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.4, marginBottom: 8 }}>{e.reason}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 9, color: MUTED, textTransform: "uppercase" }}>Expected</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{e.expectedAttendance}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 9, color: MUTED, textTransform: "uppercase" }}>Impact</p>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#22c55e" }}>{e.impact}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate("/dashboard/events")}
                    style={{ fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 7, background: GOLD_GRADIENT, border: "none", color: "#000", cursor: "pointer" }}>
                    Create →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Analytics */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Predictive Analytics</p>
            <p style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>AI-generated program forecasts</p>
          </div>
          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Semester Retention Rate", value: "87%", change: "+4%", positive: true, desc: "Based on current engagement" },
              { label: "FAFSA Completion by Aug 1", value: "73%", change: "-18%", positive: false, desc: "18 students need follow-up" },
              { label: "Transfer Readiness (Seniors)", value: "62%", change: "+8%", positive: true, desc: "12 students on track" },
              { label: "Avg. Appointments This Month", value: "2.4", change: "+0.3", positive: true, desc: "Per student per month" },
              { label: "Students Likely to Disengage", value: atRisk.length.toString(), change: "Watch List", positive: false, desc: "Predicted next 30 days" },
              { label: "Program Engagement Score", value: "78%", change: "+12%", positive: true, desc: "vs. last semester" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: MUTED }}>{item.desc}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{item.value}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: item.positive ? "#22c55e" : RED }}>{item.change}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 18px", borderTop: `1px solid ${BORDER}` }}>
            <button onClick={() => navigate("/dashboard/reports")}
              style={{ width: "100%", padding: "9px 0", borderRadius: 8, background: "transparent", border: `1px solid ${GOLD}44`, color: GOLD, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
              Generate Full Analytics Report
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
