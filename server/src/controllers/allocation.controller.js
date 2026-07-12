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
  const parsedData = createAllocationSchema.parse(req.body);
  const allocation = await allocationService.createAllocation(parsedData, req.user.id);
  return sendSuccess(res, "Asset allocated successfully", { allocation }, 201);
});

const returnAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = returnAllocationSchema.parse(req.body);
  const allocation = await allocationService.returnAllocation(id, parsedData, req.user.id);
  return sendSuccess(res, "Asset returned successfully", { allocation });
});

module.exports = {
  getAllocations,
  getAllocationById,
  createAllocation,
  returnAllocation,
};
