import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  Wrench,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Play,
  RotateCcw,
  Plus,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Screen7_Maintenance = () => {
  const { user } = useAuth();
  const { maintenances, assets, raiseMaintenance, updateMaintenanceStatus } = useERP();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [description, setDescription] = useState("Battery capacity degraded below 75%, thermal fan throttling");
  const [priority, setPriority] = useState("High");

  // Assign Technician Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTicketId, setAssignTicketId] = useState("");
  const [techName, setTechName] = useState("Apple/HP Authorized Repair Specialist");

  const canApproveOrAssign = user?.role === "ADMIN" || user?.role === "ASSET_MANAGER";

  const handleRaiseSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssetId || !description) return;
    raiseMaintenance({ assetId: selectedAssetId, description, priority });
    setShowAddModal(false);
    setDescription("Battery capacity degraded below 75%, thermal fan throttling");
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignTicketId || !techName) return;
    updateMaintenanceStatus(assignTicketId, "Technician Assigned", techName);
    setShowAssignModal(false);
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case "High": return "badge-danger";
      case "Medium": return "badge-warning";
      case "Low": return "badge-info";
      default: return "badge-neutral";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return "badge-warning";
      case "Approved": return "badge-info";
      case "Technician Assigned": return "badge-purple";
      case "In Progress": return "badge-purple";
      case "Resolved": return "badge-success";
      default: return "badge-neutral";
    }
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="badge badge-purple" style={{ fontSize: "0.75rem" }}>Maintenance Workflows & Repairs</span>
            <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>Auto Asset Status Progression Active</span>
          </div>
          <h1 className="page-title" style={{ marginTop: "8px" }}>Asset Repair & Maintenance Hub</h1>
          <p className="page-subtitle">
            Track workflow progression (`Pending → Approved → Technician Assigned → In Progress → Resolved`). Automatically updates asset status between `Under Maintenance` and `Available`.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          <span>Raise Maintenance Ticket (`POST /maintenance`)</span>
        </button>
      </div>

      {/* Workflow Legend Box */}
      <div className="glass-card" style={{ marginBottom: "24px", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
            <Wrench size={18} style={{ color: "var(--warning)" }} />
            <span>Workflow Progression Specification Check:</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "0.78rem" }}>
            <span className="badge badge-warning">Pending</span>
            <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
            <span className="badge badge-info">Approved</span>
            <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
            <span className="badge badge-purple">Technician Assigned</span>
            <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
            <span className="badge badge-purple">In Progress</span>
            <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
            <span className="badge badge-success">Resolved</span>
          </div>

          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", background: "var(--bg-app)", padding: "6px 12px", borderRadius: "99px", border: "1px solid var(--border-color)" }}>
            💡 <strong>Backend automatically:</strong> Approved → `Under Maintenance` | Resolve → `Available`
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket ID & Asset Tag</th>
              <th>Asset Name</th>
              <th>Issue Description</th>
              <th>Priority</th>
              <th>Technician / Raised By</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Progression Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((m) => (
              <tr key={m.id}>
                <td>
                  <span style={{ fontFamily: "Fira Code", fontWeight: 700, color: "var(--primary)", fontSize: "0.82rem" }}>
                    {m.assetTag}
                  </span>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>ID: {m.id}</div>
                </td>
                <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{m.assetName}</td>
                <td style={{ fontSize: "0.88rem", maxWidth: "280px" }}>{m.description}</td>
                <td><span className={`badge ${getPriorityBadge(m.priority)}`}>{m.priority}</span></td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: m.technician ? "var(--purple)" : "var(--text-muted)" }}>
                    {m.technician || "(Unassigned)"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>Raised by: {m.raisedBy}</div>
                </td>
                <td>
                  <span className={`badge ${getStatusBadge(m.status)}`}>{m.status}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    {m.status === "Pending" && (
                      <button
                        disabled={!canApproveOrAssign}
                        onClick={() => updateMaintenanceStatus(m.id, "Approved")}
                        className="btn btn-secondary btn-sm"
                        style={{ opacity: !canApproveOrAssign ? 0.4 : 1, color: "var(--info)" }}
                        title="Approve (`Approved -> Asset Status: Under Maintenance`)"
                      >
                        Approve
                      </button>
                    )}

                    {(m.status === "Approved" || m.status === "Pending") && !m.technician && (
                      <button
                        disabled={!canApproveOrAssign}
                        onClick={() => {
                          setAssignTicketId(m.id);
                          setShowAssignModal(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ opacity: !canApproveOrAssign ? 0.4 : 1, color: "var(--purple)" }}
                        title="Assign Technician"
                      >
                        <UserCheck size={14} /> Assign Tech
                      </button>
                    )}

                    {(m.status === "Technician Assigned" || m.status === "Approved") && (
                      <button
                        onClick={() => updateMaintenanceStatus(m.id, "In Progress")}
                        className="btn btn-secondary btn-sm"
                        style={{ color: "var(--purple)" }}
                      >
                        <Play size={14} /> Start Repair
                      </button>
                    )}

                    {m.status === "In Progress" && (
                      <button
                        onClick={() => updateMaintenanceStatus(m.id, "Resolved")}
                        className="btn btn-success btn-sm"
                        title="Resolve (`Resolve -> Asset Status: Available`)"
                      >
                        <CheckCircle size={14} /> Resolve & Set Available
                      </button>
                    )}

                    {m.status === "Resolved" && (
                      <span style={{ fontSize: "0.78rem", color: "var(--success)", fontWeight: 600 }}>✓ Resolved</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Raise Maintenance Modal (`POST /maintenance`) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>Raise Maintenance (`POST /maintenance`)</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "18px" }}>
              Select asset and describe technical repair requirement or damage.
            </p>

            <form onSubmit={handleRaiseSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Asset to Repair</label>
                <select className="form-select" value={selectedAssetId} onChange={(e) => setSelectedAssetId(e.target.value)} required>
                  <option value="">-- Choose Asset --</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.tag} - {a.name} [{a.condition}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Priority</label>
                <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="High">High (Immediate Action Required)</option>
                  <option value="Medium">Medium (Scheduled Service)</option>
                  <option value="Low">Low (Routine Inspection)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Issue Description & Diagnostics</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe exact errors, error codes, physical damages..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Raise Maintenance Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Technician Modal */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "460px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>Assign Repair Technician</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "18px" }}>
              Transitions status to `Technician Assigned` and marks asset `Under Maintenance`.
            </p>

            <form onSubmit={handleAssignSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Technician Name / Vendor</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dell Enterprise Field Service / Suresh K."
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
