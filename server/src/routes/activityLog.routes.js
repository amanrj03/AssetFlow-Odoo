const express = require("express");
const router = express.Router();
const activityLogController = require("../controllers/activityLog.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.get("/", protect, authorize("ADMIN", "ASSET_MANAGER"), activityLogController.getActivityLogs);
router.get("/:id", protect, authorize("ADMIN", "ASSET_MANAGER"), activityLogController.getActivityLogById);

module.exports = router;
