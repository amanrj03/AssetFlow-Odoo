import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  Box,
  Repeat,
  Calendar,
  Wrench,
  ShieldCheck,
  BarChart3,
  Terminal,
  Lock,
} from "lucide-react";

export const Sidebar = ({ activeTab, setActiveTab, sidebarCollapsed }) => {
  const { user } = useAuth();
  const role = user?.role || "EMPLOYEE";

  // Navigation Items matching the Core Modules
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, screen: "Screen 2", badge: "Overview" },
    { id: "org", label: "Organization Setup", icon: Building2, screen: "Screen 3", badge: role === "ADMIN" ? "Admin Only" : "Directory" },
    { id: "assets", label: "Asset Module", icon: Box, screen: "Screen 4", badge: "Tag: AF-xxxx" },
    { id: "allocation", label: "Allocations & Transfers", icon: Repeat, screen: "Screen 5", badge: "Core Engine", highlight: true },
    { id: "booking", label: "Resource Booking", icon: Calendar, screen: "Screen 6", badge: "SQL Check" },
    { id: "maintenance", label: "Maintenance Tickets", icon: Wrench, screen: "Screen 7", badge: "Workflow" },
    { id: "audit", label: "Audit Management", icon: ShieldCheck, screen: "Screen 8", badge: "Discrepancy" },
    { id: "reports", label: "Analytics & Reports", icon: BarChart3, screen: "Screen 9", badge: "Depreciation" },
    { id: "notifications", label: "Activity Logs & Feed", icon: Terminal, screen: "Screen 10", badge: "Audit Trail" },
  ];

  // When collapsed, hide the left sidebar completely so the main page gets 100% of the screen width with ZERO overlaps!
  if (sidebarCollapsed) {
    return null;
  }

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-color)",
        transition: "var(--transition)",
        zIndex: 90,
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "var(--radius-sm)",
            background: "linear-gradient(135deg, var(--primary), #F97316)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: "0.95rem",
            flexShrink: 0,
          }}
        >
          AF
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-main)", lineHeight: 1.1 }}>
            Asset<span style={{ color: "var(--coral)" }}>Flow</span>
          </span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px" }}>
            ENTERPRISE ERP
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div style={{ flex: 1, padding: "12px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ padding: "0 8px 6px", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
          MODULES ({role})
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "var(--radius-sm)",
                border: isActive ? "1px solid rgba(224, 82, 48, 0.4)" : "1px solid transparent",
                background: isActive ? "var(--bg-peach-light)" : "transparent",
                color: isActive ? "var(--coral)" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon size={16} style={{ color: isActive ? "var(--coral)" : "var(--text-secondary)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.82rem", fontWeight: isActive ? 700 : 500, whiteSpace: "nowrap" }}>
                  {item.label}
                </span>
              </div>
              {item.highlight && !isActive && (
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--coral)" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Role Notice */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border-color)", background: "var(--bg-app)", fontSize: "0.72rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-main)" }}>
          <Lock size={13} style={{ color: "var(--coral)" }} />
          <span>Active Role: {role}</span>
        </div>
        <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>
          Use top navbar profile menu to switch roles.
        </div>
      </div>
    </div>
  );
};
