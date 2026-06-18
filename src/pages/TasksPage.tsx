import { useState } from "react";
import { getTasks, saveTasks } from "../lib/trioData";
import type { TRIOTask } from "../lib/trioData";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  high: { bg: "rgba(214,31,38,0.12)", color: "#FF6B6B" },
  medium: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  low: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
};

const CATEGORIES = ["Follow Up", "Financial Aid", "Communications", "Events", "At Risk", "Reporting", "Documents", "Transfer", "Scholarships", "Other"];

function uid() { return Math.random().toString(36).slice(2, 11) + Date.now().toString(36); }

function dueDateColor(date: string): string {
  const today = "2026-06-16";
  if (date < today) return "#FF6B6B";
  if (date === today) return "#f59e0b";
  return MUTED;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TRIOTask[]>(() => getTasks());
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [form, setForm] = useState<{ title: string; description: string; dueDate: string; priority: "low" | "medium" | "high"; studentName: string; category: string; assignedTo: string }>({ title: "", description: "", dueDate: "2026-06-16", priority: "medium", studentName: "", category: "Follow Up", assignedTo: "Maria Santos" });

  const updateStatus = (id: string, status: TRIOTask["status"]) => {
    const updated = tasks.map((t) => t.id === id ? { ...t, status } : t);
    saveTasks(updated);
    setTasks(updated);
  };

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const task: TRIOTask = {
      id: uid(),
      title: form.title,
      description: form.description || undefined,
      dueDate: form.dueDate,
      priority: form.priority,
      status: "pending",
      studentName: form.studentName || undefined,
      assignedTo: form.assignedTo,
      createdAt: "2026-06-16",
      category: form.category,
    };
    const updated = [task, ...tasks];
    saveTasks(updated);
    setTasks(updated);
    setShowCreate(false);
    setForm({ title: "", description: "", dueDate: "2026-06-16", priority: "medium", studentName: "", category: "Follow Up", assignedTo: "Maria Santos" });
  };

  const filtered = filter === "all" ? tasks : filter === "completed" ? tasks.filter((t) => t.status === "completed") : tasks.filter((t) => t.status !== "completed");

  const pending = tasks.filter((t) => t.status === "pending");
  const inProgress = tasks.filter((t) => t.status === "in-progress");
  const completed = tasks.filter((t) => t.status === "completed");
  const overdue = tasks.filter((t) => t.dueDate < "2026-06-16" && t.status !== "completed");

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Tasks</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{pending.length + inProgress.length} active · {overdue.length} overdue</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, background: RED, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Pending", value: pending.length, color: "#60a5fa" },
          { label: "In Progress", value: inProgress.length, color: "#f59e0b" },
          { label: "Overdue", value: overdue.length, color: RED },
          { label: "Completed", value: completed.length, color: "#22c55e" },
        ].map((s) => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[["all", "All Tasks"], ["active", "Active"], ["completed", "Completed"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: filter === v ? 700 : 400, border: `1px solid ${filter === v ? RED : BORDER}`, background: filter === v ? "rgba(214,31,38,0.12)" : "transparent", color: filter === v ? "#fff" : MUTED, cursor: "pointer" }}>
            {l}
          </button>
        ))}
      </div>

      {/* Task columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { title: "Pending", tasks: filtered.filter((t) => t.status === "pending"), status: "pending" as const, color: "#60a5fa" },
          { title: "In Progress", tasks: filtered.filter((t) => t.status === "in-progress"), status: "in-progress" as const, color: "#f59e0b" },
          { title: "Completed", tasks: filter === "completed" || filter === "all" ? completed : [], status: "completed" as const, color: "#22c55e" },
        ].map((col) => (
          <div key={col.title}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
              <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.07em" }}>{col.title}</p>
              <span style={{ fontSize: 11, color: MUTED, marginLeft: "auto" }}>{col.tasks.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.tasks.map((task) => (
                <div key={task.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px", cursor: "pointer", transition: "all 0.15s", opacity: task.status === "completed" ? 0.6 : 1 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = CARD2; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = CARD; }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <button
                      onClick={() => updateStatus(task.id, task.status === "completed" ? "pending" : "completed")}
                      style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${task.status === "completed" ? "#22c55e" : BORDER}`, background: task.status === "completed" ? "#22c55e" : "transparent", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                      {task.status === "completed" && <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.3, textDecoration: task.status === "completed" ? "line-through" : "none" }}>{task.title}</p>
                  </div>
                  {task.description && <p style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.5, marginBottom: 10 }}>{task.description}</p>}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: PRIORITY_STYLES[task.priority].bg, color: PRIORITY_STYLES[task.priority].color, textTransform: "uppercase" }}>{task.priority}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: MUTED }}>{task.category}</span>
                    {task.studentName && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: MUTED }}>{task.studentName}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: 10.5, color: dueDateColor(task.dueDate), fontWeight: task.dueDate <= "2026-06-16" ? 700 : 400 }}>
                      {task.dueDate === "2026-06-16" ? "Due Today" : task.dueDate < "2026-06-16" ? `Overdue: ${task.dueDate}` : `Due: ${task.dueDate}`}
                    </p>
                    {task.status !== "completed" && (
                      <button onClick={() => updateStatus(task.id, task.status === "pending" ? "in-progress" : "completed")}
                        style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, cursor: "pointer" }}>
                        {task.status === "pending" ? "Start →" : "Done ✓"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {col.tasks.length === 0 && (
                <div style={{ padding: "20px", textAlign: "center", color: MUTED, fontSize: 12, border: `1px dashed ${BORDER}`, borderRadius: 10 }}>No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create task modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }} onClick={() => setShowCreate(false)}>
          <div style={{ background: "#0D0D0D", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, width: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Add Task</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Task Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Description (optional)</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none", resize: "vertical" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as "low" | "medium" | "high" })} style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none" }}>
                    {["high", "medium", "low"].map((p) => <option key={p} value={p} style={{ background: "#1a1a1a" }}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none" }}>
                  {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, display: "block", marginBottom: 6 }}>Related Student (optional)</label>
                <input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="Student name…" style={{ width: "100%", boxSizing: "border-box", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleCreate} disabled={!form.title.trim()} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: form.title.trim() ? RED : "#333", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: form.title.trim() ? "pointer" : "not-allowed" }}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
