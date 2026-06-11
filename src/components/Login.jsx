function Login({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2942 0%, #176b87 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Tahoma, Arial" }}>
      
      <div style={{ width: "100%", maxWidth: "420px", padding: "16px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "60px", marginBottom: "12px" }}>💊</div>
          <h1 style={{ color: "white", margin: "0 0 8px", fontSize: "28px" }}>GazaPharma Link</h1>
          <p style={{ color: "#a0c4d8", margin: 0 }}>Medicine availability search platform</p>
        </div>

        <div style={{ background: "white", borderRadius: "24px", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          
          <h2 style={{ color: "#0f2942", margin: "0 0 1.5rem", fontSize: "22px", textAlign: "center" }}>تسجيل الدخول</h2>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", color: "#344054", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="example@email.com"
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid #d0d5dd", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "#344054", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>كلمة المرور</label>
            <input
              type="password"
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid #d0d5dd", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <button
            onClick={onLogin}
            style={{ width: "100%", padding: "13px", background: "#176b87", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", fontFamily: "Tahoma, Arial" }}
          >
            دخول
          </button>

          <p style={{ textAlign: "center", marginTop: "1rem", color: "#667085", fontSize: "14px" }}>
            ما عندك حساب؟{" "}
            <span style={{ color: "#176b87", fontWeight: "bold", cursor: "pointer" }}>إنشاء حساب</span>
          </p>

        </div>

        <p style={{ textAlign: "center", color: "#a0c4d8", fontSize: "12px", marginTop: "1.5rem" }}>
          © 2026 GazaPharma Link
        </p>

      </div>
    </div>
  )
}

export default Login