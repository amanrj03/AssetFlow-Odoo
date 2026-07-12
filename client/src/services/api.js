// API Client for AssetFlow Backend with seamless Mock Fallback support
const API_BASE_URL = "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("assetflow_token") || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("assetflow_token", token);
    } else {
      localStorage.removeItem("assetflow_token");
    }
  }

  async request(endpoint, options = {}) {
    const hasValidToken = this.token && this.token !== "undefined" && this.token !== "null";
    const headers = {
      "Content-Type": "application/json",
      ...(hasValidToken ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }
      return data;
    } catch (error) {
      // If server is offline or route not found, rethrow so context can use simulation fallback
      throw error;
    }
  }

  // Auth Routes
  login(credentials) { return this.request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }); }
  signup(data) { return this.request("/auth/signup", { method: "POST", body: JSON.stringify(data) }); }
  logout() { return this.request("/auth/logout", { method: "POST" }); }
  getMe() { return this.request("/auth/me"); }

  // Dashboard Route
  getDashboard() { return this.request("/dashboard"); }

  // Departments Routes
  getDepartments() { return this.request("/departments"); }
  createDepartment(data) { return this.request("/departments", { method: "POST", body: JSON.stringify(data) }); }
  updateDepartment(id, data) { return this.request(`/departments/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
  assignDepartmentHead(id, headId) { return this.request(`/departments/${id}/head`, { method: "PATCH", body: JSON.stringify({ headId }) }); }
  deleteDepartment(id) { return this.request(`/departments/${id}`, { method: "DELETE" }); }

  // Categories Routes
  getCategories() { return this.request("/categories"); }
  createCategory(data) { return this.request("/categories", { method: "POST", body: JSON.stringify(data) }); }
  updateCategory(id, data) { return this.request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
  deleteCategory(id) { return this.request(`/categories/${id}`, { method: "DELETE" }); }

  // Employees Routes
  getEmployees() { return this.request("/employees"); }
  getEmployee(id) { return this.request(`/employees/${id}`); }
  promoteEmployee(id, role) { return this.request(`/employees/${id}/promote`, { method: "PATCH", body: JSON.stringify({ role }) }); }
  updateEmployeeStatus(id, status) { return this.request(`/employees/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); }

  // Assets Routes
  getAssets() { return this.request("/assets"); }
  getAsset(id) { return this.request(`/assets/${id}`); }
  createAsset(data) { return this.request("/assets", { method: "POST", body: JSON.stringify(data) }); }
  updateAsset(id, data) { return this.request(`/assets/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
  deleteAsset(id) { return this.request(`/assets/${id}`, { method: "DELETE" }); }

  // Allocation Routes
  allocateAsset(data) { return this.request("/allocation", { method: "POST", body: JSON.stringify(data) }); }
  transferAsset(data) { return this.request("/transfer", { method: "POST", body: JSON.stringify(data) }); }
  returnAsset(data) { return this.request("/return", { method: "POST", body: JSON.stringify(data) }); }
  getAllocationHistory(assetId) { return this.request(`/allocation/history/${assetId}`); }

  // Booking Routes
  getBookings() { return this.request("/bookings"); }
  createBooking(data) { return this.request("/bookings", { method: "POST", body: JSON.stringify(data) }); }
  updateBooking(id, data) { return this.request(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
  deleteBooking(id) { return this.request(`/bookings/${id}`, { method: "DELETE" }); }

  // Maintenance Routes
  getMaintenances() { return this.request("/maintenance"); }
  createMaintenance(data) { return this.request("/maintenance", { method: "POST", body: JSON.stringify(data) }); }

  // Audit Routes
  getAuditCycles() { return this.request("/audits"); }
  createAuditCycle(data) { return this.request("/audits", { method: "POST", body: JSON.stringify(data) }); }

  // Reports Routes
  getReport(type) { return this.request(`/reports/${type}`); }

  // Notifications Routes
  getNotifications() { return this.request("/notifications"); }
  markNotificationRead(id) { return this.request(`/notifications/${id}/read`, { method: "PATCH" }); }
  markAllNotificationsRead() { return this.request("/notifications/read-all", { method: "PATCH" }); }

  // Activity Logs Routes
  getActivityLogs() { return this.request("/activity-logs"); }
}

export const api = new ApiService();
