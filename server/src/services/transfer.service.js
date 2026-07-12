const prisma = require("../config/db");

const getTransfers = async ({ assetId, status, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (assetId) where.assetId = assetId;
  if (status) where.status = status;

  const [total, transfers] = await prisma.$transaction([
    prisma.transferRequest.count({ where }),
    prisma.transferRequest.findMany({
      where,
      skip,
      take,
      orderBy: { requestedAt: "desc" },
      include: {
        asset: { select: { id: true, name: true, assetTag: true } },
        fromEmployee: { select: { id: true, name: true, email: true, employeeCode: true } },
        toEmployee: { select: { id: true, name: true, email: true, employeeCode: true } },
        requestedBy: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    transfers,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const createTransferRequest = async (data, requesterId) => {
  const { assetId, toEmployeeId, reason } = data;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });
  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  if (asset.status !== "ALLOCATED") {
    const error = new Error("Asset is not currently allocated to anyone, so it cannot be transferred.");
    error.statusCode = 400;
    throw error;
  }

  const activeAlloc = await prisma.assetAllocation.findFirst({
    where: { assetId, status: { in: ["ACTIVE", "OVERDUE"] } },
  });
  if (!activeAlloc) {
    const error = new Error("No active allocation found for this asset.");
    error.statusCode = 400;
    throw error;
  }

  const targetEmployee = await prisma.user.findUnique({
    where: { id: toEmployeeId },
  });
  if (!targetEmployee) {
    const error = new Error("Target employee not found.");
    error.statusCode = 400;
    throw error;
  }

  if (activeAlloc.employeeId === toEmployeeId) {
    const error = new Error("Asset is already allocated to the target employee.");
    error.statusCode = 400;
    throw error;
  }

  const transfer = await prisma.transferRequest.create({
    data: {
      assetId,
      fromEmployeeId: activeAlloc.employeeId,
      toEmployeeId,
      requestedById: requesterId,
      reason,
      status: "PENDING",
    },
  });

  await prisma.notification.create({
    data: {
      userId: toEmployeeId,
      title: "Transfer Request Received",
      message: `A request has been made to transfer asset ${asset.name} (${asset.assetTag}) to you.`,
      type: "TRANSFER_REQUEST",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: requesterId,
      action: "REQUEST_TRANSFER",
      entity: "TransferRequest",
      entityId: transfer.id,
      metadata: { assetTag: asset.assetTag, reason },
    },
  });

  return transfer;
};

const approveTransfer = async (id, adminUserId) => {
  const transfer = await prisma.transferRequest.findUnique({
    where: { id },
  });
  if (!transfer) {
    const error = new Error("Transfer request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (transfer.status !== "PENDING") {
    const error = new Error("Transfer request is not pending.");
    error.statusCode = 400;
    throw error;
  }

  const asset = await prisma.asset.findUnique({
    where: { id: transfer.assetId },
  });
  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  const activeAlloc = await prisma.assetAllocation.findFirst({
    where: { assetId: transfer.assetId, status: { in: ["ACTIVE", "OVERDUE"] } },
  });
  if (!activeAlloc) {
    const error = new Error("No active allocation found for this asset.");
    error.statusCode = 400;
    throw error;
  }

  await prisma.$transaction([
    prisma.transferRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: adminUserId,
        approvedAt: new Date(),
      },
    }),
    prisma.assetAllocation.update({
      where: { id: activeAlloc.id },
      data: {
        status: "RETURNED",
        returnedDate: new Date(),
        returnCondition: asset.condition,
        returnNotes: `Transferred to another employee via TransferRequest #${id}`,
      },
    }),
    prisma.assetAllocation.create({
      data: {
        assetId: transfer.assetId,
        employeeId: transfer.toEmployeeId,
        allocatedById: adminUserId,
        status: "ACTIVE",
      },
    }),
  ]);

  await prisma.notification.createMany({
    data: [
      {
        userId: transfer.toEmployeeId,
        title: "Asset Transferred",
        message: `Asset ${asset.name} (${asset.assetTag}) has been transferred to you.`,
        type: "ASSET_ASSIGNED",
      },
      {
        userId: transfer.fromEmployeeId,
        title: "Transfer Approved",
        message: `Asset ${asset.name} (${asset.assetTag}) has been successfully transferred to target employee.`,
        type: "TRANSFER_APPROVED",
      },
    ],
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "APPROVE_TRANSFER",
      entity: "TransferRequest",
      entityId: id,
      metadata: { assetTag: asset.assetTag, fromId: transfer.fromEmployeeId, toId: transfer.toEmployeeId },
    },
  });

  return prisma.transferRequest.findUnique({
    where: { id },
    include: {
      asset: { select: { id: true, name: true, assetTag: true } },
      fromEmployee: { select: { id: true, name: true, email: true } },
      toEmployee: { select: { id: true, name: true, email: true } },
    },
  });
};

const rejectTransfer = async (id, adminUserId) => {
  const transfer = await prisma.transferRequest.findUnique({
    where: { id },
  });
  if (!transfer) {
    const error = new Error("Transfer request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (transfer.status !== "PENDING") {
    const error = new Error("Transfer request is not pending.");
    error.statusCode = 400;
    throw error;
  }

  const asset = await prisma.asset.findUnique({
    where: { id: transfer.assetId },
  });

  const updatedTransfer = await prisma.transferRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      approvedById: adminUserId,
      approvedAt: new Date(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: transfer.requestedById,
      title: "Transfer Rejected",
      message: `Your transfer request for asset ${asset ? asset.name : "Asset"} has been rejected.`,
      type: "TRANSFER_APPROVED",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "REJECT_TRANSFER",
      entity: "TransferRequest",
      entityId: id,
      metadata: { assetTag: asset ? asset.assetTag : "Asset" },
    },
  });

  return updatedTransfer;
};

module.exports = {
  getTransfers,
  createTransferRequest,
  approveTransfer,
  rejectTransfer,
};
