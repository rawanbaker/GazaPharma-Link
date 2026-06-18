import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [role, setRole] = useState("patient");
  const [displayName, setDisplayName] = useState("مستخدم غزة فارما");
  const [email, setEmail] = useState("user@gazapharma.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setDisplayName(nextRole === "pharmacist" ? "كامل أبو سلمى" : "مستخدم غزة فارما");
    setEmail(nextRole === "pharmacist" ? "pharmacist@gazapharma.com" : "user@gazapharma.com");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!displayName.trim()) {
      setError("يرجى إدخال اسم المستخدم");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setError("");
    onLogin({
      role,
      displayName: displayName.trim(),
    });
  };

  return (
    <main className="login-page" dir="rtl">
      <div className="login-wrapper">
        <div className="login-brand">
          <div className="login-emoji">💊</div>
          <h1>GazaPharma Link</h1>
          <p>Medicine availability search platform</p>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <h2>تسجيل الدخول</h2>

          <div className="role-switch">
            <button
              type="button"
              className={role === "patient" ? "active" : ""}
              onClick={() => handleRoleChange("patient")}
            >
              باحث عن دواء
            </button>

            <button
              type="button"
              className={role === "pharmacist" ? "active" : ""}
              onClick={() => handleRoleChange("pharmacist")}
            >
              صيدلي
            </button>
          </div>

          <div className="input-group">
            <label>اسم المستخدم</label>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="اكتب اسم المستخدم"
            />
          </div>

          <div className="input-group">
            <label>البريد الإلكتروني</label>
            <input
              dir="ltr"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="input-group">
            <label>كلمة المرور</label>
            <input
              dir="ltr"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-submit" type="submit">
            دخول
          </button>

          <p className="create-account">
            ما عندك حساب؟{" "}
            <span>إنشاء حساب</span>
          </p>
        </form>

        <p className="login-footer">
          © 2026 GazaPharma Link
        </p>
      </div>
    </main>
  );
}

export default Login;
