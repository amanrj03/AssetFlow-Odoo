const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Authenticated users can read
router.get("/", protect, categoryController.getCategories);
router.get("/:id", protect, categoryController.getCategoryById);

// Only ADMIN and ASSET_MANAGER can write/delete
router.post("/", protect, authorize("ADMIN", "ASSET_MANAGER"), categoryController.createCategory);
router.put("/:id", protect, authorize("ADMIN", "ASSET_MANAGER"), categoryController.updateCategory);
router.delete("/:id", protect, authorize("ADMIN", "ASSET_MANAGER"), categoryController.deleteCategory);

module.exports = router;
