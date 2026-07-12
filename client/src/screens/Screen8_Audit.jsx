import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import { api } from "../services/api";
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  FileSpreadsheet,
  Lock,
  UserCheck,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export const Screen8_Audit = () => {
  const { user } = useAuth();
  const {
    auditCycles,
    fetchAuditCycles,
    fetchAssets,
    assets
  } = useERP();

  React.useEffect(() => {
    fetchAuditCycles();
    fetchAssets();
  }, []);

  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("Q4 2026 Comprehensive Asset Inventory Audit");
  const [auditor, setAuditor] = useState(user?.name || "Priya Sharma");
  const [scope, setScope] = useState("All Electronics & IT Hardware");

  const currentCycle = auditCycles.find((c) => c.id === selectedCycleId) || auditCycles[0];

  React.useEffect(() => {
    if (auditCycles.length > 0 && !selectedCycleId) {
      setSelectedCycleId(auditCycles[0].id);
    }
  }, [auditCycles, selectedCycleId]);

  const handleVerifyItem = async (assetId, verificationStatus) => {
    if (!currentCycle || currentCycle.status === "CLOSED" || currentCycle.status === "Closed") return;
    try {
      const res = await api.request(`/audits/${currentCycle.id}/verify`, {
        method: "POST",
        body: JSON.stringify({
          assetId,
          verification: verificationStatus,
          notes: `Verified during audit cycle: ${currentCycle.title}`
        })
      });
      if (res && res.success) {
        await fetchAuditCycles();
      } else {
        alert(res?.message || "Failed to record asset verification");
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    }
  };

  const handleCloseAudit = async () => {
    if (!currentCycle || currentCycle.status === "CLOSED" || currentCycle.status === "Closed") return;
    if (window.confirm("Are you sure you want to close this audit cycle and update missing assets status to LOST?")) {
      try {
        const res = await api.request(`/audits/${currentCycle.id}/close`, {
          method: "PATCH"
        });
        if (res && res.success) {
          await fetchAuditCycles();
          await fetchAssets();
        } else {
          alert(res?.message || "Failed to close audit cycle");
        }
      } catch (err) {
        alert(err.message || "An error occurred");
      }
    }
  };

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await api.request("/audits", {
        method: "POST",
        body: JSON.stringify({
          title,
          scope,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
      if (res && res.success) {
        await fetchAuditCycles();
        setShowAddModal(false);
        if (res.data?.cycle?.id) {
          setSelectedCycleId(res.data.cycle.id);
        }
      } else {
        alert(res?.message || "Failed to create audit cycle");
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    }
  };

  const getVerificationBadge = (v) => {
    switch (v) {
      case "Verified": return "badge-success";
      case "Missing": return "badge-danger";
      case "Damaged": return "badge-warning";
      default: return "badge-neutral";
    }
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="badge badge-purple" style={{ fontSize: "0.75rem" }}>Asset Audits</span>
            <span className="badge badge-info" style={{ fontSize: "0.75rem" }}>POST/GET /audit-cycle</span>
          </div>
          <h1 className="page-title" style={{ marginTop: "8px" }}>Physical Audit Verification & Discrepancy Engine</h1>
          <p className="page-subtitle">
            Assign auditors, verify physical asset condition (`Verified`, `Missing`, `Damaged`), close audits to automatically generate discrepancy reports (`Generate discrepancy report → Update Lost assets → Save history`).
          </p>
        </div>

        {(user?.role === "ADMIN" || user?.role === "ASSET_MANAGER") && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Create Audit Cycle (`POST /audit-cycle`)</span>
          </button>
        )}
      </div>

      {/* Cycle Selector & Status Header */}
      <div className="glass-card" style={{ marginBottom: "24px", padding: "18px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Active Audit Cycle:</span>
            <select
              className="form-select"
              style={{ width: "320px", fontWeight: 600 }}
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
            >
              {auditCycles.map((c) => (
                <option key={c.id} value={c.id}>{c.title} [{c.status.toUpperCase()}]</option>
              ))}
            </select>
          </div>

          {currentCycle && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Auditor: <strong style={{ color: "var(--text-main)" }}>{currentCycle.assignedAuditor}</strong>
              </div>
              <span className={`badge ${currentCycle.status === "Closed" ? "badge-success" : "badge-warning"}`}>
                {currentCycle.status}
              </span>
              {currentCycle.status !== "Closed" && (user?.role === "ADMIN" || user?.role === "ASSET_MANAGER") && (
                <button className="btn btn-success" onClick={handleCloseAudit}>
                  <Lock size={16} />
                  <span>Close Audit & Generate Discrepancy Report</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Discrepancy Report Banner if closed */}
      {currentCycle?.discrepancyReport && (
        <div className="glass-card" style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(239, 68, 68, 0.08))", borderColor: "rgba(16, 185, 129, 0.4)", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--success)", fontWeight: 700, fontSize: "1.1rem" }}>
              <FileSpreadsheet size={22} />
              <span>Audit Discrepancy Report Generated (`{currentCycle.discrepancyReport.closedAt}`)</span>
            </div>
            <span className="badge badge-purple">History Saved</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "14px" }}>
            <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Verified Assets</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--success)" }}>{currentCycle.discrepancyReport.verifiedCount}</div>
            </div>
            <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Missing Assets (Marked Lost)</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--danger)" }}>{currentCycle.discrepancyReport.missingCount}</div>
            </div>
            <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Damaged Assets (Under Maintenance)</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--warning)" }}>{currentCycle.discrepancyReport.damagedCount}</div>
            </div>
          </div>

          {(currentCycle.discrepancyReport.missingTags.length > 0 || currentCycle.discrepancyReport.damagedTags.length > 0) && (
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              {currentCycle.discrepancyReport.missingTags.length > 0 && <div>⚠️ Missing Tags updated in inventory to `Lost`: <strong>{currentCycle.discrepancyReport.missingTags.join(", ")}</strong></div>}
              {currentCycle.discrepancyReport.damagedTags.length > 0 && <div>⚠️ Damaged Tags queued for repair: <strong>{currentCycle.discrepancyReport.damagedTags.join(", ")}</strong></div>}
            </div>
          )}
        </div>
      )}

      {/* Audit Checklist Table */}
      {currentCycle && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Asset Name & Model</th>
                <th>Physical Scope</th>
                <th>Verification (`Verified`, `Missing`, `Damaged`)</th>
                <th style={{ textAlign: "right" }}>Verification Checklist Buttons</th>
              </tr>
            </thead>
            <tbody>
              {currentCycle.items.map((item) => (
                <tr key={item.assetId}>
                  <td style={{ fontFamily: "Fira Code", fontWeight: 700, color: "var(--primary)" }}>{item.assetTag}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{item.assetName}</td>
                  <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{currentCycle.scope}</td>
                  <td>
                    <span className={`badge ${getVerificationBadge(item.verification)}`}>{item.verification}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {currentCycle.status !== "Closed" ? (
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleVerifyItem(item.assetId, "Verified")}
                          className={`btn btn-sm ${item.verification === "Verified" ? "btn-success" : "btn-secondary"}`}
                        >
                          <CheckCircle size={14} /> Verified
                        </button>
                        <button
                          onClick={() => handleVerifyItem(item.assetId, "Missing")}
                          className={`btn btn-sm ${item.verification === "Missing" ? "btn-danger" : "btn-secondary"}`}
                        >
                          <XCircle size={14} /> Missing
                        </button>
                        <button
                          onClick={() => handleVerifyItem(item.assetId, "Damaged")}
                          className={`btn btn-sm ${item.verification === "Damaged" ? "btn-secondary" : "btn-secondary"}`}
                          style={item.verification === "Damaged" ? { background: "var(--warning)", color: "white" } : {}}
                        >
                          <AlertTriangle size={14} /> Damaged
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Audit Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Audit Cycle Modal (`POST /audit-cycle`) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "480px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>Create Audit Cycle (`POST /audit-cycle`)</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "18px" }}>
              Assign auditor and verification scope across asset categories.
            </p>

            <form onSubmit={handleCreateCycle} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Audit Cycle Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Q4 2026 IT Hardware Verification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Assigned Auditor (`Asset Manager` or `Admin`)</label>
                <input
                  type="text"
                  className="form-input"
                  value={auditor}
                  onChange={(e) => setAuditor(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Verification Scope</label>
                <select className="form-select" value={scope} onChange={(e) => setScope(e.target.value)}>
                  <option value="Electronics & IT Hardware">Electronics & IT Hardware</option>
                  <option value="Conference & Audio-Visual Equipment">Conference & Audio-Visual Equipment</option>
                  <option value="Executive Furniture & Fixtures">Executive Furniture & Fixtures</option>
                  <option value="Company Vehicles Fleet">Company Vehicles Fleet</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Launch Audit Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
