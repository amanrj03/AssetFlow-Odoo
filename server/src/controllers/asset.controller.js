const assetService = require("../services/asset.service");
const { createAssetSchema, updateAssetSchema } = require("../validators/asset.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getAssets = asyncHandler(async (req, res) => {
  const { search, status, categoryId, departmentId, page, limit, sort } = req.query;

  const result = await assetService.getAssets({
    search,
    status,
    categoryId,
    departmentId,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
    sort,
  });

  return sendSuccess(res, "Assets retrieved successfully", result);
});

const getAssetById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const asset = await assetService.getAssetById(id);
  return sendSuccess(res, "Asset retrieved successfully", { asset });
});

const getAssetByTag = asyncHandler(async (req, res) => {
  const { assetTag } = req.params;
  const asset = await assetService.getAssetByTag(assetTag);
  return sendSuccess(res, "Asset retrieved successfully", { asset });
});

const getAssetHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const history = await assetService.getAssetHistory(id);
  return sendSuccess(res, "Asset history retrieved successfully", history);
});

const createAsset = asyncHandler(async (req, res) => {
  const parsedData = createAssetSchema.parse(req.body);
  const asset = await assetService.createAsset(parsedData, req.files, req.user.id);
  return sendSuccess(res, "Asset registered successfully", { asset }, 201);
});

const updateAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = updateAssetSchema.parse(req.body);
  const asset = await assetService.updateAsset(id, parsedData, req.files, req.user.id);
  return sendSuccess(res, "Asset updated successfully", { asset });
});

const disposeAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const asset = await assetService.disposeAsset(id, req.user.id);
  return sendSuccess(res, "Asset marked as disposed successfully", { asset });
});

module.exports = {
  getAssets,
  getAssetById,
  getAssetByTag,
  getAssetHistory,
  createAsset,
  updateAsset,
  disposeAsset,
};
