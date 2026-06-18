import { useState } from "react";
import { getStudentsTriο } from "../lib/trioData";
import type { TRIOStudent } from "../lib/trioData";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";
const SUB = "rgba(255,255,255,0.65)";
const GOLD = "#D4AF37";
const GOLD_GRADIENT = "linear-gradient(135deg,#FFF3B0 0%,#F7D774 15%,#D4AF37 30%,#FFF3B0 45%,#B8860B 60%,#F7D774 75%,#FFF8DC 100%)";

const RISK_COLORS: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: RED,
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
  "at-risk": { bg: "rgba(214,31,38,0.12)", text: "#FF6B6B" },
  inactive: { bg: "rgba(255,255,255,0.06)", text: MUTED },
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function daysAgo(dateStr: string | null) {
  if (!dateStr) return "Never";
  const diff = Math.floor((new Date("2026-06-16").getTime() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
}

export default function StudentsPage() {
  const [students] = useState<TRIOStudent[]>(() => getStudentsTriο());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [filterAdvisor, setFilterAdvisor] = useState<string>("all");
  const [selected, setSelected] = useState<TRIOStudent | null>(null);
  const [profileTab, setProfileTab] = useState<"profile" | "activity" | "ai">("profile");

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.school.toLowerCase().includes(q) || s.major.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const matchRisk = filterRisk === "all" || s.riskLevel === filterRisk;
    const matchAdvisor = filterAdvisor === "all" || s.advisor === filterAdvisor;
    return matchSearch && matchStatus && matchRisk && matchAdvisor;
  });

  const totals = {
    all: students.length,
    active: students.filter((s) => s.status === "active").length,
    atRisk: students.filter((s) => s.status === "at-risk").length,
    inactive: students.filter((s) => s.status === "inactive").length,
  };

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505", position: "relative" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Students</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{students.length} enrolled · TRIO Program</p>
        </div>
        <button
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, background: RED, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Student
        </button>
      </div>

      {/* Stat tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Enrolled", value: totals.all, color: "#fff" },
          { label: "Active", value: totals.active, color: "#22c55e" },
          { label: "At Risk", value: totals.atRisk, color: RED },
          { label: "Inactive", value: totals.inactive, color: MUTED },
        ].map((s) => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            placeholder="Search by name, ID, major…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "9px 12px 9px 36px", fontSize: 13, color: "#fff", outline: "none" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
          />
        </div>
        {[
          { label: "Status", value: filterStatus, onChange: setFilterStatus, options: [["all", "All Status"], ["active", "Active"], ["at-risk", "At Risk"], ["inactive", "Inactive"]] },
          { label: "Risk", value: filterRisk, onChange: setFilterRisk, options: [["all", "All Risk"], ["low", "Low"], ["medium", "Medium"], ["high", "High"]] },
          { label: "Advisor", value: filterAdvisor, onChange: setFilterAdvisor, options: [["all", "All Advisors"], ["Maria Santos", "Maria Santos"], ["James Wilson", "James Wilson"], ["Keisha Brown", "Keisha Brown"]] },
        ].map((f) => (
          <select key={f.label} value={f.value} onChange={(e) => f.onChange(e.target.value)}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none", cursor: "pointer" }}>
            {f.options.map(([v, l]) => <option key={v} value={v} style={{ background: "#1a1a1a" }}>{l}</option>)}
          </select>
        ))}
        <span style={{ fontSize: 12, color: MUTED, alignSelf: "center", marginLeft: 4 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Student grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map((s) => (
          <div key={s.id}
            onClick={() => { setSelected(s); setProfileTab("profile"); }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = CARD2; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = CARD; e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{initials(s.name)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{s.name}</p>
                <p style={{ fontSize: 11, color: MUTED }}>{s.school}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: STATUS_COLORS[s.status].bg, color: STATUS_COLORS[s.status].text, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {s.status}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: RISK_COLORS[s.riskLevel] }} />
                  <span style={{ fontSize: 9, color: RISK_COLORS[s.riskLevel], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.riskLevel} risk</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[
                { label: "Major", value: s.major },
                { label: "GPA", value: s.gpa.toFixed(1) },
                { label: "Advisor", value: s.advisor.split(" ")[0] },
                { label: "Last Visit", value: daysAgo(s.lastVisit) },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED, marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 11.5, color: SUB, fontWeight: 500 }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: MUTED, border: `1px solid ${BORDER}` }}>{s.classification}</span>
              {s.missingDocuments > 0 && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>{s.missingDocuments} missing docs</span>
              )}
              {s.firstGen && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.04)", color: MUTED }}>1st Gen</span>}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: SUB }}>No students found</p>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Student Profile Slideout */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }} onClick={() => setSelected(null)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 480, background: "#0D0D0D", border: `1px solid ${BORDER}`, overflowY: "auto", display: "flex", flexDirection: "column" }}>

            {/* Profile header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{initials(selected.name)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <p style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{selected.name}</p>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: STATUS_COLORS[selected.status].bg, color: STATUS_COLORS[selected.status].text, textTransform: "uppercase" }}>{selected.status}</span>
                </div>
                <p style={{ fontSize: 12, color: MUTED }}>{selected.studentId} · {selected.school}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 4 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
              {(["profile", "activity", "ai"] as const).map((tab) => (
                <button key={tab} onClick={() => setProfileTab(tab)}
                  style={{ flex: 1, padding: "11px 0", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: profileTab === tab ? 700 : 500, color: profileTab === tab ? "#fff" : MUTED, borderBottom: `2px solid ${profileTab === tab ? RED : "transparent"}`, transition: "all 0.15s", textTransform: "capitalize" }}>
                  {tab === "ai" ? "AI Insights" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
              {profileTab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    {
                      title: "Personal Information",
                      rows: [
                        ["Full Name", selected.name],
                        ["Email", selected.email],
                        ["Phone", selected.phone],
                        ["Student ID", selected.studentId],
                      ]
                    },
                    {
                      title: "Academic Information",
                      rows: [
                        ["School", selected.school],
                        ["Major", selected.major],
                        ["GPA", selected.gpa.toFixed(2)],
                        ["Classification", selected.classification],
                        ["Advisor", selected.advisor],
                      ]
                    },
                    {
                      title: "TRIO Information",
                      rows: [
                        ["Status", selected.status.charAt(0).toUpperCase() + selected.status.slice(1)],
                        ["Risk Level", selected.riskLevel.toUpperCase()],
                        ["First Generation", selected.firstGen ? "Yes" : "No"],
                        ["Pell Grant", selected.pell ? "Yes" : "No"],
                        ["Enrolled Date", selected.enrolledDate],
                        ["Total Visits", selected.totalVisits.toString()],
                        ["Last Visit", selected.lastVisit ? daysAgo(selected.lastVisit) : "Never"],
                      ]
                    }
                  ].map((section) => (
                    <div key={section.title}>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 10 }}>{section.title}</p>
                      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
                        {section.rows.map(([label, value], i) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < section.rows.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                            <span style={{ fontSize: 12, color: MUTED }}>{label}</span>
                            <span style={{ fontSize: 12, color: "#fff", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {selected.notes && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 10 }}>Notes</p>
                      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px" }}>
                        <p style={{ fontSize: 12.5, color: SUB, lineHeight: 1.6 }}>{selected.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {profileTab === "activity" && (
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 14 }}>Engagement History</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                    {[
                      { label: "Total Visits", value: selected.totalVisits },
                      { label: "Last Visit", value: selected.lastVisit ? daysAgo(selected.lastVisit) : "Never" },
                      { label: "Missing Docs", value: selected.missingDocuments },
                      { label: "Risk Level", value: selected.riskLevel.toUpperCase() },
                    ].map((item) => (
                      <div key={item.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px" }}>
                        <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 4 }}>{item.label}</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: MUTED, textAlign: "center", padding: "20px 0" }}>Full activity timeline available with Supabase integration.</p>
                </div>
              )}

              {profileTab === "ai" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: `${GOLD}11`, border: `1px solid ${GOLD}33`, borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 14 }}>✨</span>
                      <p style={{ fontSize: 12, fontWeight: 700, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nova Intelligence · Student Analysis</p>
                    </div>
                    {selected.riskLevel === "high" && (
                      <div style={{ background: "rgba(214,31,38,0.08)", border: "1px solid rgba(214,31,38,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#FF6B6B", marginBottom: 4 }}>⚠️ High Risk Alert</p>
                        <p style={{ fontSize: 11.5, color: SUB, lineHeight: 1.5 }}>
                          {selected.lastVisit ? `Last visit was ${daysAgo(selected.lastVisit)}.` : "No visits on record."} Immediate outreach recommended.
                        </p>
                      </div>
                    )}
                    <div style={{ fontSize: 12.5, color: SUB, lineHeight: 1.6 }}>
                      {selected.pell && <p style={{ marginBottom: 6 }}>• Student receives Pell Grant — eligible for additional institutional aid</p>}
                      {selected.firstGen && <p style={{ marginBottom: 6 }}>• First-generation college student — qualifies for TRIO First-Gen scholarship</p>}
                      {selected.missingDocuments > 0 && <p style={{ marginBottom: 6 }}>• {selected.missingDocuments} document(s) missing from file — follow up required</p>}
                      {selected.gpa < 2.5 && <p style={{ marginBottom: 6 }}>• GPA below 2.5 — academic coaching recommended</p>}
                      {selected.totalVisits < 5 && <p style={{ marginBottom: 6 }}>• Low engagement ({selected.totalVisits} total visits) — increase touchpoints</p>}
                      {selected.gpa >= 3.5 && <p style={{ marginBottom: 6 }}>• High GPA ({selected.gpa}) — excellent scholarship candidate</p>}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 10 }}>Recommended Scholarships</p>
                    {[
                      { name: "TRIO Achievement Award", amount: "$2,500", deadline: "Jul 15, 2026", match: selected.firstGen ? "98%" : "72%" },
                      { name: "CT State Foundation Grant", amount: "$1,500", deadline: "Aug 1, 2026", match: selected.pell ? "91%" : "65%" },
                      { name: "First-Generation Excellence", amount: "$3,000", deadline: "Sep 1, 2026", match: selected.firstGen ? "94%" : "45%" },
                    ].map((s) => (
                      <div key={s.name} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#fff" }}>{s.name}</p>
                          <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{s.amount} · Deadline: {s.deadline}</p>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: `${GOLD}18`, color: GOLD }}>{s.match}</span>
                      </div>
                    ))}
                  </div>

                  <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 0", borderRadius: 9, background: RED, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" /></svg>
                    Schedule Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
