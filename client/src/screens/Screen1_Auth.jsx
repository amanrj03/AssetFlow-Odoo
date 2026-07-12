import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  KeyRound,
  Mail,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Zap,
  Building2,
  Check,
} from "lucide-react";

export const Screen1_Auth = ({ onLaunchERP, setShowLanding }) => {
  const { login, signup, switchRole, continueAsGuest, demoUsersList } = useAuth();
  const [isLogin, setIsLogin] = useState(() => (window.location.pathname || "/login").toLowerCase() !== "/signup");
  const [email, setEmail] = useState("admin@assetflow.enterprise");
  const [password, setPassword] = useState("12345678");
  const [name, setName] = useState("Aman Verma");

  useEffect(() => {
    const current = (window.location.pathname || "").toLowerCase();
    const target = isLogin ? "/login" : "/signup";
    if (current !== target) {
      window.history.pushState(null, "", target);
    }
  }, [isLogin]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (isLogin) {
      if (!email || !password) {
        setError("Please enter both email address and password.");
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setError("Invalid credentials. Please try selecting one of the demo role cards below.");
      } else {
        setSuccessMsg("Authentication successful! Launching your enterprise workspace...");
        setTimeout(() => {
          if (onLaunchERP) onLaunchERP("dashboard");
          else if (setShowLanding) setShowLanding(false);
        }, 600);
      }
    } else {
      if (!name || !email || !password) {
        setError("All fields are required to create an employee account.");
        return;
      }
      // "Signup always creates: EMPLOYEE. Only Admin promotes users. Never trust frontend role."
      const res = await signup(name, email, password);
      if (res.success) {
        setSuccessMsg("Account created successfully with role: EMPLOYEE. Launching directory...");
        setTimeout(() => {
          if (onLaunchERP) onLaunchERP("dashboard");
          else if (setShowLanding) setShowLanding(false);
        }, 800);
      } else {
        setError("Failed to create account. Email may already exist in database.");
      }
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg(`Password recovery token sent to ${forgotEmail || "your email"} (Simulated POST /api/auth/forgot-password).`);
    setShowForgotModal(false);
  };

  return (
    <div className="insighthub-grid-bg" style={{ minHeight: "100vh", width: "100%", color: "var(--text-main)", position: "relative", overflowX: "hidden", fontFamily: "'Inter', sans-serif" }}>
      {/* Aceternity Spotlight Glow */}
      <div className="aceternity-spotlight" />

      {/* Top Header (`← Back to Landing / Home + Brand Emblem`) */}
      <header
        style={{
          padding: "24px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 50,
          maxWidth: "1540px",
          margin: "0 auto",
        }}
      >
        <div
          onClick={() => {
            if (onLaunchERP) onLaunchERP("home");
            else if (setShowLanding) setShowLanding(true);
          }}
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.92rem", color: "var(--text-secondary)", transition: "color 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--coral)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          <ArrowLeft size={18} />
          <span>← Back to Landing Page</span>
        </div>

        <div
          onClick={() => {
            if (onLaunchERP) onLaunchERP("home");
            else if (setShowLanding) setShowLanding(true);
          }}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#1E1513", color: "white", display: "flex", alignItems: "center", justify: "center", fontWeight: 800, fontSize: "1.05rem", boxShadow: "0 4px 14px rgba(30, 21, 19, 0.25)" }}>
            №
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.03em", color: "var(--text-main)" }}>
            AssetFlow
          </span>
          <span className="badge badge-coral" style={{ fontSize: "0.68rem" }}>Screen 1 Auth</span>
        </div>
      </header>

      {/* Main Authentication Grid (`InsightHub / Aceternity Product Aesthetic`) */}
      <div style={{ maxWidth: "1280px", margin: "32px auto 80px auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "48px", alignItems: "center", position: "relative", zIndex: 10 }}>
        {/* Left Column: Brand Specifications & Quick Role Tester */}
        <div style={{ paddingRight: "16px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "99px", background: "rgba(224, 82, 48, 0.12)", border: "1px solid rgba(224, 82, 48, 0.35)", color: "var(--coral)", fontSize: "0.82rem", fontWeight: 700, marginBottom: "22px" }}>
            <Sparkles size={16} />
            <span>SCREEN 1 • AUTHENTICATION & ROLE ARCHITECTURE</span>
          </div>

          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "3.4rem",
              fontWeight: 800,
              color: "#1E1513",
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              marginBottom: "20px",
            }}
          >
            {isLogin ? "Sign In to Your Enterprise" : "Create Employee Account"} <span style={{ color: "var(--coral)" }}>Workspace</span>
          </h1>

          <p style={{ color: "var(--text-secondary)", fontSize: "1.14rem", lineHeight: 1.6, marginBottom: "36px", maxWidth: "560px" }}>
            Enforcing 4-tier Role-Based Access Control (RBAC) across `Employee → Dept Head → Asset Manager → Admin`. Every action is backed by 100% ACID PostgreSQL session locks.
          </p>

          {/* Hackathon Quick-Access Role Matrix */}
          <div style={{ background: "white", border: "1px solid var(--border-color)", borderRadius: "24px", padding: "24px", boxShadow: "0 14px 36px rgba(15, 23, 42, 0.05)", marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                ⚡ HACKATHON QUICK-ACCESS ROLE TESTER
              </span>
              <span className="badge badge-coral" style={{ fontSize: "0.72rem" }}>1-Click Credentials</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {Object.keys(demoUsersList).map((roleKey) => {
                const u = demoUsersList[roleKey];
                const isSelected = email === u.email;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => {
                      setEmail(u.email);
                      setPassword("12345678");
                      setIsLogin(true);
                      setError("");
                    }}
                    style={{
                      padding: "14px",
                      borderRadius: "16px",
                      background: isSelected ? "#FFF5F1" : "#F8FAFC",
                      border: isSelected ? "2px solid var(--coral)" : "1px solid var(--border-color)",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = "var(--coral)";
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = "var(--border-color)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-main)" }}>{u.name}</span>
                      {isSelected && <CheckCircle2 size={16} style={{ color: "var(--coral)" }} />}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--coral)" }}>{roleKey}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{u.email.split("@")[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", padding: "10px 14px", background: "#F8FAFC", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <Shield size={16} style={{ color: "var(--success)", flexShrink: 0 }} />
              <span>
                <strong>Security Policy:</strong> New signups default strictly to <strong>EMPLOYEE</strong>. Only an authenticated <strong>ADMIN</strong> can execute `PATCH /promote`.
              </span>
            </div>
          </div>

          {/* Specification Checkpoints Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Check size={15} style={{ color: "var(--success)" }} /> Node.js & Express API</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Check size={15} style={{ color: "var(--success)" }} /> Bcrypt Hashing (`10 rounds`)</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Check size={15} style={{ color: "var(--success)" }} /> 256-bit JWT Session Cookies</span>
          </div>
        </div>

        {/* Right Column: Aceternity Hover Glass Auth Card */}
        <div className="aceternity-hover-card" style={{ padding: "40px", background: "white", boxShadow: "0 32px 80px -16px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(224, 82, 48, 0.15)" }}>
          {/* Guest / Demo Workspace Shortcut Banner */}
          <div style={{ background: "linear-gradient(135deg, #FFF5F1 0%, #FFEDE8 100%)", border: "1.5px solid var(--coral)", borderRadius: "18px", padding: "16px 20px", marginBottom: "26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", boxShadow: "0 8px 24px rgba(224, 82, 48, 0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--coral)", color: "white", display: "flex", alignItems: "center", justify: "center", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>
                🚀
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.94rem", color: "#1E1513" }}>Evaluating as Guest / Demo?</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Skip credentials and explore full 11-module ERP as Guest Admin.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (continueAsGuest) continueAsGuest();
                else login("admin@assetflow.enterprise", "12345678");
                setTimeout(() => {
                  if (onLaunchERP) onLaunchERP("dashboard");
                  else if (setShowLanding) setShowLanding(false);
                }, 200);
              }}
              style={{
                padding: "10px 20px",
                borderRadius: "99px",
                background: "var(--coral)",
                color: "white",
                fontWeight: 800,
                fontSize: "0.82rem",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 14px rgba(224, 82, 48, 0.35)",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Continue as Guest →
            </button>
          </div>

          {/* Shadcn UI Pill Tabs Bar */}
          <div className="shadcn-tabs-bar" style={{ width: "100%", justifyContent: "center", marginBottom: "28px" }}>
            <button
              type="button"
              className={`shadcn-tab-trigger ${isLogin ? "active" : ""}`}
              onClick={() => { setIsLogin(true); setError(""); setSuccessMsg(""); }}
              style={{ flex: 1, justifyContent: "center", padding: "11px 20px" }}
            >
              <KeyRound size={16} />
              <span>Sign In to Workspace</span>
            </button>
            <button
              type="button"
              className={`shadcn-tab-trigger ${!isLogin ? "active" : ""}`}
              onClick={() => { setIsLogin(false); setError(""); setSuccessMsg(""); }}
              style={{ flex: 1, justifyContent: "center", padding: "11px 20px" }}
            >
              <User size={16} />
              <span>Create Account</span>
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-main)" }}>
              {isLogin ? "Enter Workspace Credentials" : "New Employee Registration"}
            </div>
            <span className="badge badge-neutral" style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>
              POST /api/auth/{isLogin ? "login" : "signup"}
            </span>
          </div>

          {error && (
            <div style={{ padding: "14px", borderRadius: "14px", background: "#FFF5F1", border: "1px solid var(--coral)", color: "var(--coral)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", animation: "scaleUp 0.2s" }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ padding: "14px", borderRadius: "14px", background: "#ECFDF5", border: "1px solid #10B981", color: "#065F46", fontSize: "0.88rem", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", animation: "scaleUp 0.2s" }}>
              <CheckCircle2 size={18} style={{ color: "#10B981", flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {!isLogin && (
              <div>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "0.86rem", color: "var(--text-main)", marginBottom: "8px" }}>
                  <User size={16} style={{ color: "var(--coral)" }} /> Full Employee Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Aman Verma (Engineering)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "13px 16px", borderRadius: "14px", border: "1px solid var(--border-color)", fontSize: "0.95rem", background: "#F8FAFC" }}
                />
              </div>
            )}

            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "0.86rem", color: "var(--text-main)", marginBottom: "8px" }}>
                <Mail size={16} style={{ color: "var(--coral)" }} /> Enterprise Email Address
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. admin@assetflow.enterprise"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "14px", border: "1px solid var(--border-color)", fontSize: "0.95rem", background: "#F8FAFC" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "0.86rem", color: "var(--text-main)" }}>
                  <Lock size={16} style={{ color: "var(--coral)" }} /> Account Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    style={{ background: "none", border: "none", color: "var(--coral)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="•••••••• (Min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "13px 44px 13px 16px", borderRadius: "14px", border: "1px solid var(--border-color)", fontSize: "0.95rem", background: "#F8FAFC" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "var(--coral)", cursor: "pointer" }}
                />
                <span>Remember my session for 30 days</span>
              </label>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Strict SSL • SOC 2</span>
            </div>

            {!isLogin && (
              <div style={{ padding: "12px 16px", background: "#FFF5F1", border: "1px solid var(--coral)", borderRadius: "14px", fontSize: "0.82rem", color: "var(--text-main)", lineHeight: 1.5 }}>
                ⚡ <strong>Specification Notice:</strong> New accounts are hashed using `bcrypt` and automatically assigned role = `EMPLOYEE`.
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "99px",
                background: "#1E1513",
                color: "white",
                fontWeight: 800,
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 28px rgba(30, 21, 19, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                marginTop: "6px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "var(--coral)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 14px 36px rgba(224, 82, 48, 0.45)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#1E1513";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(30, 21, 19, 0.3)";
              }}
            >
              <span>{isLogin ? "Sign In to Enterprise Workspace" : "Create Employee Account"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Launch Shortcut */}
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
            <button
              type="button"
              onClick={() => {
                if (continueAsGuest) continueAsGuest();
                else login("admin@assetflow.enterprise", "12345678");
                setTimeout(() => {
                  if (onLaunchERP) onLaunchERP("dashboard");
                  else if (setShowLanding) setShowLanding(false);
                }, 200);
              }}
              style={{ background: "transparent", border: "1px dashed rgba(224, 82, 48, 0.5)", borderRadius: "12px", padding: "10px 16px", width: "100%", color: "var(--coral)", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#FFF5F1")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              ⚡ Or Launch Demo Workspace as Guest Admin directly →
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (`POST /api/auth/forgot-password`) */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "480px", borderRadius: "24px", padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(224, 82, 48, 0.1)", display: "flex", alignItems: "center", justify: "center", color: "var(--coral)" }}>
                <KeyRound size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>Reset Password</h3>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Simulating POST /api/auth/forgot-password</div>
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "22px" }}>
              Enter your registered enterprise email below. We will generate a secure one-time recovery token sent directly to your inbox.
            </p>

            <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. admin@assetflow.enterprise"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "13px 16px", borderRadius: "14px", border: "1px solid var(--border-color)", fontSize: "0.95rem", background: "#F8FAFC" }}
              />
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForgotModal(false)} style={{ padding: "12px 24px", borderRadius: "99px", fontWeight: 700 }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "12px 28px", borderRadius: "99px", background: "var(--coral)", color: "white", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(224, 82, 48, 0.3)" }}>
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
