const prisma = require("../config/db");

const getCategories = async ({ search, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, categories] = await prisma.$transaction([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      skip,
      take,
      include: {
        _count: {
          select: { assets: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const formattedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    customFields: c.customFields,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    assetCount: c._count.assets,
  }));

  return {
    categories: formattedCategories,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getCategoryById = async (id) => {
  const c = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { assets: true },
      },
    },
  });

  if (!c) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: c.id,
    name: c.name,
    description: c.description,
    customFields: c.customFields,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    assetCount: c._count.assets,
  };
};

const createCategory = async (data, adminUserId) => {
  const { name, description, customFields } = data;

  const existing = await prisma.category.findUnique({
    where: { name },
  });
  if (existing) {
    const error = new Error("Category name already exists.");
    error.statusCode = 400;
    throw error;
  }

  const category = await prisma.category.create({
    data: {
      name,
      description,
      customFields: customFields || {},
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "CREATE_CATEGORY",
      entity: "Category",
      entityId: category.id,
      metadata: { name: category.name },
    },
  });

  return getCategoryById(category.id);
};

const updateCategory = async (id, data, adminUserId) => {
  const { name, description, customFields } = data;

  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  const updatePayload = {};

  if (name && name !== category.name) {
    const existing = await prisma.category.findUnique({
      where: { name },
    });
    if (existing) {
      const error = new Error("Category name already exists.");
      error.statusCode = 400;
      throw error;
    }
    updatePayload.name = name;
  }

  if (description !== undefined) {
    updatePayload.description = description;
  }

  if (customFields !== undefined) {
    updatePayload.customFields = customFields;
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: updatePayload,
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "UPDATE_CATEGORY",
      entity: "Category",
      entityId: id,
      metadata: { updatedFields: Object.keys(updatePayload) },
    },
  });

  return getCategoryById(id);
};

const deleteCategory = async (id, adminUserId) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { assets: true },
      },
    },
  });

  if (!category) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  if (category._count.assets > 0) {
    const error = new Error("Category cannot be deleted because it is currently assigned to one or more assets.");
    error.statusCode = 400;
    throw error;
  }

  await prisma.category.delete({
    where: { id },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "DELETE_CATEGORY",
      entity: "Category",
      entityId: id,
      metadata: { name: category.name },
    },
  });

  return { id, deleted: true };
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
