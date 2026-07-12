import React from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  ArrowRight,
  Calendar,
  Mic,
} from "lucide-react";
import { AdminDashboard } from "./dashboards/AdminDashboard";
import { ManagerDashboard } from "./dashboards/ManagerDashboard";
import { HeadDashboard } from "./dashboards/HeadDashboard";
import { EmployeeDashboard } from "./dashboards/EmployeeDashboard";

export const Screen2_Dashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { dashboardData, fetchDashboardData } = useERP();

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case "ADMIN":
        return <AdminDashboard dashboardData={dashboardData} setActiveTab={setActiveTab} />;
      case "ASSET_MANAGER":
        return <ManagerDashboard dashboardData={dashboardData} setActiveTab={setActiveTab} />;
      case "DEPARTMENT_HEAD":
        return <HeadDashboard dashboardData={dashboardData} setActiveTab={setActiveTab} />;
      case "EMPLOYEE":
      default:
        return <EmployeeDashboard dashboardData={dashboardData} setActiveTab={setActiveTab} />;
    }
  };

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

      {/* Role-Based Dynamic Dashboard Wrapper */}
      {renderDashboardByRole()}
    </div>
  );
};
