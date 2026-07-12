const transferService = require("../services/transfer.service");
const { createTransferSchema } = require("../validators/transfer.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getTransfers = asyncHandler(async (req, res) => {
  const { assetId, status, page, limit } = req.query;

  const result = await transferService.getTransfers({
    assetId,
    status,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return sendSuccess(res, "Transfer requests retrieved successfully", result);
});

const createTransfer = asyncHandler(async (req, res) => {
  const parsedData = createTransferSchema.parse(req.body);
  const transfer = await transferService.createTransferRequest(parsedData, req.user.id);
  return sendSuccess(res, "Transfer request submitted successfully", { transfer }, 201);
});

const approveTransfer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const transfer = await transferService.approveTransfer(id, req.user.id);
  return sendSuccess(res, "Transfer request approved successfully", { transfer });
});

const rejectTransfer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const transfer = await transferService.rejectTransfer(id, req.user.id);
  return sendSuccess(res, "Transfer request rejected successfully", { transfer });
});

module.exports = {
  getTransfers,
  createTransfer,
  approveTransfer,
  rejectTransfer,
};
