const prisma = require("../config/db");
const allocationService = require("../services/allocation.service");
const { createAllocationSchema, returnAllocationSchema } = require("../validators/allocation.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getAllocations = asyncHandler(async (req, res) => {
  const { assetId, employeeId, status, page, limit } = req.query;

  const result = await allocationService.getAllocations({
    assetId,
    employeeId,
    status,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return sendSuccess(res, "Allocation records retrieved successfully", result);
});

const getAllocationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const allocation = await allocationService.getAllocationById(id);
  return sendSuccess(res, "Allocation record retrieved successfully", { allocation });
});

const createAllocation = asyncHandler(async (req, res) => {
  let assetId = req.body.assetId;
  let employeeId = req.body.employeeId || req.body.employee || req.body.targetUser;

  if (assetId && !isUUID(assetId)) {
    const assetObj = await prisma.asset.findFirst({
      where: { assetTag: assetId }
    });
    assetId = assetObj ? assetObj.id : null;
  }

  if (employeeId && !isUUID(employeeId)) {
    const userObj = await prisma.user.findFirst({
      where: { name: { equals: employeeId, mode: "insensitive" } }
    });
    employeeId = userObj ? userObj.id : null;
  }

  const resolvedBody = {
    ...req.body,
    assetId,
    employeeId
  };

  const parsedData = createAllocationSchema.parse(resolvedBody);
  const allocation = await allocationService.createAllocation(parsedData, req.user.id);
  return sendSuccess(res, "Asset allocated successfully", { allocation }, 201);
});

const returnAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = returnAllocationSchema.parse(req.body);
  const allocation = await allocationService.returnAllocation(id, parsedData, req.user.id);
  return sendSuccess(res, "Asset returned successfully", { allocation });
});

const returnAssetByAssetId = asyncHandler(async (req, res) => {
  const { assetId, condition, notes } = req.body;

  if (!assetId) {
    const error = new Error("Asset ID is required.");
    error.statusCode = 400;
    throw error;
  }

  const activeAllocation = await prisma.assetAllocation.findFirst({
    where: {
      OR: [
        { assetId: assetId },
        { asset: { assetTag: assetId } }
      ],
      status: "ACTIVE"
    }
  });

  if (!activeAllocation) {
    const error = new Error("No active allocation found for this asset.");
    error.statusCode = 404;
    throw error;
  }

  const allocation = await allocationService.returnAllocation(
    activeAllocation.id,
    { returnCondition: condition, remarks: notes },
    req.user.id
  );

  return sendSuccess(res, "Asset returned successfully", { allocation });
});

const getAllocationHistoryByAssetId = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  const history = await prisma.assetAllocation.findMany({
    where: {
      OR: [
        { assetId: assetId },
        { asset: { assetTag: assetId } }
      ]
    },
    orderBy: { allocatedDate: "desc" },
    include: {
      employee: { select: { id: true, name: true, email: true } },
      allocatedBy: { select: { id: true, name: true } }
    }
  });

  return sendSuccess(res, "Allocation history retrieved successfully", history);
});

module.exports = {
  getAllocations,
  getAllocationById,
  createAllocation,
  returnAllocation,
  returnAssetByAssetId,
  getAllocationHistoryByAssetId,
};
