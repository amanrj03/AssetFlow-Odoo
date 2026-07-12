import React from "react";
import {
  ArrowRight,
  Calendar,
  Box,
  Wrench,
  BellRing
} from "lucide-react";

export const EmployeeDashboard = ({ dashboardData, setActiveTab }) => {
  const kpis = dashboardData?.kpis || {};

  return (
    <div>
      {/* KPI Cards Row */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        {/* My Assets Checkout */}
        <div className="bento-card" style={{ gridColumn: "span 3", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "180px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>MY CUSTODY ASSETS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
                {kpis.myAssets ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              <Box size={20} />
            </div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Physical hardware currently assigned to me
          </div>
        </div>

        {/* My Reservations KPI */}
        <div className="bento-card" style={{ gridColumn: "span 3", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "180px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>MY ACTIVE BOOKINGS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--info)", marginTop: "8px" }}>
                {kpis.myBookings ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--info-light)", color: "var(--info)" }}>
              <Calendar size={20} />
            </div>
          </div>
          <button onClick={() => setActiveTab("booking")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Reserve Resource</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* My Open Tickets KPI */}
        <div className="bento-card" style={{ gridColumn: "span 3", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "180px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>MY REPAIR TICKETS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--danger)", marginTop: "8px" }}>
                {kpis.myMaintenanceRequests ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>
              <Wrench size={20} />
            </div>
          </div>
          <button onClick={() => setActiveTab("maintenance")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>File Repair Ticket</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* My Unread Alerts KPI */}
        <div className="bento-card" style={{ gridColumn: "span 3", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "180px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>UNREAD ALERTS</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--warning)", marginTop: "8px" }}>
                {kpis.myNotifications ?? 0}
              </div>
            </div>
            <div className="circle-icon-btn" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>
              <BellRing size={20} />
            </div>
          </div>
          <button onClick={() => setActiveTab("notifications")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", width: "fit-content", padding: 0 }}>
            <span>Check Notification Feed</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Overview Block */}
      <div className="bento-grid" style={{ marginBottom: "26px" }}>
        <div className="bento-card" style={{ gridColumn: "span 12", padding: "28px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Employee Portal Workspace</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px", marginBottom: "24px" }}>
            You can review your checkouts, check upcoming resource calendar reservations, raise repair tickets for hardware, and monitor security notices.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setActiveTab("booking")} className="btn btn-dark">New Reservation</button>
            <button onClick={() => setActiveTab("maintenance")} className="btn btn-secondary" style={{ background: "var(--bg-app)" }}>File Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
};
