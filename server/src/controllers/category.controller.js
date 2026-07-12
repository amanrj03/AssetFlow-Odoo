const categoryService = require("../services/category.service");
const { createCategorySchema, updateCategorySchema } = require("../validators/category.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getCategories = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.query;

  const result = await categoryService.getCategories({
    search,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return sendSuccess(
    res,
    "Categories retrieved successfully",
    result
  );
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await categoryService.getCategoryById(id);

  return sendSuccess(
    res,
    "Category retrieved successfully",
    { category }
  );
});

const createCategory = asyncHandler(async (req, res) => {
  const parsedData = createCategorySchema.parse(req.body);

  const category = await categoryService.createCategory(parsedData, req.user.id);

  return sendSuccess(
    res,
    "Category created successfully",
    { category },
    201
  );
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = updateCategorySchema.parse(req.body);

  const category = await categoryService.updateCategory(id, parsedData, req.user.id);

  return sendSuccess(
    res,
    "Category updated successfully",
    { category }
  );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await categoryService.deleteCategory(id, req.user.id);

  return sendSuccess(
    res,
    "Category deleted successfully",
    result
  );
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
