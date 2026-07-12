const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transfer.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.get("/", protect, transferController.getTransfers);
router.post("/", protect, transferController.createTransfer);

router.patch("/:id/approve", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), transferController.approveTransfer);
router.patch("/:id/reject", protect, authorize("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"), transferController.rejectTransfer);

module.exports = router;
