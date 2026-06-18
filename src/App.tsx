import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import KioskPage from "./pages/KioskPage";
import { seedDemoData } from "./lib/trioData";

const PASS = (import.meta.env.VITE_SUPERVISOR_PASSWORD as string) || "TRIO2026";
const SESSION_KEY = "trio-auth-v1";

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "advisor");

  useEffect(() => { seedDemoData(); }, []);

  const login = () => { sessionStorage.setItem(SESSION_KEY, "advisor"); setAuthed(true); };
  const logout = () => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); };

  return (
    <Routes>
      <Route
        path="/login"
        element={authed ? <Navigate to="/dashboard" replace /> : <LoginPage supervisorPassword={PASS} onLogin={login} />}
      />
      <Route path="/kiosk" element={<KioskPage />} />
      <Route
        path="/dashboard/*"
        element={authed ? <Dashboard onLogout={logout} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={authed ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}
