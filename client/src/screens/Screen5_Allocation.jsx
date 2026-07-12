import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  Repeat,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  User,
  Box,
  CornerDownRight,
  Sparkles,
  FileText,
  RotateCcw,
} from "lucide-react";

export const Screen5_Allocation = () => {
  const { user } = useAuth();
  const {
    assets,
    transferRequests,
    fetchTransferRequests,
    fetchAssets,
    processTransferRequest,
    allocateAsset,
    requestTransfer,
    returnAsset,
  } = useERP();

  React.useEffect(() => {
    fetchTransferRequests();
    fetchAssets();
  }, []);

  const [activeTab, setActiveTab] = useState("transfers"); // "transfers" | "direct" | "returns"
  
  // Direct Allocation State (`POST /allocation`)
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [targetUser, setTargetUser] = useState("Neha Singh");
  const [targetDept, setTargetDept] = useState("IT & Infrastructure");
  const [allocNotes, setAllocNotes] = useState("Project deployment assignment");
  const [allocError, setAllocError] = useState(null);
  const [allocSuccess, setAllocSuccess] = useState(null);

  // Transfer Request Form State (`POST /transfer` triggered when already allocated)
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAssetId, setTransferAssetId] = useState("");
  const [transferFrom, setTransferFrom] = useState("");
  const [transferTo, setTransferTo] = useState("Neha Singh (IT & Infrastructure)");
  const [transferReason, setTransferReason] = useState("Urgent project re-allocation for 2 weeks");

  // Return Asset State (`POST /return`)
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnAssetId, setReturnAssetId] = useState("");
  const [returnCondition, setReturnCondition] = useState("Good");
  const [returnNotes, setReturnNotes] = useState("Workstation returned clean and formatted.");

  const canApprove = user?.role === "ADMIN" || user?.role === "ASSET_MANAGER" || user?.role === "DEPARTMENT_HEAD";

  const handleDirectAllocation = async (e) => {
    e.preventDefault();
    setAllocError(null);
    setAllocSuccess(null);

    if (!selectedAssetId) return;

    const result = await allocateAsset(selectedAssetId, targetUser, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), allocNotes);
    if (result && !result.success) {
      setAllocError({
        message: result.message || "Already allocated",
        assetId: selectedAssetId,
      });
    } else if (result) {
      setAllocSuccess(result.message || "Asset allocated successfully");
    }
  };

  const handleOpenTransferModal = (asset) => {
    setTransferAssetId(asset.id || asset.tag);
    setTransferFrom(asset.allocatedTo ? `${asset.allocatedTo} (${asset.department})` : asset.department);
    setShowTransferModal(true);
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferAssetId || !transferTo) return;
    await requestTransfer({
      assetId: transferAssetId,
      from: transferFrom,
      to: transferTo,
      reason: transferReason,
    });
    setShowTransferModal(false);
    setActiveTab("transfers");
    setAllocError(null);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnAssetId) return;
    await returnAsset({
      assetId: returnAssetId,
      condition: returnCondition,
      notes: returnNotes,
    });
    setShowReturnModal(false);
    setActiveTab("returns");
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="badge badge-purple" style={{ fontSize: "0.75rem" }}>Allocation & Transfer Engine</span>
            <span className="badge badge-danger" style={{ fontSize: "0.75rem" }}>MOST IMPORTANT BACKEND ENGINE</span>
          </div>
          <h1 className="page-title" style={{ marginTop: "8px" }}>Asset Allocation, Transfer Requests & Returns</h1>
          <p className="page-subtitle">
            Enforces strict allocation guards: if status is `Allocated`, direct assignment rejects (`Already allocated`) and opens Transfer Request workflow (`POST /transfer`).
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-primary" onClick={() => setActiveTab("direct")}>
            <span>Test Allocation Guard (`POST /allocation`)</span>
          </button>
        </div>
      </div>

      {/* Module Tabs (`Sleek rounded glass pill bar`) */}
      <div className="sub-pill-bar">
        <button className={`tab-btn ${activeTab === "transfers" ? "active" : ""}`} onClick={() => setActiveTab("transfers")}>
          <Repeat size={16} />
          <span>Transfer Requests</span>
          <span className="badge badge-coral" style={{ marginLeft: "4px" }}>
            {transferRequests.filter((r) => r.status === "Pending").length} Pending
          </span>
        </button>
        <button className={`tab-btn ${activeTab === "direct" ? "active" : ""}`} onClick={() => setActiveTab("direct")}>
          <Box size={16} />
          <span>Direct Allocation Engine</span>
        </button>
        <button className={`tab-btn ${activeTab === "returns" ? "active" : ""}`} onClick={() => setActiveTab("returns")}>
          <RotateCcw size={16} />
          <span>Asset Return Workflow</span>
        </button>
      </div>

      {/* --- TAB 1: TRANSFER REQUESTS (`POST /transfer`) --- */}
      {activeTab === "transfers" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem" }}>Transfer Request Queue</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Fields: `From`, `To`, `Reason` | Status: `Pending → Approved / Rejected` | Approval: `Asset Manager / Dept Head`
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset Tag & Name</th>
                  <th>From (Current Holder)</th>
                  <th>To (Requested Recipient)</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Approval Action (`PATCH /transfer/:id`)</th>
                </tr>
              </thead>
              <tbody>
                {transferRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div style={{ fontFamily: "Fira Code", fontWeight: 700, color: "var(--primary)", fontSize: "0.82rem" }}>
                        {req.assetTag}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)", marginTop: "2px" }}>
                        {req.assetName}
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{req.from}</td>
                    <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{req.to}</td>
                    <td style={{ fontSize: "0.85rem", fontStyle: "italic", maxWidth: "250px" }}>"{req.reason}"</td>
                    <td>
                      <span className={`badge ${req.status === "Approved" ? "badge-success" : req.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>
                        {req.status}
                      </span>
                      {req.approvedBy && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>By: {req.approvedBy}</div>}
                    </td>
                    <td>
                      {req.status === "Pending" ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            disabled={!canApprove}
                            onClick={() => processTransferRequest(req.id, "Approved")}
                            className="btn btn-success btn-sm"
                            style={{ opacity: !canApprove ? 0.4 : 1, cursor: !canApprove ? "not-allowed" : "pointer" }}
                            title={!canApprove ? "Only Asset Manager or Dept Head can approve" : "Approve and reallocate"}
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            disabled={!canApprove}
                            onClick={() => processTransferRequest(req.id, "Rejected")}
                            className="btn btn-danger btn-sm"
                            style={{ opacity: !canApprove ? 0.4 : 1, cursor: !canApprove ? "not-allowed" : "pointer" }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: DIRECT ALLOCATION & REJECTION SIMULATOR (`POST /allocation`) --- */}
      {activeTab === "direct" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px" }}>
          <div className="glass-card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span className="badge badge-purple">POST /allocation Test Engine</span>
            </div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Assign Asset to Employee</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Test the core business requirement: selecting an already allocated asset (like `AF-0001` or `AF-0003`) immediately triggers `{"{ message: \"Already allocated\" }"}` rejection and prompts Transfer Request!
            </p>

            {allocError && (
              <div style={{ padding: "16px", borderRadius: "var(--radius-md)", background: "var(--danger-light)", border: "1px solid rgba(239, 68, 68, 0.4)", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FCA5A5", fontWeight: 700, fontSize: "0.95rem", marginBottom: "6px" }}>
                  <AlertTriangle size={20} />
                  <span>Backend Rejection Response (`HTTP 400 Bad Request`):</span>
                </div>
                <pre style={{ background: "rgba(0,0,0,0.4)", padding: "10px", borderRadius: "var(--radius-sm)", color: "#F87171", fontFamily: "Fira Code", fontSize: "0.85rem", marginBottom: "12px" }}>
                  {JSON.stringify({ message: allocError.message, code: "ALREADY_ALLOCATED" }, null, 2)}
                </pre>
                <div style={{ fontSize: "0.85rem", color: "var(--text-main)", marginBottom: "10px" }}>
                  <strong>Next Step Exact Mockup Flow:</strong> Since `{allocError.assetId}` is already allocated, you must initiate a <strong>Transfer Request</strong> (`POST /transfer`).
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const targetAsset = assets.find((a) => a.id === allocError.assetId || a.tag === allocError.assetId);
                    if (targetAsset) handleOpenTransferModal(targetAsset);
                  }}
                >
                  <Repeat size={14} /> Open Transfer Request Form Exactly Like Mockup →
                </button>
              </div>
            )}

            {allocSuccess && (
              <div style={{ padding: "14px", borderRadius: "var(--radius-md)", background: "var(--success-light)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#6EE7B7", fontSize: "0.9rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle size={18} />
                <span>{allocSuccess}</span>
              </div>
            )}

            <form onSubmit={handleDirectAllocation} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="form-label">Select Asset to Allocate</label>
                <select className="form-select" value={selectedAssetId} onChange={(e) => setSelectedAssetId(e.target.value)}>
                  <option value="">-- Choose an asset --</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.tag} - {a.name} [{a.status.toUpperCase()}] {a.allocatedTo ? `(Holder: ${a.allocatedTo})` : ""}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  💡 Tip: Choose <strong>AF-0001 (MacBook Pro)</strong> to trigger the rejection alert. Choose <strong>AF-0004 (Projector)</strong> for successful direct allocation.
                </div>
              </div>

              <div>
                <label className="form-label">Target Employee</label>
                <input type="text" className="form-input" value={targetUser} onChange={(e) => setTargetUser(e.target.value)} required />
              </div>

              <div>
                <label className="form-label">Target Department</label>
                <input type="text" className="form-input" value={targetDept} onChange={(e) => setTargetDept(e.target.value)} required />
              </div>

              <div>
                <label className="form-label">Allocation Notes</label>
                <textarea className="form-textarea" rows={2} value={allocNotes} onChange={(e) => setAllocNotes(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: "12px", fontSize: "0.95rem" }}>
                Execute Direct Allocation (`POST /allocation`)
              </button>
            </form>
          </div>

          {/* Right Column: Active Allocated Assets Summary */}
          <div className="glass-card">
            <h3 style={{ fontSize: "1.2rem", marginBottom: "14px" }}>Currently Allocated Assets (`status = Allocated`)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "480px", overflowY: "auto" }}>
              {assets
                .filter((a) => a.status === "Allocated")
                .map((a) => (
                  <div key={a.id} style={{ padding: "12px 14px", background: "var(--bg-app)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontFamily: "Fira Code", fontWeight: 700, color: "var(--purple)", fontSize: "0.8rem" }}>{a.tag}</span>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>{a.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>Holder: <strong>{a.allocatedTo}</strong> ({a.department})</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenTransferModal(a)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.75rem", padding: "6px 10px" }}
                    >
                      Request Transfer →
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: RETURN ASSET (`POST /return`) --- */}
      {activeTab === "returns" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem" }}>Return Asset (`POST /return`)</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Fields: `Condition`, `Notes` | After approval: `Asset Status → Available`
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset Tag & Name</th>
                  <th>Current Holder</th>
                  <th>Department</th>
                  <th>Condition</th>
                  <th style={{ textAlign: "right" }}>Return Action (`POST /return`)</th>
                </tr>
              </thead>
              <tbody>
                {assets
                  .filter((a) => a.status === "Allocated" || a.status === "Under Maintenance")
                  .map((a) => (
                    <tr key={a.id}>
                      <td>
                        <span style={{ fontFamily: "Fira Code", fontWeight: 700, color: "var(--primary)", fontSize: "0.82rem" }}>{a.tag}</span>
                        <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{a.name}</div>
                      </td>
                      <td>{a.allocatedTo || "Maintenance Tech"}</td>
                      <td>{a.department}</td>
                      <td><span className="badge badge-info">{a.condition}</span></td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => {
                            setReturnAssetId(a.id);
                            setShowReturnModal(true);
                          }}
                          className="btn btn-success btn-sm"
                        >
                          <RotateCcw size={14} /> Process Return to Available
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transfer Request Modal (`POST /transfer`) */}
      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "520px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>Submit Transfer Request (`POST /transfer`)</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "18px" }}>
              Fields: `From`, `To`, `Reason` | Requires approval by Asset Manager or Department Head.
            </p>

            <form onSubmit={handleTransferSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Asset Tag & Name</label>
                <input type="text" className="form-input" value={transferAssetId} disabled style={{ opacity: 0.7 }} />
              </div>

              <div>
                <label className="form-label">From (Current Holder/Location)</label>
                <input type="text" className="form-input" value={transferFrom} onChange={(e) => setTransferFrom(e.target.value)} required />
              </div>

              <div>
                <label className="form-label">To (Target Recipient / Department)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Neha Singh (IT & Infrastructure)"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Reason for Transfer</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="State the technical or business justification..."
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTransferModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Transfer Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Modal (`POST /return`) */}
      {showReturnModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "480px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>Return Asset (`POST /return`)</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "18px" }}>
              Fields: `Condition`, `Notes` | Upon commit, Asset Status transitions back to `Available`.
            </p>

            <form onSubmit={handleReturnSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Return Condition</label>
                <select className="form-select" value={returnCondition} onChange={(e) => setReturnCondition(e.target.value)}>
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>

              <div>
                <label className="form-label">Return Notes & Inspection</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Notes regarding cables, chargers, clean operating condition..."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowReturnModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Confirm Return & Set Available
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
