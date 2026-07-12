const prisma = require("../config/db");

const getAllocations = async ({ assetId, employeeId, status, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (assetId) where.assetId = assetId;
  if (employeeId) where.employeeId = employeeId;
  if (status) where.status = status;

  const [total, allocations] = await prisma.$transaction([
    prisma.assetAllocation.count({ where }),
    prisma.assetAllocation.findMany({
      where,
      skip,
      take,
      orderBy: { allocatedDate: "desc" },
      include: {
        asset: { select: { id: true, name: true, assetTag: true } },
        employee: { select: { id: true, name: true, email: true, employeeCode: true } },
        allocatedBy: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    allocations,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getAllocationById = async (id) => {
  const allocation = await prisma.assetAllocation.findUnique({
    where: { id },
    include: {
      asset: { select: { id: true, name: true, assetTag: true } },
      employee: { select: { id: true, name: true, email: true, employeeCode: true } },
      allocatedBy: { select: { id: true, name: true } },
    },
  });

  if (!allocation) {
    const error = new Error("Allocation record not found.");
    error.statusCode = 404;
    throw error;
  }

  return allocation;
};

const createAllocation = async (data, adminUserId) => {
  const { assetId, employeeId, expectedReturnDate } = data;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });
  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  if (asset.status === "ALLOCATED") {
    const error = new Error("Asset is already allocated.");
    error.statusCode = 400;
    throw error;
  }

  if (asset.status !== "AVAILABLE") {
    const error = new Error(`Asset is not available for allocation. Current status: ${asset.status}`);
    error.statusCode = 400;
    throw error;
  }

  const employee = await prisma.user.findUnique({
    where: { id: employeeId },
  });
  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 400;
    throw error;
  }

  const [allocation] = await prisma.$transaction([
    prisma.assetAllocation.create({
      data: {
        assetId,
        employeeId,
        allocatedById: adminUserId,
        expectedReturnDate,
        status: "ACTIVE",
      },
    }),
    prisma.asset.update({
      where: { id: assetId },
      data: { status: "ALLOCATED" },
    }),
  ]);

  await prisma.notification.create({
    data: {
      userId: employeeId,
      title: "Asset Assigned",
      message: `Asset ${asset.name} (${asset.assetTag}) has been assigned to you.`,
      type: "ASSET_ASSIGNED",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "ALLOCATE_ASSET",
      entity: "AssetAllocation",
      entityId: allocation.id,
      metadata: { assetTag: asset.assetTag, employeeName: employee.name },
    },
  });

  return getAllocationById(allocation.id);
};

const returnAllocation = async (id, returnData, adminUserId) => {
  const { returnCondition, returnNotes } = returnData;

  const allocation = await prisma.assetAllocation.findUnique({
    where: { id },
  });
  if (!allocation) {
    const error = new Error("Allocation record not found.");
    error.statusCode = 404;
    throw error;
  }

  if (allocation.status !== "ACTIVE" && allocation.status !== "OVERDUE") {
    const error = new Error("Allocation is not active.");
    error.statusCode = 400;
    throw error;
  }

  const asset = await prisma.asset.findUnique({
    where: { id: allocation.assetId },
  });
  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  const [updatedAllocation] = await prisma.$transaction([
    prisma.assetAllocation.update({
      where: { id },
      data: {
        status: "RETURNED",
        returnedDate: new Date(),
        returnCondition,
        returnNotes,
      },
    }),
    prisma.asset.update({
      where: { id: allocation.assetId },
      data: {
        status: "AVAILABLE",
        condition: returnCondition || asset.condition,
      },
    }),
  ]);

  await prisma.notification.create({
    data: {
      userId: allocation.employeeId,
      title: "Asset Returned",
      message: `Asset ${asset.name} (${asset.assetTag}) return has been processed.`,
      type: "ASSET_RETURN",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "RETURN_ASSET",
      entity: "AssetAllocation",
      entityId: id,
      metadata: { assetTag: asset.assetTag, condition: returnCondition || asset.condition },
    },
  });

  return getAllocationById(id);
};

module.exports = {
  getAllocations,
  getAllocationById,
  createAllocation,
  returnAllocation,
};
