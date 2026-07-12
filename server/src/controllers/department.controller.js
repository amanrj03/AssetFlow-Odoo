const prisma = require("../config/db");
const departmentService = require("../services/department.service");
const { createDepartmentSchema, updateDepartmentSchema } = require("../validators/department.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const resolveDeptAndHead = async (body) => {
  const resolved = { ...body };
  if (resolved.parentDepartmentId && !isUUID(resolved.parentDepartmentId)) {
    const parent = await prisma.department.findFirst({
      where: { name: resolved.parentDepartmentId }
    });
    resolved.parentDepartmentId = parent ? parent.id : null;
  }
  if (resolved.parentDepartment && !isUUID(resolved.parentDepartment)) {
    const parent = await prisma.department.findFirst({
      where: { name: resolved.parentDepartment }
    });
    resolved.parentDepartmentId = parent ? parent.id : null;
  }
  if (resolved.headId && !isUUID(resolved.headId)) {
    const head = await prisma.user.findFirst({
      where: { name: resolved.headId }
    });
    resolved.headId = head ? head.id : null;
  }
  if (resolved.head && !isUUID(resolved.head)) {
    const head = await prisma.user.findFirst({
      where: { name: resolved.head }
    });
    resolved.headId = head ? head.id : null;
  }
  return resolved;
};

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
  const resolvedBody = await resolveDeptAndHead(req.body);
  const parsedData = createDepartmentSchema.parse(resolvedBody);

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
  const resolvedBody = await resolveDeptAndHead(req.body);
  const parsedData = updateDepartmentSchema.parse(resolvedBody);

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
