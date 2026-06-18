import { useState } from "react";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";
const SUB = "rgba(255,255,255,0.65)";
const GOLD_GRADIENT = "linear-gradient(135deg,#FFF3B0 0%,#F7D774 15%,#D4AF37 30%,#FFF3B0 45%,#B8860B 60%,#F7D774 75%,#FFF8DC 100%)";

const RESOURCES = [
  { id: "1", title: "TRIO Achievement Award", category: "Scholarships", desc: "Up to $2,500 for first-generation TRIO students. GPA 2.5+ required.", contact: "TRIO Office", deadline: "Jul 15, 2026", amount: "$2,500", icon: "🎓" },
  { id: "2", title: "CT State Foundation Grant", category: "Scholarships", desc: "Need-based grant for CT State students. Pell-eligible students prioritized.", contact: "Financial Aid Office", deadline: "Aug 1, 2026", amount: "$1,500", icon: "🏫" },
  { id: "3", title: "First-Generation Excellence Fund", category: "Scholarships", desc: "Full-tuition scholarship for outstanding first-generation students.", contact: "Academic Affairs", deadline: "Sep 1, 2026", amount: "$3,000", icon: "⭐" },
  { id: "4", title: "Emergency Financial Assistance", category: "Financial", desc: "One-time emergency aid for students facing immediate financial hardship.", contact: "Dean of Students", deadline: "Rolling", amount: "Up to $500", icon: "🆘" },
  { id: "5", title: "CT State Food Pantry", category: "Food Assistance", desc: "Free groceries and pantry items for students in need. No ID required.", contact: "(203) 555-0200", deadline: "Mon–Fri 9am–4pm", amount: "Free", icon: "🥫" },
  { id: "6", title: "2-1-1 CT Food Banks", category: "Food Assistance", desc: "Statewide food bank network. Call 2-1-1 or visit 211ct.org.", contact: "2-1-1", deadline: "24/7 Hotline", amount: "Free", icon: "📞" },
  { id: "7", title: "CT Section 8 Housing", category: "Housing", desc: "HUD Section 8 housing voucher assistance. Apply through local housing authority.", contact: "CT Housing Authority", deadline: "Rolling", amount: "Subsidized", icon: "🏠" },
  { id: "8", title: "Naugatuck Valley Housing Coalition", category: "Housing", desc: "Local housing assistance, rental aid, and emergency shelter referrals.", contact: "(203) 555-0300", deadline: "Rolling", amount: "Varies", icon: "🏘️" },
  { id: "9", title: "CT BHP Mental Health Services", category: "Mental Health", desc: "Free counseling and mental health services for CT residents.", contact: "(800) 281-4700", deadline: "24/7", amount: "Free", icon: "💚" },
  { id: "10", title: "CT State Counseling Services", category: "Mental Health", desc: "Free on-campus counseling. Individual and group sessions available.", contact: "Student Services", deadline: "By Appointment", amount: "Free", icon: "🧠" },
  { id: "11", title: "UConn Transfer Pathway", category: "Transfer", desc: "Guaranteed admission pathway from CT State to UConn for qualifying students.", contact: "Transfer Center", deadline: "Feb 1, 2027", amount: "N/A", icon: "🎯" },
  { id: "12", title: "Transfer Center Resources", category: "Transfer", desc: "Transfer guides, articulation agreements, application assistance.", contact: "Transfer Center", deadline: "Rolling", amount: "Free", icon: "📋" },
  { id: "13", title: "CT Works Career Centers", category: "Career", desc: "Free job placement, resume help, and career training. 18 locations statewide.", contact: "ctworks.ct.gov", deadline: "Rolling", amount: "Free", icon: "💼" },
  { id: "14", title: "LinkedIn Learning Access", category: "Career", desc: "Free LinkedIn Learning for all CT State students. 10,000+ courses.", contact: "Library Resources", deadline: "N/A", amount: "Free", icon: "💻" },
  { id: "15", title: "2-1-1 CT Emergency Services", category: "Emergency", desc: "Connects to emergency housing, food, healthcare. Available 24/7.", contact: "2-1-1", deadline: "24/7", amount: "Free", icon: "🚨" },
];

const CATEGORIES = ["All", "Scholarships", "Financial", "Food Assistance", "Housing", "Mental Health", "Transfer", "Career", "Emergency"];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = RESOURCES.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Resource Center</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Scholarships · Financial Aid · Housing · Food · Mental Health · Career</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, background: RED, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Resource
        </button>
      </div>

      {/* AI recommendation */}
      <div style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 4 }}>Nova AI Resource Recommendations</p>
          <p style={{ fontSize: 12.5, color: SUB, lineHeight: 1.5 }}>
            Based on student data: <strong style={{ color: "#fff" }}>12 students</strong> may benefit from food assistance, <strong style={{ color: "#fff" }}>4 students</strong> have housing concerns, and <strong style={{ color: "#fff" }}>8 students</strong> qualify for mental health services. Click any resource below to share with specific students.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: activeCategory === cat ? 700 : 400, border: `1px solid ${activeCategory === cat ? RED : BORDER}`, background: activeCategory === cat ? "rgba(214,31,38,0.12)" : "transparent", color: activeCategory === cat ? "#fff" : MUTED, cursor: "pointer", transition: "all 0.15s" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input placeholder="Search resources…" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "9px 12px 9px 34px", fontSize: 13, color: "#fff", outline: "none" }} />
      </div>

      {/* Resources grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {filtered.map((r) => (
          <div key={r.id}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = CARD2; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = CARD; e.currentTarget.style.borderColor = BORDER; }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 3, lineHeight: 1.3 }}>{r.title}</p>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.category}</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: SUB, lineHeight: 1.5, marginBottom: 12 }}>{r.desc}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: MUTED, marginBottom: 2 }}>Amount</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>{r.amount}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: MUTED, marginBottom: 2 }}>Deadline</p>
                <p style={{ fontSize: 12, color: "#fff" }}>{r.deadline}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: RED, border: "none", color: "#fff", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Share with Student</button>
              <button style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 11.5, cursor: "pointer" }}>View</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px", color: MUTED, fontSize: 13 }}>No resources found for "{search}"</div>
      )}
    </main>
  );
}
