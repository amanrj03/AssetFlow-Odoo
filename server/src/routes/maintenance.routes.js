const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenance.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Reading list/details
router.get("/", protect, maintenanceController.getMaintenanceRequests);
router.get("/:id", protect, maintenanceController.getMaintenanceById);

// Submit request (available to all authenticated users, holding check inside service)
router.post("/", protect, maintenanceController.createMaintenanceRequest);

// Workflow state changes (restricted to ADMIN and ASSET_MANAGER)
router.patch("/:id/approve", protect, authorize("ADMIN", "ASSET_MANAGER"), maintenanceController.approveMaintenance);
router.patch("/:id/reject", protect, authorize("ADMIN", "ASSET_MANAGER"), maintenanceController.rejectMaintenance);
router.patch("/:id/assign-technician", protect, authorize("ADMIN", "ASSET_MANAGER"), maintenanceController.assignTechnician);
router.patch("/:id/start", protect, authorize("ADMIN", "ASSET_MANAGER"), maintenanceController.startMaintenance);
router.patch("/:id/resolve", protect, authorize("ADMIN", "ASSET_MANAGER"), maintenanceController.resolveMaintenance);

module.exports = router;
