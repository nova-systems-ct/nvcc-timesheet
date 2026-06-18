const CARD = "#111111";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";
const SUB = "rgba(255,255,255,0.65)";

export default function SettingsPage() {
  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Settings</h1>
        <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Program configuration and account management</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
        {[
          {
            title: "Program Information",
            items: [
              { label: "Program Name", value: "TRIO Student Support Services" },
              { label: "Institution", value: "CT State Community College" },
              { label: "Grant Number", value: "P042A220xxx" },
              { label: "Grant Period", value: "2022–2027" },
              { label: "Student Capacity", value: "160 students" },
            ]
          },
          {
            title: "Advisor Accounts",
            items: [
              { label: "Maria Santos", value: "TRIO Advisor · maria.santos@ctstate.edu" },
              { label: "James Wilson", value: "TRIO Advisor · james.wilson@ctstate.edu" },
              { label: "Keisha Brown", value: "TRIO Advisor · keisha.brown@ctstate.edu" },
            ]
          },
          {
            title: "Notifications",
            items: [
              { label: "At-Risk Student Alerts", value: "Enabled" },
              { label: "Daily AI Briefing", value: "Enabled · 7:30 AM" },
              { label: "FAFSA Deadline Reminders", value: "Enabled · 30 days before" },
              { label: "Missed Appointment Alerts", value: "Enabled" },
            ]
          },
        ].map((section) => (
          <div key={section.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{section.title}</p>
            </div>
            {section.items.map((item, i) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: i < section.items.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <span style={{ fontSize: 13, color: SUB }}>{item.label}</span>
                <span style={{ fontSize: 12.5, color: MUTED, fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        ))}

        <div style={{ background: "rgba(214,31,38,0.05)", border: "1px solid rgba(214,31,38,0.2)", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Danger Zone</p>
          <p style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>Irreversible actions — proceed with caution.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { if (confirm("Reset all demo data?")) { localStorage.removeItem("trio-seeded-v1"); location.reload(); } }}
              style={{ padding: "9px 16px", borderRadius: 9, background: "rgba(214,31,38,0.12)", border: "1px solid rgba(214,31,38,0.25)", color: "#FF6B6B", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
              Reset Demo Data
            </button>
            <button style={{ padding: "9px 16px", borderRadius: 9, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              Export All Data
            </button>
          </div>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.7 }}>
            TRIO Connect v2.0 · Built by Nova Systems · isaac_0427@icloud.com<br />
            CT State Community College · TRIO Student Support Services<br />
            © 2026 Nova Systems. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
