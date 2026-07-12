import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  Menu,
  Plus,
  Search,
  LayoutDashboard,
  Building2,
  Box,
  Repeat,
  Calendar,
  Wrench,
  ShieldCheck,
  BarChart3,
  Terminal,
  ChevronDown,
  UserCheck,
  Bell,
  Sun,
  Moon,
  Home,
} from "lucide-react";

export const Navbar = ({ activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed, setShowLanding }) => {
  const { user, switchRole, demoUsersList, theme, toggleTheme } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, assets } = useERP();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleSelect = (roleKey) => {
    switchRole(roleKey);
    setShowRoleMenu(false);
  };

  const filteredSearchAssets = searchQuery.trim()
    ? assets.filter(
        (a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const navTabs = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
    { id: "org", label: "Org & Team", icon: <Building2 size={15} /> },
    { id: "assets", label: "Assets", icon: <Box size={15} /> },
    { id: "allocation", label: "Allocations", icon: <Repeat size={15} /> },
    { id: "booking", label: "Schedule", icon: <Calendar size={15} /> },
    { id: "maintenance", label: "Repairs", icon: <Wrench size={15} /> },
    { id: "audit", label: "Audits", icon: <ShieldCheck size={15} /> },
    { id: "reports", label: "Analytics", icon: <BarChart3 size={15} /> },
    { id: "notifications", label: "Activity Logs", icon: <Terminal size={15} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      {/* Exact No. Financial Top Bar (`= | № | Financial Dashboard | + | Dwayne Tatum | 🔍 Start searching here...`) */}
      <header className="navbar-financial-header">
        <div className="navbar-financial-left">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="circle-icon-btn"
            title="Toggle Menu Panels"
          >
            <Menu size={20} />
          </button>

          <div className="circle-logo-badge">№</div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-main)", lineHeight: 1.1 }}>
              Financial
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Dashboard ({user?.role || "CEO Assistant"})
            </span>
          </div>
        </div>

        {/* Center Pill Navigation Bar (Only visible when sidebar is collapsed so there is zero duplicate navigation clutter!) */}
        {sidebarCollapsed && (
          <div className="navbar-pill-tabs" style={{ maxWidth: "800px" }}>
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pill-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Right Action Controls (`+ | Dwayne Tatum / CEO Assistant | 🔍 Start searching here...`) */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => setActiveTab("assets")}
            className="circle-icon-btn"
            title="Add New Asset or Request"
            style={{ fontWeight: 800, fontSize: "1.3rem" }}
          >
            <Plus size={20} />
          </button>

          {/* User Profile & Role Switcher Pill (exact mirror of Dwayne Tatum / CEO Assistant) */}
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "6px 14px 6px 6px",
                borderRadius: "var(--radius-pill)",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                alt={user?.name || "Dwayne Tatum"}
                style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.1 }}>
                  {user?.name || "Dwayne Tatum"}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--coral)", fontWeight: 600 }}>
                  {user?.role || "CEO Assistant"} ⌄
                </span>
              </div>
            </div>

            {/* Role Switcher Dropdown */}
            {showRoleMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "250px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  padding: "8px",
                  zIndex: 200,
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", padding: "6px 10px", textTransform: "uppercase" }}>
                  Switch Test Role (`Dwayne Tatum`)
                </div>
                {Object.keys(demoUsersList).map((roleKey) => {
                  const u = demoUsersList[roleKey];
                  return (
                    <button
                      key={roleKey}
                      onClick={() => handleRoleSelect(roleKey)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        background: user?.role === roleKey ? "var(--bg-peach-light)" : "transparent",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>{roleKey}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{u.name}</div>
                      </div>
                      {user?.role === roleKey && <span style={{ color: "var(--coral)", fontWeight: 800 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Input Pill (`Start searching here...`) */}
          <div style={{ position: "relative" }}>
            <div className="search-input-wrapper" style={{ minWidth: "240px" }}>
              <Search className="search-icon" size={16} style={{ left: "14px" }} />
              <input
                type="text"
                className="form-input"
                placeholder="Start searching here ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                style={{ padding: "9px 16px 9px 40px", fontSize: "0.85rem", borderRadius: "var(--radius-pill)" }}
              />
            </div>

            {showSearchResults && searchQuery.trim() && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "320px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  padding: "10px",
                  zIndex: 200,
                }}
              >
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", padding: "4px 8px", textTransform: "uppercase" }}>
                  Matching Assets ({filteredSearchAssets.length})
                </div>
                {filteredSearchAssets.length === 0 ? (
                  <div style={{ padding: "12px", textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    No assets match "{searchQuery}"
                  </div>
                ) : (
                  filteredSearchAssets.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setActiveTab("assets");
                        setShowSearchResults(false);
                        setSearchQuery("");
                      }}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <span style={{ fontFamily: "Fira Code", fontWeight: 700, color: "var(--coral)", fontSize: "0.78rem" }}>{a.tag}</span>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-main)" }}>{a.name}</div>
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>{a.status}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Home Landing Page Button & Theme Mode Toggle */}
          {setShowLanding && (
            <button
              onClick={() => setShowLanding(true)}
              className="pill-tab-btn"
              title="Return to Landing Page Overview"
              style={{ padding: "6px 12px", border: "1px solid var(--border-color)", background: "var(--bg-app)", fontSize: "0.78rem" }}
            >
              <Home size={15} style={{ color: "var(--coral)" }} />
              <span>Landing</span>
            </button>
          )}

          <button onClick={toggleTheme} className="circle-icon-btn" title="Toggle Mode">
            {theme === "dark" ? <Sun size={18} style={{ color: "#FBBF24" }} /> : <Moon size={18} style={{ color: "var(--text-secondary)" }} />}
          </button>

          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotifMenu(!showNotifMenu)} className="circle-icon-btn" title="Activity Alerts">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--coral)",
                  }}
                />
              )}
            </button>

            {showNotifMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "330px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  padding: "14px",
                  zIndex: 200,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Activity Alerts</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      style={{ fontSize: "0.75rem", color: "var(--coral)", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "260px", overflowY: "auto" }}>
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: "10px",
                        borderRadius: "var(--radius-sm)",
                        background: n.read ? "var(--bg-app)" : "var(--bg-peach-light)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        <span className="badge badge-coral" style={{ fontSize: "0.68rem" }}>{n.type}</span>
                        <span>{n.timestamp}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text-main)", marginTop: "4px" }}>{n.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{n.message}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveTab("notifications");
                    setShowNotifMenu(false);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  View All Logs & Activity →
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
