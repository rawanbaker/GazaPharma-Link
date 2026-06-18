import { useState } from "react";
import Login from "./pages/Login.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import PharmacistDashboard from "./pages/PharmacistDashboard.jsx";

function App() {
  const [session, setSession] = useState(() => {
    const savedSession = localStorage.getItem("gazaPharmaSession");
    if (!savedSession) return null;

    try {
      const parsedSession = JSON.parse(savedSession);
      return {
        ...parsedSession,
        displayName:
          parsedSession.displayName ||
          (parsedSession.role === "pharmacist" ? "صيدلي غزة فارما" : "مستخدم غزة فارما"),
      };
    } catch {
      localStorage.removeItem("gazaPharmaSession");
      return null;
    }
  });

  const handleLogin = ({ role, displayName }) => {
    const cleanName = displayName?.trim();
    const newSession = {
      isLoggedIn: true,
      role,
      displayName: cleanName || (role === "pharmacist" ? "صيدلي غزة فارما" : "مستخدم غزة فارما"),
    };

    localStorage.setItem("gazaPharmaSession", JSON.stringify(newSession));
    setSession(newSession);
  };

  const handleLogout = () => {
    localStorage.removeItem("gazaPharmaSession");
    setSession(null);
  };

  if (!session?.isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (session.role === "pharmacist") {
    return <PharmacistDashboard onLogout={handleLogout} pharmacistName={session.displayName} />;
  }

  return <SearchResultsPage onLogout={handleLogout} userName={session.displayName} />;
}

export default App;
