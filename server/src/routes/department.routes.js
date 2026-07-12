const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Authenticated users can read
router.get("/", protect, departmentController.getDepartments);
router.get("/:id", protect, departmentController.getDepartmentById);

// Only ADMIN can perform write actions
router.post("/", protect, authorize("ADMIN"), departmentController.createDepartment);
router.put("/:id", protect, authorize("ADMIN"), departmentController.updateDepartment);
router.patch("/:id/head", protect, authorize("ADMIN"), departmentController.assignDepartmentHead);
router.delete("/:id", protect, authorize("ADMIN"), departmentController.softDeleteDepartment);

module.exports = router;
