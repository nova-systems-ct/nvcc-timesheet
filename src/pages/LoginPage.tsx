import { useState } from "react";

const RED = "#D61F26";
const GOLD = "#D4AF37";

interface Props {
  supervisorPassword: string;
  onLogin: () => void;
}

export default function LoginPage({ supervisorPassword, onLogin }: Props) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === supervisorPassword) {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 400));
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
      {/* Glow */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(214,31,38,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
        {/* Brand header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.1 }}>TRIO Connect</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Student Success Platform</p>
            </div>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, border: `1px solid rgba(212,175,55,0.3)`, background: "rgba(212,175,55,0.08)" }}>
            <svg width="10" height="10" fill={GOLD} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Powered by Nova Systems</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
          {/* Card header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Sign in to continue</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>CT State · TRIO Program · Advisors & Directors</p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                Access Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="••••••••••"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#0D0D0D", border: `1px solid ${error ? RED : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 10, padding: "12px 44px 12px 14px",
                    fontSize: 14, color: "#fff", outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                  onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 4 }}>
                  {showPw ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(214,31,38,0.08)", border: "1px solid rgba(214,31,38,0.25)", borderRadius: 8, padding: "10px 14px" }}>
                <svg width="14" height="14" style={{ color: RED, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p style={{ fontSize: 12, color: "#FF6B6B", fontWeight: 500 }}>Incorrect password. Please try again.</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "rgba(214,31,38,0.5)" : RED,
                color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "0.02em",
                transition: "background 0.15s, transform 0.1s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#B7181E"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = RED; }}>
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Signing in…
                </>
              ) : "Sign In →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          TRIO Connect © 2026 · Nova Systems · Confidential
        </p>
      </div>
    </div>
  );
}
