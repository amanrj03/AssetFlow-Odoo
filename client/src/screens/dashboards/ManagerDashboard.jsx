import React from "react";
import {
  ArrowRight,
  Calendar,
  Box,
  Wrench,
  Repeat,
  ShieldAlert
} from "lucide-react";

export const ManagerDashboard = ({ dashboardData, setActiveTab }) => {
  const kpis = dashboardData?.kpis || {};

  return (
    <div>
      {/* KPI Cards Row 1: Key Metrics */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        {/* Assets Available KPI */}
        <div className="bento-card" style={{ gridColumn: "span 4", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>ASSETS AVAILABLE</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--success)", marginTop: "8px" }}>
                {kpis.availableAssets ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--success-light)", color: "var(--success)" }}>
              <Box size={20} />
            </div>
          </div>
          <button onClick={() => setActiveTab("assets")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Available List</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Assets Allocated KPI */}
        <div className="bento-card" style={{ gridColumn: "span 4", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>ASSETS ALLOCATED</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
                {kpis.allocatedAssets ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              <Box size={20} />
            </div>
          </div>
          <button onClick={() => setActiveTab("allocation")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Track Custody</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Pending Transfers KPI */}
        <div className="bento-card" style={{ gridColumn: "span 4", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>PENDING TRANSFERS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--warning)", marginTop: "8px" }}>
                {kpis.pendingTransfers ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>
              <Repeat size={20} />
            </div>
          </div>
          <button onClick={() => setActiveTab("allocation")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Review Actions</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* KPI Cards Row 2: Status & Bookings */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        {/* Maintenance Queue KPI */}
        <div className="bento-card" style={{ gridColumn: "span 6", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>MAINTENANCE QUEUE</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--danger)", marginTop: "4px" }}>
                {kpis.underMaintenance ?? 0} Active Repairs
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>
              <Wrench size={18} />
            </div>
          </div>
          <button onClick={() => setActiveTab("maintenance")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Dispatch Repairs</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Active Bookings KPI */}
        <div className="bento-card" style={{ gridColumn: "span 6", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "140px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>ACTIVE RESOURCE BOOKINGS</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--info)", marginTop: "4px" }}>
                {kpis.activeBookings ?? 0} Ongoing Reservations
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--info-light)", color: "var(--info)" }}>
              <Calendar size={18} />
            </div>
          </div>
          <button onClick={() => setActiveTab("booking")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>View Calendar Heatmap</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        <div className="bento-card" style={{ gridColumn: "span 12", padding: "28px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Asset Manager Overview</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px", marginBottom: "24px" }}>
            You have full authorization to modify assets, assign QR codes, upload warranty files, review custody checkouts, and dispatch repairs.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div style={{ padding: "20px", background: "var(--bg-app)", borderRadius: "14px" }}>
              <h4 style={{ fontWeight: 800, marginBottom: "8px" }}>📦 Quick Asset Creation</h4>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "16px" }}>Add new hardware assets and upload images to Cloudinary.</p>
              <button onClick={() => setActiveTab("assets")} className="btn btn-dark btn-sm">Create Asset</button>
            </div>
            <div style={{ padding: "20px", background: "var(--bg-app)", borderRadius: "14px" }}>
              <h4 style={{ fontWeight: 800, marginBottom: "8px" }}>🔧 Assign Repair Technicians</h4>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "16px" }}>Approve maintenance requests and delegate to repair vendors.</p>
              <button onClick={() => setActiveTab("maintenance")} className="btn btn-dark btn-sm">Go to Tickets</button>
            </div>
            <div style={{ padding: "20px", background: "var(--bg-app)", borderRadius: "14px" }}>
              <h4 style={{ fontWeight: 800, marginBottom: "8px" }}>📈 View BI Analytics Reports</h4>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "16px" }}>Audit department utilization rates and download CSV logs.</p>
              <button onClick={() => setActiveTab("reports")} className="btn btn-dark btn-sm">View Analytics</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
