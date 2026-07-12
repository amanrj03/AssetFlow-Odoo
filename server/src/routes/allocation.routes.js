const express = require("express");
const router = express.Router();
const allocationController = require("../controllers/allocation.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.get("/", protect, allocationController.getAllocations);
router.get("/history/:assetId", protect, allocationController.getAllocationHistoryByAssetId);
router.get("/:id", protect, allocationController.getAllocationById);

router.post("/", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), allocationController.createAllocation);
router.patch("/:id/return", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), allocationController.returnAllocation);
router.post("/return", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), allocationController.returnAssetByAssetId);

module.exports = router;
