import React from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  ArrowRight,
  Calendar,
  Mic,
  Lock,
  Clock,
  Edit2,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Sun,
  Plus,
  Repeat,
  ShieldCheck,
} from "lucide-react";

export const Screen2_Dashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { assets } = useERP();

  return (
    <div className="page-body">
      {/* Hero Greeting Row (`generous breathing space`) */}
      <div className="hero-greeting-row" style={{ marginBottom: "28px" }}>
        <div className="hero-calendar-badge-group">
          <div className="calendar-big-circle">19</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)", lineHeight: 1.1 }}>Tue,</span>
            <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)", fontWeight: 600 }}>December</span>
          </div>

          <div className="vertical-divider" style={{ margin: "0 8px" }} />

          <button
            onClick={() => setActiveTab("booking")}
            className="btn btn-coral btn-sm"
            style={{ padding: "8px 16px" }}
          >
            <span>Show my Tasks</span>
            <ArrowRight size={14} />
          </button>

          <button onClick={() => setActiveTab("booking")} className="circle-icon-btn" style={{ position: "relative" }} title="Schedule">
            <Calendar size={16} />
            <span style={{ position: "absolute", top: "8px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "var(--coral)" }} />
          </button>
        </div>

        {/* Center Greeting & Ghost Prompt */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, margin: "0 32px", minWidth: "260px" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1.2 }}>
            Hey, Need help? 👋
          </h1>
          <div style={{ fontSize: "1.25rem", fontWeight: 400, color: "#94A3B8", display: "flex", alignItems: "center", marginTop: "4px" }}>
            <span style={{ color: "var(--coral)", fontWeight: 600, marginRight: "8px" }}>|</span> Just ask me anything!
          </div>
        </div>

        {/* Right Voice Circle Icon (`🎙️`) */}
        <button className="circle-icon-btn" style={{ width: "46px", height: "46px" }} title="Voice Assistant">
          <Mic size={20} style={{ color: "var(--text-main)" }} />
        </button>
      </div>

      {/* BENTO GRID ROW 1: 3 Spacious Executive Cards (`span 4 + span 4 + span 4 = 12`) */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        {/* Card 1: VISA Linked to main account **** 2719 (Span 4) */}
        <div className="bento-card" style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "290px", padding: "26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.06em" }}>VISA</span>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "6px" }}>Linked to main account</div>
              <div style={{ fontFamily: "Fira Code", fontWeight: 800, fontSize: "1.45rem", color: "var(--text-main)", marginTop: "4px" }}>**** 2719</div>
            </div>
            <span className="badge badge-neutral" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>Direct Debits ⌄</span>
          </div>

          <div style={{ display: "flex", gap: "12px", margin: "20px 0" }}>
            <button className="btn btn-dark" style={{ flex: 1, padding: "10px" }}>Receive</button>
            <button className="btn btn-secondary" style={{ flex: 1, padding: "10px", background: "var(--bg-app)" }}>Send</button>
          </div>

          <div style={{ borderTop: "1px dashed var(--border-color)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Monthly regular fee</div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--coral)" }}>$ 25.00</div>
            </div>
            <button style={{ background: "transparent", border: "none", color: "var(--coral)", fontWeight: 700, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <Edit2 size={14} /> Edit cards limitation
            </button>
          </div>
        </div>

        {/* Card 2: Total income / Total maintenance paid (Span 4) */}
        <div className="bento-card" style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "290px", padding: "26px" }}>
          {/* Top Half (`Total income $23,194.80`) */}
          <div style={{ paddingBottom: "18px", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div className="circle-icon-btn" style={{ width: "32px", height: "32px" }}><Clock size={15} /></div>
              <span className="badge badge-neutral" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>Weekly ⌄</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Total income & valuation</div>
            <div style={{ fontWeight: 800, fontSize: "1.45rem", color: "var(--text-main)", marginTop: "2px" }}>$ 23,194.80</div>
          </div>

          {/* Bottom Half (`Total maintenance paid $8,145.20`) */}
          <div style={{ paddingTop: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div className="circle-icon-btn" style={{ width: "32px", height: "32px" }}><Clock size={15} /></div>
              <span className="badge badge-neutral" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>Weekly ⌄</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Total maintenance paid</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
              <span style={{ fontWeight: 800, fontSize: "1.45rem", color: "var(--coral)" }}>$ 8,145.20</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--coral)", display: "flex", alignItems: "center", gap: "6px" }}>
                <TrendingUp size={14} /> View chart
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: System Lock 36% Growth Ring + 13 Days Audit Target (Span 4) */}
        <div className="bento-card" style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "290px", padding: "26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="circle-icon-btn" style={{ width: "34px", height: "34px", marginBottom: "10px" }}><Clock size={16} /></div>
              <div style={{ fontWeight: 800, fontSize: "1.35rem" }}>13 Days</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>109 hours, 23 minutes</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="badge badge-coral" style={{ padding: "6px 12px", marginBottom: "6px" }}>2026 Target</span>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Audit Cycle</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justify: "space-between", gap: "20px", marginTop: "16px", background: "var(--bg-dark-card)", padding: "16px 20px", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "white", fontWeight: 700, fontSize: "0.85rem" }}>
                <Lock size={15} style={{ color: "var(--coral)" }} />
                <span>System Lock Guard</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "4px", maxWidth: "160px" }}>
                Active growth valuation rate tracking across all assets.
              </div>
            </div>

            <div style={{ position: "relative", width: "80px", height: "80px", display: "flex", alignItems: "center", justify: "center", flexShrink: 0 }}>
              <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#E05230" strokeWidth="10" strokeDasharray="263.8" strokeDashoffset="168" strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "white", lineHeight: 1 }}>36%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BENTO GRID ROW 2: Spacious Financial Overview (`span 5`) & Decluttered Activity Manager (`span 7`) */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        {/* Left Card: Annual Profits & Main Stocks Overview (Span 5) */}
        <div className="bento-card" style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "28px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Annual profits & Valuation</h3>
              <span className="badge badge-neutral" style={{ padding: "6px 12px" }}>2026 ⌄</span>
            </div>

            {/* Exact Compact Concentric Circles stack ($14K, $9.3K, $6.8K, $4K) */}
            <div className="concentric-circles-stack" style={{ margin: "24px auto" }}>
              <div className="conc-circle-4">
                <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#C94220" }}>$ 14K</span>
              </div>
              <div className="conc-circle-3">
                <span style={{ fontWeight: 700, fontSize: "0.78rem", color: "#C94220" }}>$ 9.3K</span>
              </div>
              <div className="conc-circle-2">
                <span style={{ fontWeight: 700, fontSize: "0.75rem", color: "white" }}>$ 6.8K</span>
              </div>
              <div className="conc-circle-1">
                <span style={{ fontWeight: 800, fontSize: "0.72rem", color: "white" }}>$ 4K</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "20px", marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Main Stocks</span>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Extended & Limited Valuation</div>
              </div>
              <span className="badge badge-coral" style={{ fontWeight: 800, padding: "6px 12px" }}>+ 9.3% Growth</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: "1.45rem", color: "var(--coral)" }}>$ 16,073.49</span>
              <svg viewBox="0 0 160 36" style={{ width: "140px", height: "36px" }}>
                <path
                  d="M 0 28 Q 20 8, 40 22 T 80 10 T 120 28 T 160 8"
                  fill="none"
                  stroke="var(--coral)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Card: Decluttered Activity & Operations Manager Hub (Span 7) */}
        <div className="bento-card" style={{ gridColumn: "span 7", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "28px" }}>
          {/* Top Bar (`Search in activities... | Team • | Insights × | Today × | ⋮ | Filters`) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: "220px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Activity manager</h3>
              <div className="search-input-wrapper" style={{ flex: 1, maxWidth: "260px" }}>
                <Search className="search-icon" size={14} style={{ left: "12px" }} />
                <input type="text" className="form-input" placeholder="Search activities..." style={{ padding: "8px 14px 8px 34px", fontSize: "0.82rem" }} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="badge badge-neutral" style={{ padding: "6px 12px" }}>Team •</span>
              <span className="badge badge-neutral" style={{ padding: "6px 12px" }}>Insights ×</span>
              <span className="badge badge-neutral" style={{ padding: "6px 12px" }}>Today ×</span>
              <button className="circle-icon-btn" style={{ width: "34px", height: "34px" }}><MoreVertical size={15} /></button>
              <button className="btn btn-secondary btn-sm" style={{ padding: "7px 14px", background: "var(--bg-app)" }}><Filter size={13} /> Filters</button>
            </div>
          </div>

          {/* Decluttered, Spacious 2-Column Workflow Section (`span 6 + span 6`) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", flex: 1 }}>
            {/* Left Box: Business Plans & Workflow Operations */}
            <div style={{ background: "var(--bg-app)", borderRadius: "var(--radius-lg)", padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>Business plans</span>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Active departmental budgets</div>
                </div>
                <MoreVertical size={16} style={{ color: "var(--text-muted)" }} />
              </div>

              <div className="step-timeline" style={{ margin: "10px 0" }}>
                <div className="step-item" style={{ marginBottom: "14px" }}>
                  <div className="step-circle-icon active" style={{ width: "28px", height: "28px" }}>🏦</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Bank loans & asset acquisition ⌄</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Approved budget $43.20 USD limit</div>
                  </div>
                </div>
                <div className="step-item" style={{ marginBottom: "14px" }}>
                  <div className="step-circle-icon brown" style={{ width: "28px", height: "28px" }}>📊</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Accounting & depreciation</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Q4 audit cycle target</div>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-circle-icon brown" style={{ width: "28px", height: "28px" }}>👥</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>HR management & roles</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>4-tier progression matrix</div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed var(--border-color)", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Current Allocation Limit</span>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--coral)" }}>$ 43.20 USD</span>
              </div>
            </div>

            {/* Right Box: Wallet Security Verification & Review Rating (`How is your enterprise management going? • ⌒ ◠ — ◡ ∪`) */}
            <div style={{ background: "var(--bg-app)", borderRadius: "var(--radius-lg)", padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--bg-peach-light)", color: "var(--coral)", display: "flex", alignItems: "center", justify: "center" }}>
                    <Sun size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)" }}>Wallet Verification</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Enterprise security policy</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px" }}>
                  Enable 2-step verification (`PostgreSQL JWT session lock`) to secure all departmental asset approvals.
                </p>
                <button className="btn btn-coral" style={{ width: "100%", padding: "10px", fontSize: "0.88rem" }}>
                  Enable Security Guard
                </button>
              </div>

              {/* Review Rating (`⌒ ◠ — ◡ ∪`) */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Review rating</div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)", margin: "4px 0 12px 0" }}>
                  How is enterprise management going?
                </div>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  {["⌒", "◠", "—", "◡", "∪"].map((face, idx) => (
                    <button
                      key={idx}
                      className="circle-icon-btn"
                      style={{ width: "34px", height: "34px", background: idx === 3 ? "var(--coral)" : "var(--bg-surface)", color: idx === 3 ? "white" : "var(--text-main)", fontSize: "0.9rem" }}
                    >
                      {face}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BENTO GRID ROW 3: Hackathon Judge Quick Test Shortcuts Card (Span 12) */}
      <div className="bento-card coral-theme-card" style={{ marginTop: "28px", padding: "32px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px", borderRadius: "22px" }}>
        <div style={{ maxWidth: "780px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span className="badge" style={{ background: "rgba(255,255,255,0.22)", color: "white", border: "1px solid rgba(255,255,255,0.4)", padding: "6px 14px", fontSize: "0.75rem" }}>
              HACKATHON EVALUATION PANEL
            </span>
          </div>
          <h2 style={{ fontSize: "1.65rem", fontWeight: 800, color: "white", lineHeight: 1.25 }}>
            One ERP to Rule Your Assets, Bookings, and Audits.
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.92)", marginTop: "6px", lineHeight: 1.5 }}>
            Test exact requirements right now: selecting an allocated asset immediately triggers `{`{ message: "Already allocated" }`}` rejection and initiates formal transfer (`Employee → Dept Head → Asset Manager → Admin`).
          </p>
        </div>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <button onClick={() => setActiveTab("allocation")} className="btn btn-dark" style={{ padding: "12px 20px", fontSize: "0.88rem" }}>
            <Repeat size={16} /> Test Allocation Guard (`Already allocated`) →
          </button>
          <button onClick={() => setActiveTab("booking")} className="btn btn-secondary" style={{ padding: "12px 20px", fontSize: "0.88rem", background: "white", color: "var(--coral)", border: "none" }}>
            <Calendar size={16} /> Test SQL Overlap Check
          </button>
        </div>
      </div>
    </div>
  );
};
