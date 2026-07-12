const prisma = require("../config/db");
const auditService = require("../services/audit.service");
const {
  createAuditCycleSchema,
  assignAuditorSchema,
  verifyAssetSchema,
} = require("../validators/audit.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const getAuditCycles = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await auditService.getAuditCycles({
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return sendSuccess(res, "Audit cycles retrieved successfully", result);
});

const getAuditCycleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cycle = await auditService.getAuditCycleById(id);
  return sendSuccess(res, "Audit cycle details retrieved successfully", { cycle });
});

const createAuditCycle = asyncHandler(async (req, res) => {
  const parsedData = createAuditCycleSchema.parse(req.body);
  const cycle = await auditService.createAuditCycle(parsedData, req.user.id);
  return sendSuccess(res, "Audit cycle created successfully", { cycle }, 201);
});

const updateAuditCycle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cycle = await auditService.updateAuditCycle(id, req.body);
  return sendSuccess(res, "Audit cycle updated successfully", { cycle });
});

const assignAuditor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = assignAuditorSchema.parse(req.body);
  const cycle = await auditService.assignAuditor(id, parsedData, req.user.id);
  return sendSuccess(res, "Auditors assigned successfully", { cycle });
});

const verifyAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let assetId = req.body.assetId;
  if (assetId && !isUUID(assetId)) {
    const assetObj = await prisma.asset.findFirst({
      where: { assetTag: assetId }
    });
    assetId = assetObj ? assetObj.id : null;
  }

  let resultVal = req.body.result || req.body.verification;
  if (resultVal) {
    resultVal = resultVal.toUpperCase();
    if (resultVal === "PENDING") resultVal = "MISSING";
  }

  const resolvedBody = {
    assetId,
    result: resultVal || "VERIFIED",
    remarks: req.body.remarks || req.body.notes || ""
  };

  const parsedData = verifyAssetSchema.parse(resolvedBody);
  const item = await auditService.verifyAsset(id, parsedData, req.user.id, req.user.role);
  return sendSuccess(res, "Asset verification recorded successfully", { item });
});

const closeAuditCycle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cycle = await auditService.closeAuditCycle(id, req.user.id);
  return sendSuccess(res, "Audit cycle closed successfully, missing assets updated to LOST", { cycle });
});

const getDiscrepancyReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const report = await auditService.getDiscrepancyReport(id);
  return sendSuccess(res, "Audit discrepancy report retrieved successfully", report);
});

module.exports = {
  getAuditCycles,
  getAuditCycleById,
  createAuditCycle,
  updateAuditCycle,
  assignAuditor,
  verifyAsset,
  closeAuditCycle,
  getDiscrepancyReport,
};
