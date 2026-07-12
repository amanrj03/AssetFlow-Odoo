import React from "react";
import {
  ArrowRight,
  Calendar,
  Box,
  Repeat,
  Building2,
  Users,
  Wrench
} from "lucide-react";

export const HeadDashboard = ({ dashboardData, setActiveTab }) => {
  const kpis = dashboardData?.kpis || {};

  return (
    <div>
      {/* KPI Cards Row */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        {/* Department Assets KPI */}
        <div className="bento-card" style={{ gridColumn: "span 3", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>DEPARTMENT ASSETS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
                {kpis.departmentAssets ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              <Box size={20} />
            </div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Total assets checking in dept
          </div>
        </div>

        {/* Department Employees KPI */}
        <div className="bento-card" style={{ gridColumn: "span 3", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>DEPARTMENT EMPLOYEES</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
                {kpis.departmentEmployees ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Assigned employee head count
          </div>
        </div>

        {/* Department Bookings KPI */}
        <div className="bento-card" style={{ gridColumn: "span 3", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>DEPARTMENT BOOKINGS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--info)", marginTop: "8px" }}>
                {kpis.departmentBookings ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--info-light)", color: "var(--info)" }}>
              <Calendar size={20} />
            </div>
          </div>
          <button onClick={() => setActiveTab("booking")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>View Reservations</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Department Maintenance KPI */}
        <div className="bento-card" style={{ gridColumn: "span 3", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>DEPT MAINTENANCE</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--danger)", marginTop: "8px" }}>
                {kpis.departmentMaintenance ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>
              <Wrench size={20} style={{ color: "var(--danger)" }} />
            </div>
          </div>
          <button onClick={() => setActiveTab("maintenance")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Review Repairs</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Department Summary Bento Card */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        <div className="bento-card" style={{ gridColumn: "span 12", padding: "28px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Department Head Workspace</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px", marginBottom: "24px" }}>
            As Department Head, you can pre-approve custody transfers, allocate departmental resource bookings, and review employee directory logs.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", background: "var(--bg-app)", borderRadius: "14px", width: "fit-content", marginBottom: "20px" }}>
            <Users size={20} style={{ color: "var(--primary)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>4 Registered Employees in your Department</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setActiveTab("org")} className="btn btn-dark">Open Employee Directory</button>
            <button onClick={() => setActiveTab("allocation")} className="btn btn-secondary" style={{ background: "var(--bg-app)" }}>Custody Approvals</button>
          </div>
        </div>
      </div>
    </div>
  );
};
