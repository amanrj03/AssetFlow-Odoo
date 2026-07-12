import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useERP } from "../context/ERPContext";
import {
  Building2,
  Layers,
  Users,
  Plus,
  Trash2,
  Edit2,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
  Tag,
  Settings,
} from "lucide-react";

export const Screen3_OrgSetup = () => {
  const { user } = useAuth();
  const {
    departments,
    categories,
    employees,
    fetchDepartments,
    fetchCategories,
    fetchEmployees,
    createDepartment,
    deleteDepartment,
    createCategory,
    deleteCategory,
    promoteEmployee,
    toggleEmployeeStatus,
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState("departments");
  const isAdmin = user?.role === "ADMIN";

  // New Department Form State
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptParent, setDeptParent] = useState("Executive & Admin");
  const [deptHead, setDeptHead] = useState("Vikram Malhotra");

  // New Category Form State
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catCode, setCatCode] = useState("");
  const [catMetaKey1, setCatMetaKey1] = useState("Warranty");
  const [catMetaExample1, setCatMetaExample1] = useState("3 Years");
  const [catMetaKey2, setCatMetaKey2] = useState("Voltage");
  const [catMetaExample2, setCatMetaExample2] = useState("220V AC");

  // Fetch lists on screen mount
  React.useEffect(() => {
    fetchDepartments();
    fetchCategories();
    fetchEmployees();
  }, []);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!deptName) return;
    try {
      const res = await createDepartment({
        name: deptName,
        parentDepartment: deptParent,
        head: deptHead,
      });
      if (res && res.success) {
        setShowDeptModal(false);
        setDeptName("");
      } else {
        alert(res?.message || "Failed to create department");
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    }
  };

  const handleDeleteDepartment = async (id, name) => {
    if (!isAdmin) return;
    if (window.confirm(`Are you sure you want to delete department: ${name}?`)) {
      try {
        const res = await deleteDepartment(id);
        if (res && !res.success) {
          alert(res.message || "Failed to delete department");
        }
      } catch (err) {
        alert(err.message || "An error occurred");
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName || !catCode) return;
    try {
      const res = await createCategory({
        name: catName,
        code: catCode.toUpperCase(),
        description: `Custom category: ${catName}`,
        metadataSchema: [
          { key: catMetaKey1 || "Field 1", type: "string", example: catMetaExample1 || "Example 1" },
          { key: catMetaKey2 || "Field 2", type: "string", example: catMetaExample2 || "Example 2" },
        ],
      });
      if (res && res.success) {
        setShowCatModal(false);
        setCatName("");
        setCatCode("");
      } else {
        alert(res?.message || "Failed to create category");
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category: ${name}?`)) {
      try {
        const res = await deleteCategory(id);
        if (res && !res.success) {
          alert(res.message || "Failed to delete category");
        }
      } catch (err) {
        alert(err.message || "An error occurred");
      }
    }
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span className="badge badge-coral">ORG & RBAC</span>
            <span className="badge badge-neutral">Hierarchy & Directory</span>
          </div>
          <h1 className="page-title">Organization Architecture & Setup</h1>
          <p className="page-subtitle">
            Manage company departments, asset metadata schemas, and employee role progression.
          </p>
        </div>

        {!isAdmin && (
          <div style={{ padding: "12px 18px", borderRadius: "var(--radius-lg)", background: "var(--bg-peach-light)", border: "1px solid rgba(224, 82, 48, 0.3)", display: "flex", alignItems: "center", gap: "10px", color: "var(--coral)", maxWidth: "440px" }}>
            <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "0.82rem", lineHeight: 1.4 }}>
              <strong>Admin Access Notice:</strong> Full CRUD department creation is restricted to Admin. You are currently browsing as <strong>{user?.role}</strong>.
            </div>
          </div>
        )}
      </div>

      {/* Module Sub-Tabs (`Sleek rounded glass pill bar`) */}
      <div className="sub-pill-bar">
        <button
          className={`tab-btn ${activeSubTab === "departments" ? "active" : ""}`}
          onClick={() => setActiveSubTab("departments")}
        >
          <Building2 size={16} />
          <span>Company Departments</span>
        </button>
        <button
          className={`tab-btn ${activeSubTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveSubTab("categories")}
        >
          <Layers size={16} />
          <span>Metadata Categories</span>
        </button>
        <button
          className={`tab-btn ${activeSubTab === "employees" ? "active" : ""}`}
          onClick={() => setActiveSubTab("employees")}
        >
          <Users size={16} />
          <span>Employee Directory & Roles</span>
        </button>
      </div>

      {/* --- SUB-TAB 1: DEPARTMENTS --- */}
      {activeSubTab === "departments" && (
        <div className="bento-card" style={{ padding: "28px", borderRadius: "var(--radius-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Company Departments</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Hierarchical department tree with assigned asset allocation limits and department heads.
              </p>
            </div>
            {isAdmin && (
              <button className="btn btn-coral" style={{ padding: "10px 20px" }} onClick={() => setShowDeptModal(true)}>
                <Plus size={16} />
                <span>Add Department</span>
              </button>
            )}
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Parent Department</th>
                  <th>Department Head</th>
                  <th>Assets Assigned</th>
                  <th>Status</th>
                  {isAdmin && <th style={{ textAlign: "right" }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{d.parentDepartment}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>
                          {d.head.charAt(0)}
                        </div>
                        <span>{d.head}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{d.assetCount} assets</span></td>
                    <td>
                      <span className={`badge ${d.status === "ACTIVE" ? "badge-success" : "badge-danger"}`}>
                        {d.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => handleDeleteDepartment(d.id, d.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                          title="DELETE /departments/:id"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: CATEGORIES (`GET, POST, PUT, DELETE` + Custom Metadata) --- */}
      {activeSubTab === "categories" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem" }}>Asset Categories & Custom Metadata Schemas</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Supports custom metadata keys (e.g. Electronics: Warranty, Voltage, Brand | Furniture: Material, Weight)
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCatModal(true)}>
              <Plus size={16} />
              <span>Add Category & Schema</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
            {categories.map((c) => (
              <div key={c.id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <span className="badge badge-info" style={{ marginBottom: "6px" }}>Code: {c.code}</span>
                      <h4 style={{ fontSize: "1.2rem" }}>{c.name}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                      title="DELETE /categories/:id"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "16px" }}>{c.description}</p>

                  <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Settings size={13} /> Custom Metadata Keys Supported (`POST /assets` check)
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {c.metadataSchema.map((field, idx) => (
                        <div key={idx} style={{ padding: "6px 10px", borderRadius: "var(--radius-sm)", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-color)", fontSize: "0.78rem" }}>
                          <strong style={{ color: "var(--text-main)" }}>{field.key}:</strong> <span style={{ color: "var(--text-muted)" }}>({field.example})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <span>✓ Metadata auto-applied</span>
                  <span>GET/PUT/DELETE ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUB-TAB 3: EMPLOYEES (`GET /employees`, `PATCH Promote`, `PATCH Status`) --- */}
      {activeSubTab === "employees" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem" }}>Employee Directory & Role Promotion</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Admin promotes progression hierarchy: `Employee → Department Head → Asset Manager → Admin`
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span className="badge badge-purple">Admin Controls Active</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Promote (`PATCH Promote`)</th>
                  <th>Status Toggle (`PATCH Status`)</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 600 }}>{emp.name}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{emp.email}</td>
                    <td>
                      <span className={`badge ${emp.role === "ADMIN" ? "badge-purple" : emp.role === "ASSET_MANAGER" ? "badge-info" : emp.role === "DEPARTMENT_HEAD" ? "badge-warning" : "badge-success"}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td>{emp.department}</td>
                    <td>
                      <span className={`badge ${emp.status === "ACTIVE" ? "badge-success" : "badge-danger"}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          disabled={!isAdmin || emp.role === "ADMIN"}
                          onClick={() => {
                            const nextRole =
                              emp.role === "EMPLOYEE"
                                ? "DEPARTMENT_HEAD"
                                : emp.role === "DEPARTMENT_HEAD"
                                ? "ASSET_MANAGER"
                                : "ADMIN";
                            promoteEmployee(emp.id, nextRole);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{
                            opacity: !isAdmin || emp.role === "ADMIN" ? 0.4 : 1,
                            cursor: !isAdmin || emp.role === "ADMIN" ? "not-allowed" : "pointer",
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                            borderColor: "rgba(99, 102, 241, 0.3)",
                          }}
                          title="Promote according to specification progression"
                        >
                          <ArrowUpRight size={14} />
                          <span>Promote Role</span>
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        disabled={!isAdmin}
                        onClick={() => toggleEmployeeStatus(emp.id)}
                        className={`btn btn-sm ${emp.status === "ACTIVE" ? "btn-secondary" : "btn-success"}`}
                        style={{ opacity: !isAdmin ? 0.4 : 1 }}
                      >
                        {emp.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDeptModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "460px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>Add Department (`POST /departments`)</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "18px" }}>
              Only Admin can create or delete departments (`name`, `parentDepartment`, `head`, `status`).
            </p>

            <form onSubmit={handleCreateDepartment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Department Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Cybersecurity & Auditing"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Parent Department</label>
                <select className="form-select" value={deptParent} onChange={(e) => setDeptParent(e.target.value)}>
                  <option value="Executive & Admin">Executive & Admin</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                </select>
              </div>

              <div>
                <label className="form-label">Department Head</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Vikram Malhotra"
                  value={deptHead}
                  onChange={(e) => setDeptHead(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeptModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "500px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>Add Category & Schema (`POST /categories`)</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "18px" }}>
              Define custom metadata keys that assets under this category will track.
            </p>

            <form onSubmit={handleCreateCategory} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Drone & Robotics Fleet"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Category Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. DRON"
                  value={catCode}
                  onChange={(e) => setCatCode(e.target.value)}
                  required
                />
              </div>

              <div style={{ padding: "12px", background: "var(--bg-app)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "10px" }}>Custom Metadata Schema Definition</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                  <input type="text" className="form-input" placeholder="Field 1 Key (e.g. Range)" value={catMetaKey1} onChange={(e) => setCatMetaKey1(e.target.value)} />
                  <input type="text" className="form-input" placeholder="Example (e.g. 15 km)" value={catMetaExample1} onChange={(e) => setCatMetaExample1(e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <input type="text" className="form-input" placeholder="Field 2 Key (e.g. Battery)" value={catMetaKey2} onChange={(e) => setCatMetaKey2(e.target.value)} />
                  <input type="text" className="form-input" placeholder="Example (e.g. 6800 mAh)" value={catMetaExample2} onChange={(e) => setCatMetaExample2(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCatModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category Schema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
