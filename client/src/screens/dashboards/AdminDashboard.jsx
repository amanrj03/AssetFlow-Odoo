import React from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingUp,
  Box,
  Wrench,
  Repeat,
  BellRing
} from "lucide-react";

export const AdminDashboard = ({ dashboardData, setActiveTab }) => {
  const kpis = dashboardData?.kpis || {};
  const logs = dashboardData?.recentLogs || dashboardData?.recentActivities || [];

  const totalAssetsCount = (kpis.availableAssets || 0) + (kpis.allocatedAssets || 0) + (kpis.underMaintenance || 0) + (kpis.lostAssets || 0) + (kpis.retiredAssets || 0);

  return (
    <div>
      {/* KPI Cards Row 1: Key Metrics */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        {/* Total Assets KPI */}
        <div className="bento-card" style={{ gridColumn: "span 4", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL ASSETS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
                {totalAssetsCount}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              <Box size={20} />
            </div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: "var(--success)" }}>{kpis.allocatedAssets ?? 0} Allocated</span>
            <span>•</span>
            <span>{kpis.availableAssets ?? 0} Available</span>
          </div>
        </div>

        {/* Departments KPI */}
        <div className="bento-card" style={{ gridColumn: "span 4", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL DEPARTMENTS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
                {kpis.totalDepartments ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--info-light)", color: "var(--info)" }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <button onClick={() => setActiveTab("org")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Manage Structure</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Employees KPI */}
        <div className="bento-card" style={{ gridColumn: "span 4", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL EMPLOYEES</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
                {kpis.totalEmployees ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>
              <Repeat size={20} />
            </div>
          </div>
          <button onClick={() => setActiveTab("org")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>View Directory</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* KPI Cards Row 2: Status & Operations */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        {/* Pending Maintenance KPI */}
        <div className="bento-card" style={{ gridColumn: "span 6", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>PENDING MAINTENANCE</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--danger)", marginTop: "4px" }}>
                {kpis.underMaintenance ?? 0} Tickets Active
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>
              <Wrench size={18} />
            </div>
          </div>
          <button onClick={() => setActiveTab("maintenance")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Inspect Repair Queue</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Active Audits KPI */}
        <div className="bento-card" style={{ gridColumn: "span 6", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>ACTIVE AUDIT CYCLES</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--success)", marginTop: "4px" }}>
                {kpis.activeAudits ?? 0} Cycles In Progress
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--success-light)", color: "var(--success)" }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <button onClick={() => setActiveTab("audit")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Reconcile Cycles</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Bento Layout Block: Left Valuation Charts & Right System logs */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        {/* Left Card: Valuation & Security Metrics */}
        <div className="bento-card" style={{ gridColumn: "span 5", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Valuation & Audit Health</h3>
              <span className="badge badge-neutral" style={{ padding: "6px 12px" }}>Global</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0", padding: "14px", background: "var(--bg-app)", borderRadius: "14px" }}>
              <ShieldCheck size={28} style={{ color: "var(--success)" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>Enterprise Shield Active</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>100% ACID compliant PostgreSQL transactions.</div>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Security lock triggers automated discrepancies monitoring. When physical audit records close, missing checkouts translate directly to LOST assets.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
            <button onClick={() => setActiveTab("org")} className="btn btn-dark" style={{ flex: 1 }}>Configure RBAC</button>
            <button onClick={() => setActiveTab("audit")} className="btn btn-secondary" style={{ flex: 1, background: "var(--bg-app)" }}>Run Audit</button>
          </div>
        </div>

        {/* Right Card: Activity Log Feed */}
        <div className="bento-card" style={{ gridColumn: "span 7", padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Recent System Activity Trail</h3>
            <button onClick={() => setActiveTab("notifications")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <span>View Full Trail</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "230px", overflowY: "auto", paddingRight: "8px" }}>
            {logs.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                No recent activity logs recorded in database.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>
                      {log.action}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Target: {log.entity} • User: {log.user?.name || log.who || "System"}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "Fira Code" }}>
                    {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
