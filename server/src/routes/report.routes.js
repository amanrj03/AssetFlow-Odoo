const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Reports are restricted to ADMIN and ASSET_MANAGER roles
router.get("/asset-utilization", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), reportController.getAssetUtilization);
router.get("/department-summary", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), reportController.getDepartmentSummary);
router.get("/maintenance", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), reportController.getMaintenanceReport);
router.get("/bookings", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), reportController.getBookingReport);
router.get("/audit", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), reportController.getAuditReport);
router.get("/dashboard", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), reportController.getDashboardReport);
router.get("/export", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), reportController.exportCSV);

module.exports = router;
