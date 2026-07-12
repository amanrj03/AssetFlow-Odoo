const employeeService = require("../services/employee.service");
const {
  updateEmployeeSchema,
  promoteEmployeeSchema,
  changeStatusSchema,
  changeDepartmentSchema,
} = require("../validators/employee.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getEmployees = asyncHandler(async (req, res) => {
  const { search, role, departmentId, status, page, limit, sort } = req.query;

  const result = await employeeService.getEmployees({
    search,
    role,
    departmentId,
    status,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
    sort,
  });

  return sendSuccess(
    res,
    "Employees retrieved successfully",
    result
  );
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await employeeService.getEmployeeById(id);

  return sendSuccess(
    res,
    "Employee retrieved successfully",
    { employee }
  );
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = updateEmployeeSchema.parse(req.body);

  const employee = await employeeService.updateEmployee(id, parsedData, req.user.id);

  return sendSuccess(
    res,
    "Employee profile updated successfully",
    { employee }
  );
});

const promoteEmployee = asyncHandler(async (req, res) => {
  const employeeId = req.params.id || req.body.userId || req.body.employeeId;
  const role = req.body.role;

  if (!employeeId || !role) {
    const error = new Error("Employee ID and role are required.");
    error.statusCode = 400;
    throw error;
  }

  const employee = await employeeService.promoteEmployee(
    employeeId,
    role,
    req.user.id
  );

  return sendSuccess(
    res,
    "Employee promoted successfully",
    { employee }
  );
});

const changeStatus = asyncHandler(async (req, res) => {
  const employeeId = req.params.id || req.body.userId || req.body.employeeId;
  const status = req.body.status;

  if (!employeeId || !status) {
    const error = new Error("Employee ID and status are required.");
    error.statusCode = 400;
    throw error;
  }

  const employee = await employeeService.changeStatus(
    employeeId,
    status,
    req.user.id
  );

  return sendSuccess(
    res,
    "Employee status changed successfully",
    { employee }
  );
});

const changeDepartment = asyncHandler(async (req, res) => {
  const parsedData = changeDepartmentSchema.parse(req.body);

  const employee = await employeeService.changeDepartment(
    parsedData.employeeId,
    parsedData.departmentId,
    req.user.id
  );

  return sendSuccess(
    res,
    "Employee department updated successfully",
    { employee }
  );
});

module.exports = {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  promoteEmployee,
  changeStatus,
  changeDepartment,
};
