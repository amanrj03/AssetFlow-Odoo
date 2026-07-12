const express = require("express");
const router = express.Router();
const assetController = require("../controllers/asset.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

const fileUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "photo", maxCount: 1 },
  { name: "documents", maxCount: 10 },
]);

// Authenticated users can read asset data
router.get("/", protect, assetController.getAssets);
router.get("/:id", protect, assetController.getAssetById);
router.get("/tag/:assetTag", protect, assetController.getAssetByTag);
router.get("/history/:id", protect, assetController.getAssetHistory);

// Only ADMIN and ASSET_MANAGER can write/delete asset data
router.post("/", protect, authorize("ADMIN", "ASSET_MANAGER"), fileUpload, assetController.createAsset);
router.put("/:id", protect, authorize("ADMIN", "ASSET_MANAGER"), fileUpload, assetController.updateAsset);
router.delete("/:id", protect, authorize("ADMIN", "ASSET_MANAGER"), assetController.disposeAsset);

module.exports = router;
