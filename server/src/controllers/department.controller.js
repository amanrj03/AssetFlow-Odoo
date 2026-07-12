const departmentService = require("../services/department.service");
const { createDepartmentSchema, updateDepartmentSchema } = require("../validators/department.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getDepartments = asyncHandler(async (req, res) => {
  const { search, status, page, limit } = req.query;

  const result = await departmentService.getDepartments({
    search,
    status,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return sendSuccess(
    res,
    "Departments retrieved successfully",
    result
  );
});

const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await departmentService.getDepartmentById(id);

  return sendSuccess(
    res,
    "Department retrieved successfully",
    { department }
  );
});

const createDepartment = asyncHandler(async (req, res) => {
  const parsedData = createDepartmentSchema.parse(req.body);

  const department = await departmentService.createDepartment(parsedData, req.user.id);

  return sendSuccess(
    res,
    "Department created successfully",
    { department },
    201
  );
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = updateDepartmentSchema.parse(req.body);

  const department = await departmentService.updateDepartment(id, parsedData, req.user.id);

  return sendSuccess(
    res,
    "Department updated successfully",
    { department }
  );
});

const assignDepartmentHead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { headId } = req.body;

  if (!headId) {
    const error = new Error("headId is required");
    error.statusCode = 400;
    throw error;
  }

  const department = await departmentService.assignDepartmentHead(id, headId, req.user.id);

  return sendSuccess(
    res,
    "Department head assigned successfully",
    { department }
  );
});

const softDeleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await departmentService.softDeleteDepartment(id, req.user.id);

  return sendSuccess(
    res,
    "Department soft-deleted successfully",
    result
  );
});

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  assignDepartmentHead,
  softDeleteDepartment,
};
