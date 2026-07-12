const express = require("express");
const router = express.Router();
const auditController = require("../controllers/audit.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Read cycle lists/details (open to all authenticated users)
router.get("/", protect, auditController.getAuditCycles);
router.get("/:id", protect, auditController.getAuditCycleById);

// Admin controls
router.post("/", protect, authorize("ADMIN", "ASSET_MANAGER"), auditController.createAuditCycle);
router.put("/:id", protect, authorize("ADMIN", "ASSET_MANAGER"), auditController.updateAuditCycle);
router.patch("/:id/close", protect, authorize("ADMIN", "ASSET_MANAGER"), auditController.closeAuditCycle);
router.post("/:id/assign", protect, authorize("ADMIN", "ASSET_MANAGER"), auditController.assignAuditor);
router.get("/:id/report", protect, authorize("ADMIN", "ASSET_MANAGER"), auditController.getDiscrepancyReport);

// Verify Asset (assigned auditor or admin/manager)
router.post("/:id/verify", protect, auditController.verifyAsset);

module.exports = router;
