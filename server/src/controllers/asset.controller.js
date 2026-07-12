const prisma = require("../config/db");
const assetService = require("../services/asset.service");
const { createAssetSchema, updateAssetSchema } = require("../validators/asset.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const resolveAssetRefs = async (body) => {
  const resolved = { ...body };
  
  const categoryVal = resolved.categoryId || resolved.category;
  if (categoryVal && !isUUID(categoryVal)) {
    const cat = await prisma.category.findFirst({
      where: { name: { equals: categoryVal, mode: "insensitive" } }
    });
    resolved.categoryId = cat ? cat.id : null;
  }
  
  const departmentVal = resolved.departmentId || resolved.department;
  if (departmentVal && !isUUID(departmentVal)) {
    const dept = await prisma.department.findFirst({
      where: { name: { equals: departmentVal, mode: "insensitive" } }
    });
    resolved.departmentId = dept ? dept.id : null;
  }

  if (resolved.purchaseCost && typeof resolved.purchaseCost === "string") {
    resolved.purchaseCost = parseFloat(resolved.purchaseCost);
  }
  if (resolved.isBookable && typeof resolved.isBookable === "string") {
    resolved.isBookable = resolved.isBookable === "true";
  }

  return resolved;
};

const getAssets = asyncHandler(async (req, res) => {
  let { search, status, categoryId, departmentId, page, limit, sort } = req.query;

  let employeeId = undefined;
  if (req.user.role === "DEPARTMENT_HEAD") {
    departmentId = req.user.departmentId;
  } else if (req.user.role === "EMPLOYEE") {
    employeeId = req.user.id;
  }

  const result = await assetService.getAssets({
    search,
    status,
    categoryId,
    departmentId,
    employeeId,
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
  const resolvedBody = await resolveAssetRefs(req.body);
  const parsedData = createAssetSchema.parse(resolvedBody);
  const asset = await assetService.createAsset(parsedData, req.files, req.user.id);
  return sendSuccess(res, "Asset registered successfully", { asset }, 201);
});

const updateAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resolvedBody = await resolveAssetRefs(req.body);
  const parsedData = updateAssetSchema.parse(resolvedBody);
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
