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
        setCategories(res.data.categories || res.data);
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
        setAssets(res.data.assets || res.data);
      }
    } catch (e) {
      console.error("fetchAssets error:", e);
    }
  };

  const fetchTransferRequests = async () => {
    try {
      const res = await api.request("/transfers");
      if (res && res.success && res.data) {
        setTransferRequests(res.data.transfers || res.data);
      }
    } catch (e) {
      console.error("fetchTransferRequests error:", e);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.getBookings();
      if (res && res.success && res.data) {
        setBookings(res.data.bookings || res.data);
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

  const createCategory = async (catData) => {
    const res = await api.createCategory(catData);
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
