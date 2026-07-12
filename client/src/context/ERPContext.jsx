import React, { createContext, useState, useContext } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

const ERPContext = createContext();

export const ERPProvider = ({ children }) => {
  const { user } = useAuth();

  // ERP States
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [transferRequests, setTransferRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [auditCycles, setAuditCycles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch functions for page-level retrieval
  const fetchDepartments = async () => {
    try {
      const res = await api.getDepartments();
      if (res && res.success && res.data) {
        setDepartments(res.data.departments || res.data);
      }
    } catch (e) {
      console.error("fetchDepartments error:", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res && res.success && res.data) {
        const rawCats = res.data.categories || res.data;
        const mapped = rawCats.map((c) => {
          let fields = {};
          if (c.customFields) {
            try {
              fields = typeof c.customFields === "string" ? JSON.parse(c.customFields) : c.customFields;
            } catch (e) {
              fields = {};
            }
          }
          return {
            ...c,
            code: fields.code || c.name.substring(0, 4).toUpperCase(),
            metadataSchema: fields.metadataSchema || [],
          };
        });
        setCategories(mapped);
      }
    } catch (e) {
      console.error("fetchCategories error:", e);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.getEmployees();
      if (res && res.success && res.data) {
        setEmployees(res.data.employees || res.data);
      }
    } catch (e) {
      console.error("fetchEmployees error:", e);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await api.getAssets();
      if (res && res.success && res.data) {
        const rawAssets = res.data.assets || res.data;
        const mapped = rawAssets.map((a) => {
          let catName = "Electronics";
          if (a.category) {
            catName = typeof a.category === "object" ? a.category.name : a.category;
          }

          let deptName = "None";
          if (a.department) {
            deptName = typeof a.department === "object" ? a.department.name : a.department;
          }

          let conditionStr = "Good";
          if (a.condition) {
            if (a.condition === "EXCELLENT") conditionStr = "New";
            else if (a.condition === "GOOD") conditionStr = "Good";
            else if (a.condition === "FAIR" || a.condition === "POOR") conditionStr = "Needs Repair";
            else conditionStr = a.condition;
          }

          let statusStr = "Available";
          if (a.status) {
            if (a.status === "AVAILABLE") statusStr = "Available";
            else if (a.status === "ALLOCATED") statusStr = "Allocated";
            else if (a.status === "UNDER_MAINTENANCE") statusStr = "Under Maintenance";
            else if (a.status === "LOST" || a.status === "RETIRED") statusStr = "Lost";
            else statusStr = a.status;
          }

          return {
            ...a,
            tag: a.assetTag || `AF-${a.id.substring(0, 4).toUpperCase()}`,
            photo: a.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80",
            category: catName,
            department: deptName,
            condition: conditionStr,
            status: statusStr,
            purchaseCost: a.purchaseCost || 0,
            serialNumber: a.serialNumber || "N/A",
            location: a.location || "N/A",
            allocatedTo: a.allocations && a.allocations.length > 0 ? (a.allocations[0].employee ? a.allocations[0].employee.name : null) : null,
          };
        });
        setAssets(mapped);
      }
    } catch (e) {
      console.error("fetchAssets error:", e);
    }
  };

  const fetchTransferRequests = async () => {
    try {
      const res = await api.request("/transfers");
      if (res && res.success && res.data) {
        const rawTransfers = res.data.transfers || res.data;
        const mapped = rawTransfers.map((req) => {
          let statusStr = req.status;
          if (req.status === "PENDING") statusStr = "Pending";
          else if (req.status === "APPROVED") statusStr = "Approved";
          else if (req.status === "REJECTED") statusStr = "Rejected";

          return {
            ...req,
            assetTag: req.asset ? req.asset.assetTag : "N/A",
            assetName: req.asset ? req.asset.name : "N/A",
            from: req.fromEmployee ? req.fromEmployee.name : (req.from || "None"),
            to: req.toEmployee ? req.toEmployee.name : (req.to || "None"),
            status: statusStr,
            approvedBy: req.approvedBy ? req.approvedBy.name : null,
          };
        });
        setTransferRequests(mapped);
      }
    } catch (e) {
      console.error("fetchTransferRequests error:", e);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.getBookings();
      if (res && res.success && res.data) {
        const rawBookings = res.data.bookings || res.data;
        const mapped = rawBookings.map((bk) => {
          let empName = "System";
          if (bk.bookedBy) {
            empName = typeof bk.bookedBy === "object" ? bk.bookedBy.name : bk.bookedBy;
          } else if (bk.employee) {
            empName = typeof bk.employee === "object" ? bk.employee.name : bk.employee;
          }
          
          let statusStr = bk.status;
          if (bk.status === "UPCOMING") statusStr = "Upcoming";
          else if (bk.status === "ONGOING") statusStr = "Ongoing";
          else if (bk.status === "COMPLETED") statusStr = "Completed";
          else if (bk.status === "CANCELLED") statusStr = "Cancelled";

          return {
            ...bk,
            employee: empName,
            status: statusStr,
          };
        });
        setBookings(mapped);
      }
    } catch (e) {
      console.error("fetchBookings error:", e);
    }
  };

  const fetchMaintenances = async () => {
    try {
      const res = await api.getMaintenances();
      if (res && res.success && res.data) {
        setMaintenances(res.data.maintenances || res.data);
      }
    } catch (e) {
      console.error("fetchMaintenances error:", e);
    }
  };

  const fetchAuditCycles = async () => {
    try {
      const res = await api.getAuditCycles();
      if (res && res.success && res.data) {
        setAuditCycles(res.data.auditCycles || res.data);
      }
    } catch (e) {
      console.error("fetchAuditCycles error:", e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res && res.success && res.data) {
        setNotifications(res.data.notifications || res.data);
      }
    } catch (e) {
      console.error("fetchNotifications error:", e);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const res = await api.getActivityLogs();
      if (res && res.success && res.data) {
        setActivityLogs(res.data.logs || res.data);
      }
    } catch (e) {
      console.error("fetchActivityLogs error:", e);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const res = await api.getDashboard();
      if (res && res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (e) {
      console.error("fetchDashboardData error:", e);
    }
  };

  // Actions connecting React forms to Backend REST APIs
  const createDepartment = async (deptData) => {
    const res = await api.createDepartment(deptData);
    if (res && res.success) {
      await fetchDepartments();
    }
    return res;
  };

  const updateDepartment = async (id, deptData) => {
    const res = await api.updateDepartment(id, deptData);
    if (res && res.success) {
      await fetchDepartments();
    }
    return res;
  };

  const deleteDepartment = async (id) => {
    const res = await api.deleteDepartment(id);
    if (res && res.success) {
      await fetchDepartments();
    }
    return res;
  };

  const assignDepartmentHead = async (id, headId) => {
    const res = await api.assignDepartmentHead(id, headId);
    if (res && res.success) {
      await fetchDepartments();
      await fetchEmployees(); // Fetch employees to reflect updated roles!
    }
    return res;
  };

  const createCategory = async (catData) => {
    const payload = {
      name: catData.name,
      description: catData.description || `Custom category: ${catData.name}`,
      customFields: {
        code: catData.code,
        metadataSchema: catData.metadataSchema,
      },
    };
    const res = await api.createCategory(payload);
    if (res && res.success) {
      await fetchCategories();
    }
    return res;
  };

  const updateCategory = async (id, catData) => {
    const res = await api.updateCategory(id, catData);
    if (res && res.success) {
      await fetchCategories();
    }
    return res;
  };

  const deleteCategory = async (id) => {
    const res = await api.deleteCategory(id);
    if (res && res.success) {
      await fetchCategories();
    }
    return res;
  };

  const generateNextTag = () => {
    const numbers = assets.map((a) => {
      const tagString = a.assetTag || a.tag || "";
      const parts = tagString.split("-");
      return parseInt(parts[1] || "0", 10);
    });
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNum = maxNum + 1;
    return `AF-${String(nextNum).padStart(6, "0")}`;
  };

  const createAsset = async (newAssetData) => {
    let payload;
    let isMultipart = false;

    // Check if newAssetData is FormData (media uploads)
    if (newAssetData instanceof FormData) {
      payload = newAssetData;
      isMultipart = true;
    } else {
      payload = {
        name: newAssetData.name,
        categoryId: newAssetData.categoryId,
        departmentId: newAssetData.departmentId,
        serialNumber: newAssetData.serialNumber,
        purchaseCost: parseFloat(newAssetData.purchaseCost || 0),
        location: newAssetData.location,
        isBookable: newAssetData.isBookable || false,
      };
    }

    const res = await api.request("/assets", {
      method: "POST",
      headers: isMultipart ? {} : { "Content-Type": "application/json" },
      body: isMultipart ? payload : JSON.stringify(payload),
    });

    if (res && res.success) {
      await fetchAssets();
    }
    return res;
  };

  const updateAsset = async (id, assetData) => {
    const res = await api.updateAsset(id, assetData);
    if (res && res.success) {
      await fetchAssets();
    }
    return res;
  };

  const deleteAsset = async (id) => {
    const res = await api.deleteAsset(id);
    if (res && res.success) {
      await fetchAssets();
    }
    return res;
  };

  const allocateAsset = async (assetId, employeeId, expectedReturnDate, notes = "") => {
    const res = await api.allocateAsset({ assetId, employeeId, expectedReturnDate, notes });
    if (res && res.success) {
      await fetchAssets();
    }
    return res;
  };

  const requestTransfer = async ({ assetId, toEmployeeId, reason }) => {
    const res = await api.transferAsset({ assetId, toEmployeeId, reason });
    if (res && res.success) {
      await fetchTransferRequests();
    }
    return res;
  };

  const processTransferRequest = async (reqId, status) => {
    const action = status.toLowerCase() === "approved" ? "approve" : "reject";
    const res = await api.request(`/transfers/${reqId}/${action}`, { method: "PATCH" });
    if (res && res.success) {
      await fetchTransferRequests();
      await fetchAssets();
    }
    return res;
  };

  const returnAsset = async ({ assetId, condition, notes }) => {
    const res = await api.returnAsset({ assetId, condition, notes });
    if (res && res.success) {
      await fetchAssets();
    }
    return res;
  };

  const createBooking = async ({ assetId, startTime, endTime, purpose }) => {
    const res = await api.createBooking({ assetId, startTime, endTime, purpose });
    if (res && res.success) {
      await fetchBookings();
    }
    return res;
  };

  const deleteBooking = async (id) => {
    const res = await api.deleteBooking(id);
    if (res && res.success) {
      await fetchBookings();
    }
    return res;
  };

  const raiseMaintenance = async ({ assetId, issue, priority }) => {
    const res = await api.createMaintenance({ assetId, issue, priority });
    if (res && res.success) {
      await fetchMaintenances();
      await fetchAssets();
    }
    return res;
  };

  const updateMaintenanceStatus = async (ticketId, newStatus, technicianName, cost, notes) => {
    let res;
    if (newStatus === "Approved") {
      res = await api.request(`/maintenance/${ticketId}/approve`, { method: "PATCH" });
    } else if (newStatus === "Technician Assigned") {
      res = await api.request(`/maintenance/${ticketId}/assign`, {
        method: "PATCH",
        body: JSON.stringify({ technician: technicianName }),
      });
    } else if (newStatus === "In Progress") {
      res = await api.request(`/maintenance/${ticketId}/start`, { method: "PATCH" });
    } else if (newStatus === "Resolved") {
      res = await api.request(`/maintenance/${ticketId}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({ cost: parseFloat(cost || 0), notes }),
      });
    }

    if (res && res.success) {
      await fetchMaintenances();
      await fetchAssets();
    }
    return res;
  };

  const promoteEmployee = async (empId, targetRole) => {
    const res = await api.promoteEmployee(empId, targetRole);
    if (res && res.success) {
      await fetchEmployees();
    }
    return res;
  };

  const toggleEmployeeStatus = async (empId, currentStatus) => {
    let status = currentStatus;
    if (!status) {
      const emp = employees.find((e) => e.id === empId);
      status = emp ? emp.status : "ACTIVE";
    }
    const nextStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const res = await api.updateEmployeeStatus(empId, nextStatus);
    if (res && res.success) {
      await fetchEmployees();
    }
    return res;
  };

  const markNotificationRead = async (id) => {
    const res = await api.markNotificationRead(id);
    if (res && res.success) {
      await fetchNotifications();
    }
    return res;
  };

  const markAllNotificationsRead = async () => {
    const res = await api.markAllNotificationsRead();
    if (res && res.success) {
      await fetchNotifications();
    }
    return res;
  };

  return (
    <ERPContext.Provider
      value={{
        departments,
        categories,
        employees,
        assets,
        transferRequests,
        bookings,
        maintenances,
        auditCycles,
        notifications,
        activityLogs,
        dashboardData,
        fetchDepartments,
        fetchCategories,
        fetchEmployees,
        fetchAssets,
        fetchTransferRequests,
        fetchBookings,
        fetchMaintenances,
        fetchAuditCycles,
        fetchNotifications,
        fetchActivityLogs,
        fetchDashboardData,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        assignDepartmentHead,
        createCategory,
        updateCategory,
        deleteCategory,
        generateNextTag,
        createAsset,
        updateAsset,
        deleteAsset,
        allocateAsset,
        requestTransfer,
        processTransferRequest,
        returnAsset,
        createBooking,
        deleteBooking,
        raiseMaintenance,
        updateMaintenanceStatus,
        promoteEmployee,
        toggleEmployeeStatus,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => useContext(ERPContext);
