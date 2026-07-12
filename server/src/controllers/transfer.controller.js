const prisma = require("../config/db");
const transferService = require("../services/transfer.service");
const { createTransferSchema } = require("../validators/transfer.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

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
  let toEmployeeId = req.body.toEmployeeId || req.body.to;
  if (toEmployeeId && !isUUID(toEmployeeId)) {
    const cleanName = toEmployeeId.split("(")[0].trim();
    const user = await prisma.user.findFirst({
      where: { name: { equals: cleanName, mode: "insensitive" } }
    });
    toEmployeeId = user ? user.id : null;
  }

  const resolvedBody = {
    ...req.body,
    toEmployeeId
  };

  const parsedData = createTransferSchema.parse(resolvedBody);
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
