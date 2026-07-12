import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  Box,
  Search,
  Filter,
  Plus,
  QrCode,
  History,
  Wrench,
  Tag,
  MapPin,
  DollarSign,
  Calendar,
  Share2,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
} from "lucide-react";

export const Screen4_Assets = () => {
  const { user } = useAuth();
  const {
    assets,
    categories,
    departments,
    fetchAssets,
    fetchCategories,
    fetchDepartments,
    createAsset,
    deleteAsset,
    generateNextTag,
  } = useERP();

  // Fetch lists on screen mount
  React.useEffect(() => {
    fetchAssets();
    fetchCategories();
    fetchDepartments();
  }, []);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [filterLocation, setFilterLocation] = useState("ALL");

  // Selected Asset Drawer/Modal State for History & Details
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState("details"); // "details" | "allocations" | "maintenance"

  // Dynamic history states
  const [allocationHistory, setAllocationHistory] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  React.useEffect(() => {
    if (!selectedAsset) return;
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        if (activeDrawerTab === "allocations") {
          const res = await api.request(`/allocation/history/${selectedAsset.id}`);
          if (res && res.success) {
            setAllocationHistory(res.data || []);
          }
        } else if (activeDrawerTab === "maintenance") {
          const res = await api.request(`/maintenance?assetId=${selectedAsset.id}`);
          if (res && res.success) {
            setMaintenanceHistory(res.data.maintenances || res.data || []);
          }
        }
      } catch (err) {
        console.error("Error fetching asset history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [selectedAsset, activeDrawerTab]);

  // Create Asset Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    serialNumber: "",
    purchaseCost: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    location: "HQ - Floor 4 (Eng Wing)",
    department: "",
    condition: "New",
    shared: false,
    photo: "",
    customMetadata: { Warranty: "3 Years Standard", Voltage: "220V", Brand: "" },
  });

  React.useEffect(() => {
    if (showAddModal) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0]?.name || "Electronics",
        department: departments[0]?.name || "R&D & Engineering"
      }));
    }
  }, [showAddModal, categories, departments]);


  const nextTagPreview = generateNextTag();

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    try {
      const res = await createAsset(formData);
      if (res && res.success) {
        setShowAddModal(false);
        setFormData({
          name: "",
          category: "Electronics",
          serialNumber: "",
          purchaseCost: "",
          purchaseDate: new Date().toISOString().split("T")[0],
          location: "HQ - Floor 4 (Eng Wing)",
          department: "R&D & Engineering",
          condition: "New",
          shared: false,
          photo: "",
          customMetadata: { Warranty: "3 Years Standard", Voltage: "220V", Brand: "" },
        });
      } else {
        alert(res?.message || "Failed to create asset");
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    }
  };

  const handleDeleteAsset = async (id, tag, name) => {
    if (user?.role !== "ADMIN" && user?.role !== "ASSET_MANAGER") {
      alert("Permission denied: Only Admin or Asset Manager can delete assets (`CRUD` route permission).");
      return;
    }
    if (window.confirm(`Are you sure you want to delete asset ${tag} - ${name}?`)) {
      try {
        const res = await deleteAsset(id);
        if (res && res.success) {
          if (selectedAsset?.id === id) setSelectedAsset(null);
        } else {
          alert(res?.message || "Failed to delete asset");
        }
      } catch (err) {
        alert(err.message || "An error occurred");
      }
    }
  };

  // Filter logic
  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      searchTerm === "" ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.allocatedTo && a.allocatedTo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = filterCategory === "ALL" || a.category === filterCategory;
    const matchesStatus = filterStatus === "ALL" || a.status === filterStatus;
    const matchesDept = filterDepartment === "ALL" || a.department === filterDepartment;
    const matchesLoc = filterLocation === "ALL" || a.location.toLowerCase().includes(filterLocation.toLowerCase());

    return matchesSearch && matchesCat && matchesStatus && matchesDept && matchesLoc;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available": return "badge-success";
      case "Allocated": return "badge-purple";
      case "Under Maintenance": return "badge-warning";
      case "Lost": return "badge-danger";
      default: return "badge-neutral";
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "New": return "#10B981";
      case "Good": return "#F97316";
      case "Needs Repair": return "#F59E0B";
      default: return "#9CA3AF";
    }
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="badge badge-purple" style={{ fontSize: "0.75rem" }}>Asset Directory</span>
            <span className="badge badge-info" style={{ fontSize: "0.75rem" }}>Tag format: AF-0001 (Auto-generated)</span>
          </div>
          <h1 className="page-title" style={{ marginTop: "8px" }}>Asset Inventory & Lifecycle Tracker</h1>
          <p className="page-subtitle">
            Comprehensive directory with Tag (`AF-xxxx`), serial numbers, custom metadata, allocation history, and maintenance records.
          </p>
        </div>

        {(user?.role === "ADMIN" || user?.role === "ASSET_MANAGER") && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add New Asset (`POST /assets`)</span>
          </button>
        )}
      </div>

      {/* Filters & Search Bar */}
      <div className="glass-card" style={{ marginBottom: "24px", padding: "18px 24px" }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="search-input-wrapper" style={{ minWidth: "280px" }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="form-input"
              placeholder="Filter by Tag (AF-0001), Serial No, Name, QR code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="form-select" style={{ width: "auto" }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="ALL">Category: All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select className="form-select" style={{ width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">Status: All</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Lost">Lost</option>
          </select>

          <select className="form-select" style={{ width: "auto" }} value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="ALL">Department: All</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          {(filterCategory !== "ALL" || filterStatus !== "ALL" || filterDepartment !== "ALL" || searchTerm !== "") && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("ALL");
                setFilterStatus("ALL");
                setFilterDepartment("ALL");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Assets Grid & Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset Tag & Photo</th>
              <th>Asset Name & Category</th>
              <th>Serial Number & Cost</th>
              <th>Location & Department</th>
              <th>Condition</th>
              <th>Status / Holder</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.id} style={{ cursor: "pointer" }} onClick={() => setSelectedAsset(asset)}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img
                      src={asset.photo}
                      alt={asset.name}
                      style={{ width: "48px", height: "48px", borderRadius: "var(--radius-md)", objectFit: "cover", border: "1px solid var(--border-color)" }}
                    />
                    <div>
                      <span className="badge badge-purple" style={{ fontFamily: "Fira Code", fontWeight: 700, fontSize: "0.78rem" }}>
                        {asset.tag}
                      </span>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "3px", display: "flex", alignItems: "center", gap: "3px" }}>
                        <QrCode size={12} /> QR Ready
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-main)" }}>{asset.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{asset.category}</span>
                    {asset.shared && <span className="badge badge-info" style={{ fontSize: "0.62rem", padding: "1px 6px" }}>Shared</span>}
                  </div>
                </td>
                <td>
                  <div style={{ fontFamily: "Fira Code", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{asset.serialNumber}</div>
                  <div style={{ fontWeight: 600, color: "var(--text-main)", marginTop: "2px" }}>${asset.purchaseCost.toLocaleString()}</div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", color: "var(--text-main)" }}>
                    <MapPin size={13} style={{ color: "var(--primary)" }} /> {asset.location}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>{asset.department}</div>
                </td>
                <td>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      borderRadius: "99px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: "var(--bg-app)",
                      border: `1px solid ${getConditionColor(asset.condition)}`,
                      color: getConditionColor(asset.condition),
                    }}
                  >
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: getConditionColor(asset.condition) }}></span>
                    {asset.condition}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getStatusBadge(asset.status)}`}>{asset.status}</span>
                  {asset.allocatedTo && (
                    <div style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 500, marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <User size={13} /> {asset.allocatedTo}
                    </div>
                  )}
                </td>
                <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className="btn btn-secondary btn-sm"
                      title="View Details & History (`GET /assets/:id` & `/allocation/history/:id`)"
                    >
                      <Eye size={15} />
                    </button>
                    {(user?.role === "ADMIN" || user?.role === "ASSET_MANAGER") && (
                      <button
                        onClick={() => handleDeleteAsset(asset.id, asset.tag, asset.name)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                        title="DELETE /assets/:id"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Asset Details Drawer (`GET /assets/:id`, `/allocation/history/:assetId`) */}
      {selectedAsset && (
        <div className="modal-overlay" onClick={() => setSelectedAsset(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span className="badge badge-purple" style={{ fontFamily: "Fira Code", fontSize: "0.85rem" }}>
                    {selectedAsset.tag}
                  </span>
                  <span className={`badge ${getStatusBadge(selectedAsset.status)}`}>{selectedAsset.status}</span>
                </div>
                <h2 style={{ fontSize: "1.5rem", lineHeight: 1.2 }}>{selectedAsset.name}</h2>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                style={{ background: "var(--bg-app)", border: "1px solid var(--border-color)", borderRadius: "50%", width: "36px", height: "36px", color: "var(--text-main)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Asset Photo Header with QR Badge */}
            <div style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "20px", border: "1px solid var(--border-color)" }}>
              <img src={selectedAsset.photo} alt={selectedAsset.name} style={{ width: "100%", height: "220px", objectFit: "cover" }} />
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  background: "rgba(17, 24, 39, 0.85)",
                  backdropFilter: "blur(6px)",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                <QrCode size={18} style={{ color: "var(--primary)" }} />
                <span>Tag QR: {selectedAsset.tag}</span>
              </div>
            </div>

            {/* Drawer Tabs (`Sleek rounded glass pill bar`) */}
            <div className="sub-pill-bar">
              <button className={`tab-btn ${activeDrawerTab === "details" ? "active" : ""}`} onClick={() => setActiveDrawerTab("details")}>
                <FileText size={16} /> Details & Metadata
              </button>
              <button className={`tab-btn ${activeDrawerTab === "allocations" ? "active" : ""}`} onClick={() => setActiveDrawerTab("allocations")}>
                <History size={16} /> Allocation History
              </button>
              <button className={`tab-btn ${activeDrawerTab === "maintenance" ? "active" : ""}`} onClick={() => setActiveDrawerTab("maintenance")}>
                <Wrench size={16} /> Maintenance History
              </button>
            </div>

            {/* Tab 1: Details */}
            {activeDrawerTab === "details" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Serial Number</div>
                    <div style={{ fontWeight: 600, fontFamily: "Fira Code", marginTop: "2px" }}>{selectedAsset.serialNumber}</div>
                  </div>
                  <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Purchase Cost</div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--success)", marginTop: "2px" }}>${selectedAsset.purchaseCost.toLocaleString()}</div>
                  </div>
                  <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Department & Location</div>
                    <div style={{ fontWeight: 600, marginTop: "2px" }}>{selectedAsset.department}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{selectedAsset.location}</div>
                  </div>
                  <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Condition & Shared</div>
                    <div style={{ fontWeight: 600, marginTop: "2px", color: getConditionColor(selectedAsset.condition) }}>{selectedAsset.condition}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{selectedAsset.shared ? "Shared Pool Asset" : "Dedicated Asset"}</div>
                  </div>
                </div>

                {/* Custom Metadata Schema Fields */}
                <div style={{ background: "var(--bg-app)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <h4 style={{ fontSize: "0.9rem", marginBottom: "12px", color: "var(--text-main)" }}>Custom Category Metadata (`{selectedAsset.category}`)</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {Object.entries(selectedAsset.customMetadata || {}).map(([key, val]) => (
                      <div key={key} style={{ padding: "8px 10px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{key}</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Allocation History (`GET /allocation/history/:assetId`) */}
            {activeDrawerTab === "allocations" && (
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
                  Complete historical audit of users and departments holding <strong>{selectedAsset.tag}</strong>.
                </div>
                {loadingHistory ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                    Loading allocation history...
                  </div>
                ) : allocationHistory.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
                    No previous allocation history. Currently unassigned.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {allocationHistory.map((h) => (
                      <div key={h.id} style={{ padding: "14px", borderRadius: "var(--radius-md)", background: "var(--bg-app)", borderLeft: "4px solid var(--primary)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{h.employee?.name || "Unknown"}</span>
                          <span className="badge badge-info" style={{ fontSize: "0.7rem" }}>{h.employee?.department?.name || "Shared"}</span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                          Allocated: {h.allocatedDate ? new Date(h.allocatedDate).toLocaleDateString() : ""} {h.returnedDate ? `→ Returned: ${new Date(h.returnedDate).toLocaleDateString()}` : "(Current Holder)"}
                        </div>
                        {h.remarks && <div style={{ fontSize: "0.8rem", color: "var(--text-main)", marginTop: "6px", fontStyle: "italic" }}>"{h.remarks}"</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Maintenance History */}
            {activeDrawerTab === "maintenance" && (
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
                  Recorded maintenance repairs, firmware upgrades, and servicing costs.
                </div>
                {loadingHistory ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                    Loading maintenance history...
                  </div>
                ) : maintenanceHistory.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
                    No maintenance records for this asset. Operating smoothly!
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {maintenanceHistory.map((m) => (
                      <div key={m.id} style={{ padding: "14px", borderRadius: "var(--radius-md)", background: "var(--bg-app)", borderLeft: "4px solid var(--warning)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontWeight: 600 }}>{m.technician || "Internal Support"}</span>
                          <span className="badge badge-warning">${m.costEstimate || 0}</span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Date: {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-main)", marginTop: "6px" }}>{m.issue || m.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "580px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <h3 style={{ fontSize: "1.3rem" }}>Create New Asset (`POST /assets`)</h3>
              <span className="badge badge-purple">Automatic Tag: {nextTagPreview}</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "18px" }}>
              Enter asset attributes. The unique Tag ({nextTagPreview}) is generated automatically on commit.
            </p>

            <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Asset Name / Model</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MacBook Pro M3 Max 64GB"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Condition</label>
                  <select className="form-select" value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })}>
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Needs Repair">Needs Repair</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="form-label">Serial Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SN-882910"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Purchase Cost ($ USD)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="3450"
                    value={formData.purchaseCost}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="form-label">Department</label>
                  <select className="form-select" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Physical Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "14px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Create Asset with Tag {nextTagPreview}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
