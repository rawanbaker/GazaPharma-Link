import { useState } from "react"
import SearchResultsPage from "./SearchResultsPage"
import PharmacistDashboard from "./components/PharmacistDashboard"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [role, setRole] = useState("patient")
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const PHARMA_SECRET = "pharma123"

  const handleLogin = () => {
    setError("")
    if (role === "pharmacist") {
      if (password === PHARMA_SECRET) {
        setIsLoggedIn(true)
      } else {
        setError("Wrong pharmacist password!")
      }
    } else {
      if (email === "" || password === "") {
        setError("Please fill all fields!")
      } else {
        setIsLoggedIn(true)
      }
    }
  }

 if (isLoggedIn && role === "pharmacist") return <PharmacistDashboard onLogout={() => setIsLoggedIn(false)} />
if (isLoggedIn) return <SearchResultsPage />
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2942 0%, #176b87 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Tahoma, Arial", padding: "16px" }}>

      <div style={{ display: "flex", borderRadius: "24px", overflow: "hidden", width: "100%", maxWidth: "900px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>

        <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", borderRadius: "20px", margin: "10px", gap: "16px" }}>
          <div style={{ width: "80px", height: "80px", background: "rgba(255,255,255,0.15)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="https://pbs.twimg.com/media/E9TQShzXEAU_eMR.jpg" alt="logo" style={{ width: "55px", height: "55px", filter: "invert(1)", borderRadius: "8px" }} />
          </div>
          <h2 style={{ color: "white", margin: 0, fontSize: "32px", letterSpacing: "6px", fontWeight: "900", textShadow: "0 0 30px rgba(255,255,255,0.3)" }}>GAZAPHARMA</h2>
          <p style={{ color: "#a0c4d8", margin: 0, textAlign: "center", fontSize: "14px" }}>Medicine availability search platform</p>
        </div>

        <div style={{ flex: 1.2, background: "white", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ color: "#0f2942", margin: "0 0 6px", fontSize: "32px", fontWeight: "900" }}>Welcome to GazaPharma 👋</h1>
          <p style={{ color: "#8b949e", margin: "0 0 1.5rem", fontSize: "14px" }}>Sign in to access the medicine platform</p>

          <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem" }}>
            <button onClick={() => { setRole("patient"); setError("") }} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "2px solid", borderColor: role === "patient" ? "#176b87" : "#d0d7de", background: role === "patient" ? "#e8f4f8" : "white", color: role === "patient" ? "#176b87" : "#888", fontWeight: "bold", cursor: "pointer", fontFamily: "Tahoma, Arial", fontSize: "14px" }}>
              🧑‍⚕️ Patient
            </button>
            <button onClick={() => { setRole("pharmacist"); setError("") }} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "2px solid", borderColor: role === "pharmacist" ? "#176b87" : "#d0d7de", background: role === "pharmacist" ? "#e8f4f8" : "white", color: role === "pharmacist" ? "#176b87" : "#888", fontWeight: "bold", cursor: "pointer", fontFamily: "Tahoma, Arial", fontSize: "14px" }}>
              💊 Pharmacist
            </button>
          </div>

          {role === "patient" && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f6f8fa", border: "1px solid #d0d7de", borderRadius: "12px", padding: "12px 14px" }}>
                <span style={{ color: "#8b949e" }}>✉️</span>
                <input type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ border: "none", background: "transparent", outline: "none", fontSize: "15px", width: "100%", fontFamily: "Tahoma, Arial" }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f6f8fa", border: "1px solid #d0d7de", borderRadius: "12px", padding: "12px 14px" }}>
              <span style={{ color: "#8b949e" }}>🔒</span>
              <input type="password" placeholder={role === "pharmacist" ? "Pharmacist secret key..." : "••••••••"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} style={{ border: "none", background: "transparent", outline: "none", fontSize: "15px", width: "100%", fontFamily: "Tahoma, Arial" }} />
            </div>
          </div>

          {error && <p style={{ color: "#e53e3e", fontSize: "13px", margin: "0 0 1rem", textAlign: "center" }}>⚠️ {error}</p>}

          {role === "patient" && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
              <input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
              <label htmlFor="remember" style={{ color: "#444", fontSize: "14px", cursor: "pointer" }}>Remember me</label>
            </div>
          )}

          <button onClick={handleLogin} style={{ width: "100%", padding: "14px", background: "#176b87", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", fontFamily: "Tahoma, Arial" }}>
            Sign in as {role === "patient" ? "Patient" : "Pharmacist"} →
          </button>

          <p style={{ textAlign: "center", marginTop: "1rem", color: "#8b949e", fontSize: "13px" }}>
            Don't have an account?{" "}
            <span style={{ color: "#176b87", fontWeight: "bold", cursor: "pointer" }}>Create account</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App