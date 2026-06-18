import { useState, useEffect, useRef, useCallback } from "react";
import { Timesheet } from "../components/Timesheet";
import { getStudents, saveStudents, clearStudents, parseStudentCSV } from "../lib/students";
import type { Student } from "../lib/students";
import { PAY_PERIODS, findCurrentPayPeriod } from "../data/payPeriods";
import type { PayPeriod } from "../data/payPeriods";
import { downloadTimesheetsZip } from "../lib/zipExport";

const CARD = "#111111";
const CARD2 = "#181818";
const RED = "#D61F26";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.4)";

const TEST_STUDENT: Student = { name: "Isaac Nova", department: "WIOA Out Of School", studentId: "WD-2024-01", workLocation: "Naugatuck Valley CC" };
const BLANK_STUDENT: Student = { name: "", department: "", studentId: "", workLocation: "" };

type Mode = "byPeriod" | "forStudent" | "all";
interface PrintItem { student: Student; period: PayPeriod; }

export default function TimesheetPage() {
  const [students, setStudents] = useState<Student[]>(() => getStudents());
  const [printQueue, setPrintQueue] = useState<PrintItem[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [mode, setMode] = useState<Mode>("forStudent");
  const isTestMode = students.length === 0;
  const effectiveStudents = isTestMode ? [TEST_STUDENT] : students;
  const studentCount = isTestMode ? 0 : students.length;

  const [selectedName, setSelectedName] = useState(effectiveStudents[0]?.name ?? "");
  const [periodIdx, setPeriodIdx] = useState(() => { const c = findCurrentPayPeriod(); return c ? c.id - 1 : 0; });
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(PAY_PERIODS.length - 1);
  const [zipProgress, setZipProgress] = useState<{ done: number; total: number } | null>(null);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [csvOk, setCsvOk] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedStudent = effectiveStudents.find((s) => s.name === selectedName) ?? effectiveStudents[0];
  const selectedPeriod = PAY_PERIODS[periodIdx];
  const currentPP = findCurrentPayPeriod();
  const [lo, hi] = fromIdx <= toIdx ? [fromIdx, toIdx] : [toIdx, fromIdx];
  const allCount = effectiveStudents.length * (hi - lo + 1);

  useEffect(() => {
    if (!effectiveStudents.find((s) => s.name === selectedName)) setSelectedName(effectiveStudents[0]?.name ?? "");
  }, [effectiveStudents, selectedName]);

  useEffect(() => {
    if (!printQueue.length) return;
    setIsPrinting(true);
    const tid = setTimeout(() => window.print(), 120);
    const after = () => { setPrintQueue([]); setIsPrinting(false); };
    window.addEventListener("afterprint", after, { once: true });
    return () => { clearTimeout(tid); window.removeEventListener("afterprint", after); };
  }, [printQueue]);

  const printByPeriod = () => { if (selectedPeriod) setPrintQueue([{ student: BLANK_STUDENT, period: selectedPeriod }]); };
  const printForStudent = () => { if (selectedStudent && selectedPeriod) setPrintQueue([{ student: selectedStudent, period: selectedPeriod }]); };
  const printAll = () => {
    const items: PrintItem[] = [];
    for (let pi = lo; pi <= hi; pi++) { const p = PAY_PERIODS[pi]; if (p) effectiveStudents.forEach((s) => items.push({ student: s, period: p })); }
    if (items.length) setPrintQueue(items);
  };
  const handleZip = async () => {
    const periods = PAY_PERIODS.slice(lo, hi + 1);
    setZipProgress({ done: 0, total: effectiveStudents.length * periods.length });
    try { await downloadTimesheetsZip(effectiveStudents, periods, (d, t) => setZipProgress({ done: d, total: t })); }
    finally { setZipProgress(null); }
  };

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const { students: parsed, errors } = parseStudentCSV(e.target?.result as string);
      if (!parsed.length) { setCsvErrors(errors); return; }
      saveStudents(parsed); setStudents(parsed); setCsvErrors(errors.length ? errors : []); setCsvOk(true);
    };
    reader.readAsText(file);
  }, []);

  const selCls = { width: "100%", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, background: CARD2, outline: "none", color: "#fff" } as React.CSSProperties;
  const lblCls = { fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: MUTED, marginBottom: 6, display: "block" as const };

  return (
    <>
      <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#050505" }}>

        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Timesheets</h1>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>WAVE Program · WIOA Out Of School · FY 2027</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
          {[
            { label: "Total Students", value: studentCount || "Demo" },
            { label: "Pay Period", value: currentPP ? `PP ${currentPP.id}` : "—" },
            { label: "Program", value: "WIOA" },
            { label: "Pay Periods", value: "26" },
          ].map((s) => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px" }}>
              <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Timesheet Generator</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
              <button onClick={() => fileRef.current?.click()}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", fontSize: 12, fontWeight: 600, color: MUTED, cursor: "pointer" }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                Upload CSV
              </button>
              {csvOk && (
                <button onClick={() => { clearStudents(); setStudents([]); setCsvOk(false); }} style={{ padding: "7px 12px", borderRadius: 7, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear Students</button>
              )}
            </div>
          </div>

          {csvErrors.slice(0, 2).map((e, i) => <p key={i} style={{ fontSize: 12, color: "#f59e0b", marginBottom: 4 }}>{e}</p>)}
          {isTestMode && (
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#f59e0b", marginBottom: 16 }}>
              Demo mode — using Isaac Nova. Upload a CSV or add students in the old Student Records tab.
            </div>
          )}

          {/* Mode tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {([["byPeriod", "By Pay Period"], ["forStudent", "For Student"], ["all", "Generate All"]] as [Mode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                style={{ padding: "7px 14px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, border: "none", cursor: "pointer", background: mode === m ? RED : CARD2, color: mode === m ? "#fff" : MUTED, transition: "all 0.15s" }}>
                {label}
              </button>
            ))}
          </div>

          {mode === "byPeriod" && (
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ width: 240, flexShrink: 0 }}>
                <label style={lblCls}>Pay Period</label>
                <select value={periodIdx} onChange={(e) => setPeriodIdx(+e.target.value)} style={selCls}>
                  {PAY_PERIODS.map((pp, i) => <option key={i} value={i} style={{ background: "#1a1a1a" }}>{pp.label}</option>)}
                </select>
                <button onClick={printByPeriod} disabled={isPrinting}
                  style={{ marginTop: 12, width: "100%", padding: "10px 0", borderRadius: 8, background: isPrinting ? "#333" : RED, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: isPrinting ? "not-allowed" : "pointer" }}>
                  Print Blank Timesheet
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <label style={lblCls}>Preview</label>
                <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${BORDER}`, background: "#1a1a1a" }}>
                  <div style={{ zoom: "0.62" }}>{selectedPeriod && <Timesheet student={BLANK_STUDENT} period={selectedPeriod} />}</div>
                </div>
              </div>
            </div>
          )}

          {mode === "forStudent" && (
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ width: 240, flexShrink: 0 }}>
                <label style={lblCls}>Student</label>
                <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)} style={{ ...selCls, marginBottom: 12 }}>
                  {effectiveStudents.map((s) => <option key={s.name} value={s.name} style={{ background: "#1a1a1a" }}>{s.name}</option>)}
                </select>
                <label style={lblCls}>Pay Period</label>
                <select value={periodIdx} onChange={(e) => setPeriodIdx(+e.target.value)} style={selCls}>
                  {PAY_PERIODS.map((pp, i) => <option key={i} value={i} style={{ background: "#1a1a1a" }}>{pp.label}</option>)}
                </select>
                <button onClick={printForStudent} disabled={isPrinting}
                  style={{ marginTop: 12, width: "100%", padding: "10px 0", borderRadius: 8, background: isPrinting ? "#333" : RED, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: isPrinting ? "not-allowed" : "pointer" }}>
                  Print Timesheet
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <label style={lblCls}>Preview</label>
                <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${BORDER}`, background: "#1a1a1a" }}>
                  <div style={{ zoom: "0.62" }}>{selectedPeriod && selectedStudent && <Timesheet student={selectedStudent} period={selectedPeriod} />}</div>
                </div>
              </div>
            </div>
          )}

          {mode === "all" && (
            <div style={{ maxWidth: 480 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={lblCls}>From</label>
                  <select value={fromIdx} onChange={(e) => setFromIdx(+e.target.value)} style={selCls}>
                    {PAY_PERIODS.map((pp, i) => <option key={i} value={i} style={{ background: "#1a1a1a" }}>PP{pp.id}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lblCls}>To</label>
                  <select value={toIdx} onChange={(e) => setToIdx(+e.target.value)} style={selCls}>
                    {PAY_PERIODS.map((pp, i) => <option key={i} value={i} style={{ background: "#1a1a1a" }}>PP{pp.id}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: MUTED }}>
                <strong style={{ color: "#fff" }}>{effectiveStudents.length}</strong> students × <strong style={{ color: "#fff" }}>{hi - lo + 1}</strong> periods = <strong style={{ color: RED }}>{allCount} timesheets</strong>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={printAll} disabled={isPrinting}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: isPrinting ? "#333" : RED, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: isPrinting ? "not-allowed" : "pointer" }}>
                  Print All
                </button>
                <button onClick={handleZip} disabled={!!zipProgress}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: CARD2, color: MUTED, fontWeight: 700, fontSize: 13, border: `1px solid ${BORDER}`, cursor: zipProgress ? "not-allowed" : "pointer" }}>
                  {zipProgress ? `${zipProgress.done}/${zipProgress.total}…` : `ZIP (${allCount})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {isPrinting && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 32, height: 32, border: `3px solid rgba(255,255,255,0.2)`, borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff" }}>Preparing print…</p>
            </div>
          </div>
        )}
      </main>

      {/* Print portal */}
      <div className="print-portal">
        {printQueue.map((item, i) => (
          <div key={i} className={i < printQueue.length - 1 ? "ts-print-break" : ""}>
            <Timesheet student={item.student} period={item.period} />
          </div>
        ))}
      </div>
    </>
  );
}
