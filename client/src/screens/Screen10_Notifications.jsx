import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  BellRing,
  CheckCircle2,
  Activity,
  Calendar,
  Repeat,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Check,
  CheckCheck,
  Search,
  Filter,
  Sparkles,
  Terminal,
} from "lucide-react";

export const Screen10_Notifications = () => {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, activityLogs } = useERP();

  const [activeTab, setActiveTab] = useState("notifications"); // "notifications" | "logs"
  const [filterType, setFilterType] = useState("ALL");
  const [searchLog, setSearchLog] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifs = notifications.filter((n) => filterType === "ALL" || n.type === filterType);

  const filteredLogs = activityLogs.filter((log) => {
    if (!searchLog) return true;
    const term = searchLog.toLowerCase();
    return (
      log.who.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.entity.toLowerCase().includes(term) ||
      (log.metadata && log.metadata.toLowerCase().includes(term))
    );
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case "Transfer":
      case "Approval": return <Repeat size={18} style={{ color: "var(--warning)" }} />;
      case "Booking": return <Calendar size={18} style={{ color: "var(--info)" }} />;
      case "Maintenance": return <Wrench size={18} style={{ color: "var(--purple)" }} />;
      case "Audit": return <ShieldCheck size={18} style={{ color: "var(--success)" }} />;
      case "Overdue":
      case "Alert": return <AlertTriangle size={18} style={{ color: "var(--danger)" }} />;
      default: return <BellRing size={18} style={{ color: "var(--primary)" }} />;
    }
  };

  const getNotifBadge = (type) => {
    switch (type) {
      case "Transfer":
      case "Approval": return "badge-warning";
      case "Booking": return "badge-info";
      case "Maintenance": return "badge-purple";
      case "Audit": return "badge-success";
      case "Overdue":
      case "Alert": return "badge-danger";
      default: return "badge-neutral";
    }
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="badge badge-purple" style={{ fontSize: "0.75rem" }}>Screen 10: Notifications Module</span>
            <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>createActivityLog() Audit Trail</span>
          </div>
          <h1 className="page-title" style={{ marginTop: "8px" }}>Notification Center & System Activity Audit Logs</h1>
          <p className="page-subtitle">
            Manage system alerts (`GET /notifications`, `PATCH /read-all`) and inspect complete `createActivityLog()` event history across all 11 modules (`Who`, `Action`, `Entity`, `Timestamp`, `IP`, `Metadata`).
          </p>
        </div>

        {activeTab === "notifications" && unreadCount > 0 && (
          <button className="btn btn-primary" onClick={markAllNotificationsRead}>
            <CheckCheck size={18} />
            <span>Mark All as Read (`PATCH /read-all`)</span>
          </button>
        )}
      </div>

      {/* Module Tabs (`Sleek rounded glass pill bar`) */}
      <div className="sub-pill-bar">
        <button className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
          <BellRing size={16} />
          <span>User Notifications</span>
          {unreadCount > 0 && <span className="badge badge-coral" style={{ marginLeft: "4px" }}>{unreadCount} Unread</span>}
        </button>
        <button className={`tab-btn ${activeTab === "logs" ? "active" : ""}`} onClick={() => setActiveTab("logs")}>
          <Terminal size={16} />
          <span>System Activity Logs</span>
          <span className="badge badge-neutral" style={{ marginLeft: "4px" }}>{activityLogs.length} Events</span>
        </button>
      </div>

      {/* --- TAB 1: NOTIFICATIONS (`GET /notifications`) --- */}
      {activeTab === "notifications" && (
        <div>
          <div className="glass-card" style={{ marginBottom: "20px", padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Filter Notification Types:</span>
              {["ALL", "Transfer", "Booking", "Maintenance", "Audit", "Overdue", "Alert"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`btn btn-sm ${filterType === t ? "btn-primary" : "btn-secondary"}`}
                  style={{ borderRadius: "99px" }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredNotifs.length === 0 ? (
              <div className="glass-card" style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)" }}>
                No notifications matching this category filter.
              </div>
            ) : (
              filteredNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className="glass-card"
                  style={{
                    padding: "18px 22px",
                    background: n.read ? "var(--bg-surface)" : "linear-gradient(90deg, rgba(99, 102, 241, 0.14), var(--bg-surface))",
                    borderLeft: n.read ? "1px solid var(--border-color)" : "4px solid var(--primary)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", background: "var(--bg-app)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-color)", flexShrink: 0 }}>
                      {getNotifIcon(n.type)}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                        <span className={`badge ${getNotifBadge(n.type)}`}>{n.type}</span>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{n.timestamp}</span>
                        {!n.read && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)" }}></span>}
                      </div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: n.read ? 600 : 700, color: "var(--text-main)", marginBottom: "4px" }}>
                        {n.title}
                      </h4>
                      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>{n.message}</p>
                    </div>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    {!n.read ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markNotificationRead(n.id);
                        }}
                        className="btn btn-secondary btn-sm"
                        title="Mark read (`PATCH /notifications/read`)"
                      >
                        <Check size={14} /> Mark Read
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 size={14} style={{ color: "var(--success)" }} /> Read
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: SYSTEM ACTIVITY LOGS (`createActivityLog()`) --- */}
      {activeTab === "logs" && (
        <div>
          <div className="glass-card" style={{ marginBottom: "20px", padding: "16px 20px" }}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="Search audit trail by Who (`Aman`), Action (`Transfer`), Entity (`AF-0001`), or IP..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event ID & Who</th>
                  <th>Action (`createActivityLog()`)</th>
                  <th>Entity Target</th>
                  <th>Metadata / Details</th>
                  <th>Timestamp & IP</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{log.who}</div>
                      <div style={{ fontFamily: "Fira Code", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>{log.id}</div>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ fontSize: "0.78rem" }}>{log.action}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--primary)" }}>{log.entity}</td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                      {log.metadata || "(No extra metadata)"}
                    </td>
                    <td>
                      <div style={{ fontFamily: "Fira Code", fontSize: "0.82rem", color: "var(--text-main)" }}>{log.timestamp}</div>
                      <div style={{ fontFamily: "Fira Code", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>IP: {log.ip}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
