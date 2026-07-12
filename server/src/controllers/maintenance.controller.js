const prisma = require("../config/db");
const maintenanceService = require("../services/maintenance.service");
const {
  createMaintenanceSchema,
  assignTechnicianSchema,
  resolveMaintenanceSchema,
} = require("../validators/maintenance.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const getMaintenanceRequests = asyncHandler(async (req, res) => {
  const { assetId, status, page, limit } = req.query;

  let departmentId = undefined;
  let raisedById = undefined;

  if (req.user.role === "DEPARTMENT_HEAD") {
    departmentId = req.user.departmentId;
  } else if (req.user.role === "EMPLOYEE") {
    raisedById = req.user.id;
  }

  const result = await maintenanceService.getMaintenanceRequests({
    assetId,
    status,
    departmentId,
    raisedById,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return sendSuccess(res, "Maintenance requests retrieved successfully", result);
});

const getMaintenanceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const request = await maintenanceService.getMaintenanceById(id);
  return sendSuccess(res, "Maintenance request retrieved successfully", { request });
});

const createMaintenanceRequest = asyncHandler(async (req, res) => {
  let assetId = req.body.assetId;
  if (assetId && !isUUID(assetId)) {
    const assetObj = await prisma.asset.findFirst({
      where: { assetTag: assetId }
    });
    assetId = assetObj ? assetObj.id : null;
  }

  const resolvedBody = {
    ...req.body,
    assetId
  };

  const parsedData = createMaintenanceSchema.parse(resolvedBody);
  const request = await maintenanceService.createMaintenanceRequest(parsedData, req.user.id, req.user.role);
  return sendSuccess(res, "Maintenance request submitted successfully", { request }, 201);
});

const approveMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const request = await maintenanceService.approveMaintenance(id, req.user.id);
  return sendSuccess(res, "Maintenance request approved successfully", { request });
});

const rejectMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const request = await maintenanceService.rejectMaintenance(id, req.user.id);
  return sendSuccess(res, "Maintenance request rejected successfully", { request });
});

const assignTechnician = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = assignTechnicianSchema.parse(req.body);
  const request = await maintenanceService.assignTechnician(id, parsedData, req.user.id);
  return sendSuccess(res, "Technician assigned successfully", { request });
});

const startMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const request = await maintenanceService.startMaintenance(id, req.user.id);
  return sendSuccess(res, "Maintenance work started successfully", { request });
});

const resolveMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = resolveMaintenanceSchema.parse(req.body);
  const request = await maintenanceService.resolveMaintenance(id, parsedData, req.user.id);
  return sendSuccess(res, "Maintenance request resolved successfully", { request });
});

module.exports = {
  getMaintenanceRequests,
  getMaintenanceById,
  createMaintenanceRequest,
  approveMaintenance,
  rejectMaintenance,
  assignTechnician,
  startMaintenance,
  resolveMaintenance,
};
