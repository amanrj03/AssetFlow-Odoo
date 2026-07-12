const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Authenticated users can read directory
router.get("/", protect, employeeController.getEmployees);
router.get("/:id", protect, employeeController.getEmployeeById);

// Only ADMIN can perform administrative actions
router.put("/:id", protect, authorize("ADMIN"), employeeController.updateEmployee);
router.patch("/promote", protect, authorize("ADMIN"), employeeController.promoteEmployee);
router.patch("/:id/promote", protect, authorize("ADMIN"), employeeController.promoteEmployee);
router.patch("/status", protect, authorize("ADMIN"), employeeController.changeStatus);
router.patch("/:id/status", protect, authorize("ADMIN"), employeeController.changeStatus);
router.patch("/department", protect, authorize("ADMIN"), employeeController.changeDepartment);

module.exports = router;
