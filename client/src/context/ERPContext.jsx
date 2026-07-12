import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

const ERPContext = createContext();

export const ERPProvider = ({ children }) => {
  const { user, demoMode } = useAuth();

  // 1. Departments State
  const [departments, setDepartments] = useState([
    { id: "dept-1", name: "R&D & Engineering", parentDepartment: "Executive & Admin", head: "Dr. Rajesh K.", status: "ACTIVE", assetCount: 14, employeeCount: 42 },
    { id: "dept-2", name: "IT & Infrastructure", parentDepartment: "Executive & Admin", head: "Vikram Malhotra", status: "ACTIVE", assetCount: 28, employeeCount: 18 },
    { id: "dept-3", name: "Logistics & Procurement", parentDepartment: "Operations", head: "Priya Sharma", status: "ACTIVE", assetCount: 35, employeeCount: 24 },
    { id: "dept-4", name: "Finance & Accounts", parentDepartment: "Executive & Admin", head: "Sanjay Gupta", status: "ACTIVE", assetCount: 10, employeeCount: 12 },
    { id: "dept-5", name: "Human Resources", parentDepartment: "Executive & Admin", head: "Anjali Mehta", status: "ACTIVE", assetCount: 8, employeeCount: 9 },
  ]);

  // 2. Categories State with custom metadata definitions
  const [categories, setCategories] = useState([
    {
      id: "cat-1",
      name: "Electronics",
      code: "ELEC",
      description: "Computers, servers, monitors, networking gear",
      metadataSchema: [
        { key: "Warranty", type: "string", example: "3 Years Next-Business-Day" },
        { key: "Voltage", type: "string", example: "110V-240V AC" },
        { key: "Brand", type: "string", example: "Apple / Dell / Cisco" },
      ],
    },
    {
      id: "cat-2",
      name: "Furniture",
      code: "FURN",
      description: "Office desks, ergonomic chairs, storage cabinets",
      metadataSchema: [
        { key: "Material", type: "string", example: "Steel & High-Density Mesh" },
        { key: "Weight", type: "string", example: "24.5 kg" },
      ],
    },
    {
      id: "cat-3",
      name: "Vehicle",
      code: "VEH",
      description: "Company transport cars, logistics vans, forklifts",
      metadataSchema: [
        { key: "Registration No", type: "string", example: "DL-01-AB-1234" },
        { key: "Fuel Type", type: "string", example: "Electric / Diesel" },
        { key: "Insurance Expiry", type: "date", example: "2027-05-15" },
      ],
    },
    {
      id: "cat-4",
      name: "Conference & Audio-Visual",
      code: "AV",
      description: "4K Projectors, Smart Boards, Video Conferencing Units",
      metadataSchema: [
        { key: "Resolution", type: "string", example: "3840x2160 (4K UHD)" },
        { key: "Connectivity", type: "string", example: "HDMI 2.1, USB-C, Miracast" },
      ],
    },
  ]);

  // 3. Employees Directory State
  const [employees, setEmployees] = useState([
    { id: "emp-101", name: "Vikram Malhotra", email: "admin@assetflow.enterprise", role: "ADMIN", department: "Executive & Admin", status: "ACTIVE", assetsAssigned: 3, joinedDate: "2023-01-10" },
    { id: "emp-102", name: "Priya Sharma", email: "priya.asset@assetflow.enterprise", role: "ASSET_MANAGER", department: "Logistics & Procurement", status: "ACTIVE", assetsAssigned: 5, joinedDate: "2023-03-15" },
    { id: "emp-103", name: "Dr. Rajesh K.", email: "rajesh.head@assetflow.enterprise", role: "DEPARTMENT_HEAD", department: "R&D & Engineering", status: "ACTIVE", assetsAssigned: 4, joinedDate: "2023-02-01" },
    { id: "emp-104", name: "Aman Verma", email: "aman@assetflow.enterprise", role: "EMPLOYEE", department: "R&D & Engineering", status: "ACTIVE", assetsAssigned: 2, joinedDate: "2024-06-12" },
    { id: "emp-105", name: "Neha Singh", email: "neha.s@assetflow.enterprise", role: "EMPLOYEE", department: "IT & Infrastructure", status: "ACTIVE", assetsAssigned: 1, joinedDate: "2024-09-20" },
    { id: "emp-106", name: "Karan Johar", email: "karan.j@assetflow.enterprise", role: "EMPLOYEE", department: "Finance & Accounts", status: "INACTIVE", assetsAssigned: 0, joinedDate: "2024-01-18" },
  ]);

  // 4. Assets State (with automatic AF-xxxx Tag formatting)
  const [assets, setAssets] = useState([
    {
      id: "ast-1",
      tag: "AF-0001",
      name: "MacBook Pro M3 Max 64GB",
      category: "Electronics",
      serialNumber: "C02G9081MD6R",
      purchaseCost: 3450,
      purchaseDate: "2024-01-15",
      location: "HQ - Floor 4 (Eng Wing)",
      department: "R&D & Engineering",
      condition: "New",
      status: "Allocated",
      shared: false,
      photo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80",
      allocatedTo: "Aman Verma",
      customMetadata: { Warranty: "3 Years AppleCare+", Voltage: "100V-240V AC", Brand: "Apple" },
      allocationHistory: [
        { id: "ah-1", allocatedTo: "Aman Verma", department: "R&D & Engineering", allocatedAt: "2024-02-01", returnedAt: null, notes: "Initial workstation setup" },
      ],
      maintenanceHistory: [],
    },
    {
      id: "ast-2",
      tag: "AF-0002",
      name: "Dell PowerEdge R750 Rack Server",
      category: "Electronics",
      serialNumber: "SVR-882910-DL",
      purchaseCost: 12800,
      purchaseDate: "2023-08-10",
      location: "Server Room B - Rack 14",
      department: "IT & Infrastructure",
      condition: "Good",
      status: "Allocated",
      shared: true,
      photo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80",
      allocatedTo: "IT Server Pool",
      customMetadata: { Warranty: "5 Years ProSupport", Voltage: "220V Dual PSU", Brand: "Dell Enterprise" },
      allocationHistory: [
        { id: "ah-2", allocatedTo: "IT Server Pool", department: "IT & Infrastructure", allocatedAt: "2023-08-15", returnedAt: null, notes: "Primary DB Cluster Node 1" },
      ],
      maintenanceHistory: [
        { id: "mh-1", date: "2024-04-12", technician: "Cloudtech Services", cost: 450, description: "Firmware update and thermal paste replacement" },
      ],
    },
    {
      id: "ast-3",
      tag: "AF-0003",
      name: "Herman Miller Aeron Executive Chair",
      category: "Furniture",
      serialNumber: "HM-AER-9921",
      purchaseCost: 1420,
      purchaseDate: "2023-11-05",
      location: "HQ - Floor 4 (Eng Wing)",
      department: "R&D & Engineering",
      condition: "Good",
      status: "Allocated",
      shared: false,
      photo: "https://images.unsplash.com/photo-1580481077494-e3299ac2fef6?w=500&auto=format&fit=crop&q=80",
      allocatedTo: "Dr. Rajesh K.",
      customMetadata: { Material: "Pellicle Mesh & Graphite Base", Weight: "21 kg" },
      allocationHistory: [
        { id: "ah-3", allocatedTo: "Dr. Rajesh K.", department: "R&D & Engineering", allocatedAt: "2023-11-10", returnedAt: null, notes: "Executive office seating" },
      ],
      maintenanceHistory: [],
    },
    {
      id: "ast-4",
      tag: "AF-0004",
      name: "Sony 4K Laser Projector VPL-XWZ",
      category: "Conference & Audio-Visual",
      serialNumber: "SNY-PRJ-4412",
      purchaseCost: 4900,
      purchaseDate: "2024-02-20",
      location: "Conference Room A (Executive)",
      department: "Executive & Admin",
      condition: "Good",
      status: "Available",
      shared: true,
      photo: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80",
      allocatedTo: null,
      customMetadata: { Resolution: "3840x2160 Laser 5000 Lumens", Connectivity: "HDMI 2.1 x3, Wireless LAN" },
      allocationHistory: [],
      maintenanceHistory: [],
    },
    {
      id: "ast-5",
      tag: "AF-0005",
      name: "Tesla Model Y Long Range (Logistics Fleet)",
      category: "Vehicle",
      serialNumber: "5YJ3E1EB4LF891023",
      purchaseCost: 52000,
      purchaseDate: "2023-05-18",
      location: "HQ Underground Parking - Bay 04",
      department: "Logistics & Procurement",
      condition: "Good",
      status: "Available",
      shared: true,
      photo: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&auto=format&fit=crop&q=80",
      allocatedTo: null,
      customMetadata: { "Registration No": "DL-01-EL-8821", "Fuel Type": "Electric AWD", "Insurance Expiry": "2026-05-17" },
      allocationHistory: [],
      maintenanceHistory: [
        { id: "mh-2", date: "2024-05-10", technician: "Tesla Service Center", cost: 320, description: "Routine tire rotation and brake inspection" },
      ],
    },
    {
      id: "ast-6",
      tag: "AF-0006",
      name: "HP LaserJet Enterprise MFP M630",
      category: "Electronics",
      serialNumber: "HP-MFP-77189",
      purchaseCost: 2100,
      purchaseDate: "2022-09-11",
      location: "HQ - Floor 3 (General Office)",
      department: "IT & Infrastructure",
      condition: "Needs Repair",
      status: "Under Maintenance",
      shared: true,
      photo: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format&fit=crop&q=80",
      allocatedTo: null,
      customMetadata: { Warranty: "Expired", Voltage: "220V", Brand: "HP" },
      allocationHistory: [],
      maintenanceHistory: [
        { id: "mh-3", date: "2026-07-11", technician: "Internal Tech Team", cost: 150, description: "Paper feed roller jam and fuser replacement pending" },
      ],
    },
    {
      id: "ast-7",
      tag: "AF-0007",
      name: "Cisco Catalyst 9300 48-Port Switch",
      category: "Electronics",
      serialNumber: "CSC-9300-48P-992",
      purchaseCost: 6800,
      purchaseDate: "2024-03-01",
      location: "Server Room A - Rack 02",
      department: "IT & Infrastructure",
      condition: "New",
      status: "Available",
      shared: true,
      photo: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80",
      allocatedTo: null,
      customMetadata: { Warranty: "3 Years Cisco SmartNet", Voltage: "100-240V AC", Brand: "Cisco" },
      allocationHistory: [],
      maintenanceHistory: [],
    },
    {
      id: "ast-8",
      tag: "AF-0008",
      name: "Lenovo ThinkPad X1 Carbon Gen 11",
      category: "Electronics",
      serialNumber: "LNV-X1C-33821",
      purchaseCost: 2400,
      purchaseDate: "2024-04-10",
      location: "HQ - Floor 2 (Finance)",
      department: "Finance & Accounts",
      condition: "Good",
      status: "Allocated",
      shared: false,
      photo: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
      allocatedTo: "Sanjay Gupta",
      customMetadata: { Warranty: "3 Years On-Site", Voltage: "65W USB-C", Brand: "Lenovo" },
      allocationHistory: [
        { id: "ah-4", allocatedTo: "Sanjay Gupta", department: "Finance & Accounts", allocatedAt: "2024-04-12", returnedAt: null, notes: "Head of Finance primary laptop" },
      ],
      maintenanceHistory: [],
    },
  ]);

  // 5. Transfer Requests State
  const [transferRequests, setTransferRequests] = useState([
    {
      id: "tr-101",
      assetId: "ast-1",
      assetTag: "AF-0001",
      assetName: "MacBook Pro M3 Max 64GB",
      from: "Aman Verma (R&D & Engineering)",
      to: "Neha Singh (IT & Infrastructure)",
      reason: "Reallocating high-performance machine for AI compiler benchmarks",
      status: "Pending",
      requestedBy: "Aman Verma",
      requestedAt: "2026-07-11T14:30:00",
    },
    {
      id: "tr-102",
      assetId: "ast-3",
      assetTag: "AF-0003",
      assetName: "Herman Miller Aeron Chair",
      from: "R&D Floor 4",
      to: "Executive Suite 502",
      reason: "Executive board room seating upgrade",
      status: "Approved",
      requestedBy: "Priya Sharma",
      requestedAt: "2026-07-09T11:15:00",
      approvedBy: "Vikram Malhotra (Admin)",
    },
  ]);

  // 6. Resource Bookings State (with existing.start < new.end AND existing.end > new.start conflict check)
  const [bookings, setBookings] = useState([
    {
      id: "bk-201",
      resource: "Conference Room A (Executive Suite)",
      employee: "Aman Verma",
      start: "2026-07-12T13:00",
      end: "2026-07-12T14:30",
      status: "Upcoming",
      notes: "Product Roadmap Review with Engineering team",
    },
    {
      id: "bk-202",
      resource: "Sony 4K Laser Projector VPL-XWZ",
      employee: "Dr. Rajesh K.",
      start: "2026-07-12T15:00",
      end: "2026-07-12T16:30",
      status: "Upcoming",
      notes: "Investor Demo Presentation",
    },
    {
      id: "bk-203",
      resource: "Tesla Model Y Long Range (Logistics Fleet)",
      employee: "Priya Sharma",
      start: "2026-07-12T09:00",
      end: "2026-07-12T11:00",
      status: "Completed",
      notes: "Warehouse site inspection trip",
    },
  ]);

  // 7. Maintenance Tickets State
  const [maintenances, setMaintenances] = useState([
    {
      id: "mnt-301",
      assetId: "ast-6",
      assetTag: "AF-0006",
      assetName: "HP LaserJet Enterprise MFP M630",
      description: "Paper feed roller jam and fuser unit reporting heating failure error #E402",
      priority: "High",
      status: "In Progress",
      raisedBy: "Aman Verma",
      technician: "HP Certified Support / Suresh K.",
      raisedAt: "2026-07-11T09:15:00",
      costEstimate: 180,
    },
    {
      id: "mnt-302",
      assetId: "ast-2",
      assetTag: "AF-0002",
      assetName: "Dell PowerEdge R750 Rack Server",
      description: "Fan #4 RPM fluctuating above threshold during heavy database backups",
      priority: "Medium",
      status: "Technician Assigned",
      raisedBy: "Vikram Malhotra",
      technician: "Internal Datacenter Ops Team",
      raisedAt: "2026-07-12T08:30:00",
      costEstimate: 0,
    },
  ]);

  // 8. Audit Cycles State
  const [auditCycles, setAuditCycles] = useState([
    {
      id: "aud-401",
      title: "Q3 2026 High-Value Asset Verification",
      assignedAuditor: "Priya Sharma (Asset Manager)",
      scope: "Electronics & Audio-Visual",
      status: "In Progress",
      startDate: "2026-07-01",
      items: [
        { assetId: "ast-1", assetTag: "AF-0001", assetName: "MacBook Pro M3 Max", verification: "Verified", notes: "Verified on site with Aman Verma" },
        { assetId: "ast-2", assetTag: "AF-0002", assetName: "Dell PowerEdge R750", verification: "Verified", notes: "Server rack verified in room B" },
        { assetId: "ast-4", assetTag: "AF-0004", assetName: "Sony 4K Laser Projector", verification: "Verified", notes: "Mounted in Conf Room A" },
        { assetId: "ast-7", assetTag: "AF-0007", assetName: "Cisco Catalyst 9300 Switch", verification: "Pending", notes: "Awaiting key access to Server Room A" },
      ],
      discrepancyReport: null,
    },
  ]);

  // 9. Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      type: "Transfer",
      title: "Transfer Request Pending Approval",
      message: "Aman Verma requested transfer of AF-0001 (MacBook Pro M3 Max) to Neha Singh.",
      timestamp: "10 minutes ago",
      read: false,
    },
    {
      id: "notif-2",
      type: "Booking",
      title: "Upcoming Room Booking Reminder",
      message: "Your booking for Conference Room A (Executive Suite) starts in 30 minutes.",
      timestamp: "30 minutes ago",
      read: false,
    },
    {
      id: "notif-3",
      type: "Maintenance",
      title: "Maintenance Ticket Status Updated",
      message: "Technician assigned for AF-0006 (HP LaserJet MFP M630): HP Certified Support.",
      timestamp: "2 hours ago",
      read: true,
    },
    {
      id: "notif-4",
      type: "Overdue",
      title: "Overdue Asset Return Alert",
      message: "Asset AF-0005 (Tesla Model Y) was expected back from warehouse trip by 11:00 AM.",
      timestamp: "Yesterday",
      read: true,
    },
  ]);

  // 10. Activity Log State ("Every controller should call createActivityLog()")
  const [activityLogs, setActivityLogs] = useState([
    { id: "log-1", who: "Aman Verma", action: "Requested Asset Transfer", entity: "AF-0001 (MacBook Pro)", timestamp: "2026-07-11 14:30:12", ip: "192.168.1.45", metadata: "To: Neha Singh" },
    { id: "log-2", who: "Aman Verma", action: "Booked Conference Room", entity: "Conference Room A", timestamp: "2026-07-11 16:10:04", ip: "192.168.1.45", metadata: "Slot: 2026-07-12 13:00-14:30" },
    { id: "log-3", who: "Priya Sharma", action: "Assigned Technician", entity: "Maintenance Ticket #mnt-301", timestamp: "2026-07-11 17:05:22", ip: "192.168.1.88", metadata: "Tech: HP Certified Support" },
    { id: "log-4", who: "Vikram Malhotra", action: "Approved Department Head Role", entity: "Dr. Rajesh K.", timestamp: "2026-07-10 11:20:00", ip: "10.0.0.1", metadata: "Promoted from Employee" },
  ]);

  // Helper function to log activities
  const createActivityLog = ({ action, entity, metadata = "" }) => {
    const newLog = {
      id: "log-" + Date.now(),
      who: user?.name || "System User",
      action,
      entity,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      ip: "192.168.1." + Math.floor(10 + Math.random() * 80),
      metadata,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // --- ACTIONS & BUSINESS RULES ---

  // Generate new asset tag (AF-0009, etc.)
  const generateNextTag = () => {
    const numbers = assets.map((a) => {
      const parts = a.tag.split("-");
      return parseInt(parts[1] || "0", 10);
    });
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNum = maxNum + 1;
    return `AF-${String(nextNum).padStart(4, "0")}`;
  };

  // Create Asset
  const createAsset = async (newAssetData) => {
    const tag = newAssetData.tag || generateNextTag();
    const created = {
      id: "ast-" + Date.now(),
      tag,
      name: newAssetData.name,
      category: newAssetData.category,
      serialNumber: newAssetData.serialNumber || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      purchaseCost: parseFloat(newAssetData.purchaseCost || 0),
      purchaseDate: newAssetData.purchaseDate || new Date().toISOString().split("T")[0],
      location: newAssetData.location || "HQ Warehouse",
      department: newAssetData.department || "General Operations",
      condition: newAssetData.condition || "New",
      status: "Available",
      shared: newAssetData.shared || false,
      photo: newAssetData.photo || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
      allocatedTo: null,
      customMetadata: newAssetData.customMetadata || {},
      allocationHistory: [],
      maintenanceHistory: [],
    };

    setAssets((prev) => [created, ...prev]);
    createActivityLog({ action: "Created Asset", entity: `${created.tag} - ${created.name}`, metadata: `Cost: $${created.purchaseCost}` });
    return created;
  };

  // Allocate Asset Check ("If Asset Status = Allocated -> Reject. Response: { message: 'Already allocated' }")
  const allocateAsset = (assetId, targetUser, targetDepartment, notes = "") => {
    const targetAsset = assets.find((a) => a.id === assetId || a.tag === assetId);
    if (!targetAsset) return { success: false, message: "Asset not found" };

    if (targetAsset.status === "Allocated") {
      createActivityLog({ action: "Rejected Direct Allocation", entity: targetAsset.tag, metadata: "Reason: Already allocated" });
      return { success: false, code: "ALREADY_ALLOCATED", message: "Already allocated" };
    }

    const updated = assets.map((a) => {
      if (a.id === targetAsset.id) {
        return {
          ...a,
          status: "Allocated",
          allocatedTo: targetUser,
          department: targetDepartment || a.department,
          allocationHistory: [
            {
              id: "ah-" + Date.now(),
              allocatedTo: targetUser,
              department: targetDepartment || a.department,
              allocatedAt: new Date().toISOString().split("T")[0],
              returnedAt: null,
              notes,
            },
            ...a.allocationHistory,
          ],
        };
      }
      return a;
    });

    setAssets(updated);
    createActivityLog({ action: "Allocated Asset", entity: targetAsset.tag, metadata: `To: ${targetUser}` });
    return { success: true, message: `Successfully allocated ${targetAsset.tag} to ${targetUser}` };
  };

  // Request Transfer (`POST /transfer` - Fields: From, To, Reason)
  const requestTransfer = ({ assetId, from, to, reason }) => {
    const targetAsset = assets.find((a) => a.id === assetId || a.tag === assetId);
    if (!targetAsset) return { success: false, message: "Asset not found" };

    const newReq = {
      id: "tr-" + Date.now(),
      assetId: targetAsset.id,
      assetTag: targetAsset.tag,
      assetName: targetAsset.name,
      from: from || targetAsset.allocatedTo || "Current Holder",
      to,
      reason,
      status: "Pending",
      requestedBy: user?.name || "Employee",
      requestedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setTransferRequests((prev) => [newReq, ...prev]);
    setNotifications((prev) => [
      {
        id: "notif-" + Date.now(),
        type: "Transfer",
        title: "New Transfer Request",
        message: `${newReq.requestedBy} requested transfer of ${targetAsset.tag} to ${to}`,
        timestamp: "Just now",
        read: false,
      },
      ...prev,
    ]);
    createActivityLog({ action: "Submitted Transfer Request", entity: targetAsset.tag, metadata: `From: ${newReq.from} -> To: ${to}` });
    return { success: true, message: "Transfer request submitted for approval" };
  };

  // Approve / Reject Transfer
  const processTransferRequest = (reqId, newStatus) => {
    const req = transferRequests.find((r) => r.id === reqId);
    if (!req) return;

    setTransferRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, status: newStatus, approvedBy: user?.name || "Manager/Head" }
          : r
      )
    );

    if (newStatus === "Approved") {
      // Reallocate asset to target (`req.to`)
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id === req.assetId) {
            return {
              ...a,
              allocatedTo: req.to,
              status: "Allocated",
              allocationHistory: [
                {
                  id: "ah-" + Date.now(),
                  allocatedTo: req.to,
                  department: a.department,
                  allocatedAt: new Date().toISOString().split("T")[0],
                  returnedAt: null,
                  notes: `Transferred from ${req.from}: ${req.reason}`,
                },
                ...a.allocationHistory,
              ],
            };
          }
          return a;
        })
      );
    }

    createActivityLog({ action: `${newStatus} Transfer Request`, entity: req.assetTag, metadata: `Processed by: ${user?.name}` });
  };

  // Return Asset (`POST /return` - Fields: Condition, Notes. After approval: Asset -> Available)
  const returnAsset = ({ assetId, condition, notes }) => {
    const targetAsset = assets.find((a) => a.id === assetId || a.tag === assetId);
    if (!targetAsset) return { success: false, message: "Asset not found" };

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === targetAsset.id) {
          const updatedHistory = a.allocationHistory.map((h, idx) => {
            if (idx === 0 && !h.returnedAt) {
              return { ...h, returnedAt: new Date().toISOString().split("T")[0], returnCondition: condition, notes: `${h.notes} | Returned notes: ${notes}` };
            }
            return h;
          });
          return {
            ...a,
            status: "Available",
            condition: condition || a.condition,
            allocatedTo: null,
            allocationHistory: updatedHistory,
          };
        }
        return a;
      })
    );

    createActivityLog({ action: "Returned Asset", entity: targetAsset.tag, metadata: `Condition: ${condition} - ${notes}` });
    return { success: true, message: `${targetAsset.tag} successfully returned and marked as Available.` };
  };

  // Create Resource Booking (`POST /booking` - Check: existing.start < new.end AND existing.end > new.start)
  const createBooking = ({ resource, employee, start, end, notes }) => {
    const newStart = new Date(start).getTime();
    const newEnd = new Date(end).getTime();

    if (newStart >= newEnd) {
      return { success: false, message: "Booking end time must be after start time." };
    }

    // SQL query validation exact check: existing.start < new.end AND existing.end > new.start
    const conflict = bookings.find((b) => {
      if (b.resource !== resource || b.status === "Cancelled") return false;
      const existStart = new Date(b.start).getTime();
      const existEnd = new Date(b.end).getTime();
      return existStart < newEnd && existEnd > newStart;
    });

    if (conflict) {
      createActivityLog({ action: "Rejected Booking (Conflict)", entity: resource, metadata: `Overlaps with ${conflict.employee}'s booking` });
      return {
        success: false,
        conflict: true,
        message: `Booking Rejected: Slot (${start.replace("T", " ")} to ${end.split("T")[1] || end}) overlaps with existing booking by ${conflict.employee}.`,
      };
    }

    const newBooking = {
      id: "bk-" + Date.now(),
      resource,
      employee: employee || user?.name || "Employee",
      start,
      end,
      status: "Upcoming",
      notes: notes || "Team collaboration",
    };

    setBookings((prev) => [newBooking, ...prev]);
    createActivityLog({ action: "Created Resource Booking", entity: resource, metadata: `Slot: ${start.replace("T", " ")}` });
    return { success: true, message: `Successfully booked ${resource}` };
  };

  // Raise Maintenance (`POST /maintenance`)
  const raiseMaintenance = ({ assetId, description, priority }) => {
    const targetAsset = assets.find((a) => a.id === assetId || a.tag === assetId);
    if (!targetAsset) return { success: false, message: "Asset not found" };

    const ticket = {
      id: "mnt-" + Date.now(),
      assetId: targetAsset.id,
      assetTag: targetAsset.tag,
      assetName: targetAsset.name,
      description,
      priority: priority || "Medium",
      status: "Pending",
      raisedBy: user?.name || "Employee",
      technician: null,
      raisedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setMaintenances((prev) => [ticket, ...prev]);
    createActivityLog({ action: "Raised Maintenance Ticket", entity: targetAsset.tag, metadata: `Priority: ${priority} - ${description}` });
    return { success: true, message: "Maintenance ticket raised successfully." };
  };

  // Update Maintenance Workflow (Pending -> Approved -> Technician Assigned -> In Progress -> Resolved)
  const updateMaintenanceStatus = (ticketId, newStatus, technicianName = null) => {
    const ticket = maintenances.find((m) => m.id === ticketId);
    if (!ticket) return;

    setMaintenances((prev) =>
      prev.map((m) => {
        if (m.id === ticketId) {
          return {
            ...m,
            status: newStatus,
            ...(technicianName ? { technician: technicianName } : {}),
            ...(newStatus === "Resolved" ? { resolvedAt: new Date().toISOString().split("T")[0] } : {}),
          };
        }
        return m;
      })
    );

    // Backend automatically: Approved -> Asset Status: Under Maintenance, Resolve -> Asset Status: Available
    if (newStatus === "Approved" || newStatus === "Technician Assigned" || newStatus === "In Progress") {
      setAssets((prev) =>
        prev.map((a) => (a.id === ticket.assetId ? { ...a, status: "Under Maintenance" } : a))
      );
    } else if (newStatus === "Resolved") {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id === ticket.assetId) {
            return {
              ...a,
              status: "Available",
              condition: "Good",
              maintenanceHistory: [
                {
                  id: "mh-" + Date.now(),
                  date: new Date().toISOString().split("T")[0],
                  technician: ticket.technician || technicianName || "Assigned Tech",
                  cost: Math.floor(120 + Math.random() * 300),
                  description: ticket.description,
                },
                ...a.maintenanceHistory,
              ],
            };
          }
          return a;
        })
      );
    }

    createActivityLog({ action: `Updated Maintenance (${newStatus})`, entity: ticket.assetTag, metadata: technicianName ? `Tech: ${technicianName}` : "" });
  };

  // Employee Management Actions
  const promoteEmployee = (empId, targetRole) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;

    setEmployees((prev) => prev.map((e) => (e.id === empId ? { ...e, role: targetRole } : e)));
    createActivityLog({ action: "Promoted Employee Role", entity: emp.name, metadata: `Role -> ${targetRole}` });
  };

  const toggleEmployeeStatus = (empId) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === empId) {
          const nextState = e.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          createActivityLog({ action: "Changed Employee Status", entity: e.name, metadata: `Status: ${nextState}` });
          return { ...e, status: nextState };
        }
        return e;
      })
    );
  };

  // Notifications Actions
  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Calculate Dashboard KPI Metrics exactly matching `GET /api/dashboard` return structure
  const getDashboardMetrics = () => {
    const availableAssets = assets.filter((a) => a.status === "Available").length;
    const allocatedAssets = assets.filter((a) => a.status === "Allocated").length;
    const maintenanceToday = assets.filter((a) => a.status === "Under Maintenance").length;
    const activeBookings = bookings.filter((b) => b.status === "Upcoming" || b.status === "Ongoing").length;
    const pendingTransfers = transferRequests.filter((t) => t.status === "Pending").length;
    const upcomingReturns = assets.filter((a) => a.status === "Allocated").length; // active allocations
    const overdueReturns = 1; // simulation count for overdue
    const recentActivities = activityLogs.slice(0, 8);

    return {
      availableAssets,
      allocatedAssets,
      maintenanceToday,
      activeBookings,
      pendingTransfers,
      upcomingReturns,
      overdueReturns,
      recentActivities,
    };
  };

  return (
    <ERPContext.Provider
      value={{
        departments,
        setDepartments,
        categories,
        setCategories,
        employees,
        setEmployees,
        assets,
        setAssets,
        transferRequests,
        setTransferRequests,
        bookings,
        setBookings,
        maintenances,
        setMaintenances,
        auditCycles,
        setAuditCycles,
        notifications,
        setNotifications,
        activityLogs,
        createActivityLog,
        generateNextTag,
        createAsset,
        allocateAsset,
        requestTransfer,
        processTransferRequest,
        returnAsset,
        createBooking,
        raiseMaintenance,
        updateMaintenanceStatus,
        promoteEmployee,
        toggleEmployeeStatus,
        markNotificationRead,
        markAllNotificationsRead,
        getDashboardMetrics,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => useContext(ERPContext);
