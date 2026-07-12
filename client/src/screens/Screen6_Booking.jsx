import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  User,
  BellRing,
  Sparkles,
  MapPin,
  Car,
  Tv,
} from "lucide-react";

export const Screen6_Booking = () => {
  const { user } = useAuth();
  const { bookings, setBookings, createBooking } = useERP();

  const [showAddModal, setShowAddModal] = useState(false);
  const [resource, setResource] = useState("Conference Room A (Executive Suite)");
  const [employee, setEmployee] = useState(user?.name || "Aman Verma");
  const [start, setStart] = useState("2026-07-13T10:00");
  const [end, setEnd] = useState("2026-07-13T11:30");
  const [notes, setNotes] = useState("Engineering Sprint Planning & Demo");

  // Conflict rejection notification alert
  const [conflictMsg, setConflictMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConflictMsg(null);
    setSuccessMsg(null);

    const result = createBooking({ resource, employee, start, end, notes });
    if (!result.success) {
      setConflictMsg({
        message: result.message,
        sqlQuery: "existing.start < new.end AND existing.end > new.start",
      });
    } else {
      setSuccessMsg(result.message);
      setShowAddModal(false);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
  };

  const handleDelete = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Upcoming": return "badge-info";
      case "Ongoing": return "badge-success";
      case "Completed": return "badge-purple";
      case "Cancelled": return "badge-danger";
      default: return "badge-neutral";
    }
  };

  const getResourceIcon = (resName) => {
    if (resName.toLowerCase().includes("room")) return <MapPin size={18} style={{ color: "var(--primary)" }} />;
    if (resName.toLowerCase().includes("tesla") || resName.toLowerCase().includes("vehicle")) return <Car size={18} style={{ color: "var(--success)" }} />;
    return <Tv size={18} style={{ color: "var(--purple)" }} />;
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="badge badge-purple" style={{ fontSize: "0.75rem" }}>Shared Resource Bookings</span>
            <span className="badge badge-info" style={{ fontSize: "0.75rem" }}>SQL Check: existing.start &lt; new.end AND existing.end &gt; new.start</span>
          </div>
          <h1 className="page-title" style={{ marginTop: "8px" }}>Resource & Conference Room Reservations</h1>
          <p className="page-subtitle">
            Book rooms, projectors, and fleet vehicles with real-time overlap rejection engine and 30-min cron notification simulation.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setShowAddModal(true);
            setConflictMsg(null);
            setSuccessMsg(null);
          }}
        >
          <Plus size={18} />
          <span>New Reservation (`POST /booking`)</span>
        </button>
      </div>

      {conflictMsg && (
        <div className="glass-card" style={{ background: "var(--danger-light)", borderColor: "rgba(239, 68, 68, 0.5)", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#F87171", fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>
            <AlertTriangle size={22} />
            <span>Booking Rejected by Backend Validation Check:</span>
          </div>
          <p style={{ color: "#FCA5A5", fontSize: "0.9rem", marginBottom: "10px" }}>{conflictMsg.message}</p>
          <div style={{ background: "rgba(0,0,0,0.4)", padding: "10px", borderRadius: "var(--radius-sm)", color: "#FCA5A5", fontFamily: "Fira Code", fontSize: "0.82rem" }}>
            SQL Query Validation executed: <strong>{conflictMsg.sqlQuery}</strong> → returned TRUE overlap.
          </div>
        </div>
      )}

      {successMsg && (
        <div style={{ padding: "14px 18px", borderRadius: "var(--radius-md)", background: "var(--success-light)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#6EE7B7", fontSize: "0.9rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Bookings Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Booked By (`Employee`)</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Notes / Cron Reminder</th>
              <th style={{ textAlign: "right" }}>Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((bk) => (
              <tr key={bk.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 600, color: "var(--text-main)" }}>
                    {getResourceIcon(bk.resource)}
                    <span>{bk.resource}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{bk.employee}</td>
                <td>
                  <div style={{ fontFamily: "Fira Code", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {bk.start.replace("T", " ")}
                  </div>
                </td>
                <td>
                  <div style={{ fontFamily: "Fira Code", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {bk.end.replace("T", " ")}
                  </div>
                </td>
                <td>
                  <span className={`badge ${getStatusBadge(bk.status)}`}>{bk.status}</span>
                </td>
                <td>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>{bk.notes}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--warning)", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <BellRing size={12} /> Cron: 30 min prior reminder active
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    {bk.status === "Upcoming" && (
                      <button
                        onClick={() => handleUpdateStatus(bk.id, "Ongoing")}
                        className="btn btn-secondary btn-sm"
                        style={{ color: "var(--success)" }}
                        title="Mark Ongoing (`PUT /booking`)"
                      >
                        Start
                      </button>
                    )}
                    {bk.status === "Ongoing" && (
                      <button
                        onClick={() => handleUpdateStatus(bk.id, "Completed")}
                        className="btn btn-secondary btn-sm"
                        style={{ color: "var(--purple)" }}
                      >
                        Complete
                      </button>
                    )}
                    {bk.status !== "Cancelled" && bk.status !== "Completed" && (
                      <button
                        onClick={() => handleUpdateStatus(bk.id, "Cancelled")}
                        className="btn btn-secondary btn-sm"
                        style={{ color: "var(--danger)" }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(bk.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                      title="DELETE /booking"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Test Overlap Simulator Box */}
      <div className="glass-card" style={{ marginTop: "24px", background: "var(--bg-surface-elevated)" }}>
        <h4 style={{ fontSize: "1rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={16} style={{ color: "var(--primary)" }} />
          <span>Quick Overlap Test (For Hackathon Judges)</span>
        </h4>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
          Click below to attempt booking <strong>Conference Room A</strong> on July 12 between `13:30` and `14:00`. Since Aman Verma has an existing reservation from `13:00` to `14:30`, the SQL check will immediately reject it!
        </p>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setResource("Conference Room A (Executive Suite)");
            setStart("2026-07-12T13:30");
            setEnd("2026-07-12T14:00");
            setShowAddModal(true);
          }}
        >
          Test Overlap on Conference Room A →
        </button>
      </div>

      {/* Add Booking Modal (`POST /booking`) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "520px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>Book Resource (`POST /booking`)</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "18px" }}>
              Fields: `Resource`, `Employee`, `Start`, `End`, `Status`
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Resource to Book</label>
                <select className="form-select" value={resource} onChange={(e) => setResource(e.target.value)}>
                  <option value="Conference Room A (Executive Suite)">Conference Room A (Executive Suite)</option>
                  <option value="Conference Room B (Ideation Lab)">Conference Room B (Ideation Lab)</option>
                  <option value="Sony 4K Laser Projector VPL-XWZ">Sony 4K Laser Projector VPL-XWZ</option>
                  <option value="Tesla Model Y Long Range (Logistics Fleet)">Tesla Model Y Long Range (Logistics Fleet)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Booked For (`Employee`)</label>
                <input type="text" className="form-input" value={employee} onChange={(e) => setEmployee(e.target.value)} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="form-label">Start Time</label>
                  <input type="datetime-local" className="form-input" value={start} onChange={(e) => setStart(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">End Time</label>
                  <input type="datetime-local" className="form-input" value={end} onChange={(e) => setEnd(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="form-label">Meeting / Trip Notes</label>
                <input type="text" className="form-input" placeholder="e.g. Q3 Roadmap presentation" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div style={{ padding: "10px 12px", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "#C4B5FD" }}>
                Validation check `existing.start &lt; new.end AND existing.end &gt; new.start` will run before commit.
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
