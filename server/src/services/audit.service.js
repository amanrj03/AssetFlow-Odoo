const prisma = require("../config/db");

const syncAuditStatuses = async () => {
  const now = new Date();
  await prisma.auditCycle.updateMany({
    where: {
      status: "UPCOMING",
      startDate: { lte: now },
      endDate: { gte: now },
    },
    data: { status: "ACTIVE" },
  });
};

const getAuditCycles = async ({ page = 1, limit = 10 }) => {
  await syncAuditStatuses();

  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const [total, cycles] = await prisma.$transaction([
    prisma.auditCycle.count(),
    prisma.auditCycle.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    cycles,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getAuditCycleById = async (id) => {
  await syncAuditStatuses();

  const cycle = await prisma.auditCycle.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true } },
      department: { select: { id: true, name: true } },
      auditItems: {
        include: {
          asset: { select: { id: true, name: true, assetTag: true, serialNumber: true } },
          auditor: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!cycle) {
    const error = new Error("Audit cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  return cycle;
};

const createAuditCycle = async (data, creatorId) => {
  const { title, scope, departmentId, location, startDate, endDate } = data;

  if (departmentId) {
    const dept = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!dept) {
      const error = new Error("Department not found.");
      error.statusCode = 400;
      throw error;
    }
  }

  const now = new Date();
  let initialStatus = "UPCOMING";
  if (startDate <= now && endDate >= now) {
    initialStatus = "ACTIVE";
  }

  const cycle = await prisma.auditCycle.create({
    data: {
      title,
      scope,
      departmentId,
      location,
      startDate,
      endDate,
      status: initialStatus,
      createdById: creatorId,
    },
  });

  await prisma.notification.create({
    data: {
      userId: creatorId,
      title: "Audit Cycle Created",
      message: `Audit cycle "${title}" has been initialized.`,
      type: "AUDIT_CREATED",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: creatorId,
      action: "AUDIT_CREATED",
      entity: "AuditCycle",
      entityId: cycle.id,
      metadata: { title },
    },
  });

  return cycle;
};

const updateAuditCycle = async (id, data) => {
  const cycleExists = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycleExists) {
    const error = new Error("Audit cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  const updatedCycle = await prisma.auditCycle.update({
    where: { id },
    data,
  });

  return updatedCycle;
};

const assignAuditor = async (id, data, adminUserId) => {
  const { auditorId, assetIds } = data;

  const cycle = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycle) {
    const error = new Error("Audit cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  if (cycle.status === "CLOSED") {
    const error = new Error("Cannot assign auditors to a closed audit cycle.");
    error.statusCode = 400;
    throw error;
  }

  const auditor = await prisma.user.findUnique({ where: { id: auditorId } });
  if (!auditor) {
    const error = new Error("Auditor not found.");
    error.statusCode = 400;
    throw error;
  }

  for (const assetId of assetIds) {
    const assetExists = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!assetExists) {
      const error = new Error(`Asset with ID ${assetId} not found.`);
      error.statusCode = 400;
      throw error;
    }

    const existingItem = await prisma.auditItem.findFirst({
      where: { auditCycleId: id, assetId },
    });

    if (existingItem) {
      if (existingItem.verifiedAt !== null) {
        const error = new Error(`Asset ${assetExists.assetTag} has already been verified in this cycle and cannot be reassigned.`);
        error.statusCode = 400;
        throw error;
      }
      await prisma.auditItem.update({
        where: { id: existingItem.id },
        data: { auditorId },
      });
    } else {
      await prisma.auditItem.create({
        data: {
          auditCycleId: id,
          assetId,
          auditorId,
        },
      });
    }
  }

  await prisma.notification.create({
    data: {
      userId: auditorId,
      title: "Audit Assignment",
      message: `You have been assigned to verify ${assetIds.length} assets under cycle "${cycle.title}".`,
      type: "AUDIT_CREATED",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "AUDITOR_ASSIGNED",
      entity: "AuditCycle",
      entityId: id,
      metadata: { auditorId, auditorName: auditor.name, assetCount: assetIds.length },
    },
  });

  return getAuditCycleById(id);
};

const verifyAsset = async (id, data, userId, userRole) => {
  const { assetId, result, remarks } = data;

  const cycle = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycle) {
    const error = new Error("Audit cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  if (cycle.status === "CLOSED") {
    const error = new Error("Cannot verify assets in a closed audit cycle.");
    error.statusCode = 400;
    throw error;
  }

  const auditItem = await prisma.auditItem.findFirst({
    where: { auditCycleId: id, assetId },
    include: { asset: { select: { assetTag: true } } },
  });

  if (!auditItem) {
    const error = new Error("This asset is not registered under this audit cycle.");
    error.statusCode = 400;
    throw error;
  }

  if (userRole !== "ADMIN" && userRole !== "ASSET_MANAGER" && auditItem.auditorId !== userId) {
    const error = new Error("You are not assigned as an auditor for this asset in this cycle.");
    error.statusCode = 403;
    throw error;
  }

  if (auditItem.verifiedAt !== null) {
    const error = new Error("This asset has already been verified in this cycle.");
    error.statusCode = 400;
    throw error;
  }

  const updatedItem = await prisma.auditItem.update({
    where: { id: auditItem.id },
    data: {
      result,
      remarks,
      verifiedAt: new Date(),
    },
  });

  if (result === "MISSING" || result === "DAMAGED") {
    await prisma.notification.create({
      data: {
        userId: cycle.createdById,
        title: "Discrepancy Found",
        message: `Asset ${auditItem.asset.assetTag} found ${result.toLowerCase()} during cycle "${cycle.title}".`,
        type: "AUDIT_CREATED",
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      userId,
      action: "ASSET_VERIFIED",
      entity: "AuditItem",
      entityId: auditItem.id,
      metadata: { assetTag: auditItem.asset.assetTag, result },
    },
  });

  return updatedItem;
};

const closeAuditCycle = async (id, adminUserId) => {
  const cycle = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycle) {
    const error = new Error("Audit cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  if (cycle.status === "CLOSED") {
    const error = new Error("Audit cycle is already closed.");
    error.statusCode = 400;
    throw error;
  }

  const missingItems = await prisma.auditItem.findMany({
    where: { auditCycleId: id, result: "MISSING" },
    select: { assetId: true },
  });

  const assetIdsToMarkLost = missingItems.map((item) => item.assetId);

  await prisma.$transaction([
    prisma.auditCycle.update({
      where: { id },
      data: { status: "CLOSED" },
    }),
    ...(assetIdsToMarkLost.length > 0
      ? [
          prisma.asset.updateMany({
            where: { id: { in: assetIdsToMarkLost } },
            data: { status: "LOST" },
          }),
        ]
      : []),
  ]);

  await prisma.notification.create({
    data: {
      userId: cycle.createdById,
      title: "Audit Cycle Closed",
      message: `Audit cycle "${cycle.title}" has been successfully closed.`,
      type: "AUDIT_COMPLETED",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "AUDIT_CLOSED",
      entity: "AuditCycle",
      entityId: id,
      metadata: { title: cycle.title, lostAssetsCount: assetIdsToMarkLost.length },
    },
  });

  return getAuditCycleById(id);
};

const getDiscrepancyReport = async (id) => {
  const cycle = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycle) {
    const error = new Error("Audit cycle not found.");
    error.statusCode = 404;
    throw error;
  }

  const allItems = await prisma.auditItem.findMany({
    where: { auditCycleId: id },
    include: {
      asset: { select: { id: true, name: true, assetTag: true, serialNumber: true, location: true } },
      auditor: { select: { name: true } },
    },
  });

  const total = allItems.length;
  const verified = allItems.filter((i) => i.result === "VERIFIED").length;
  const missing = allItems.filter((i) => i.result === "MISSING");
  const damaged = allItems.filter((i) => i.result === "DAMAGED");
  const pending = allItems.filter((i) => i.verifiedAt === null).length;

  return {
    cycle: {
      id: cycle.id,
      title: cycle.title,
      status: cycle.status,
    },
    statistics: {
      totalAssets: total,
      verifiedCount: verified,
      missingCount: missing.length,
      damagedCount: damaged.length,
      pendingCount: pending,
    },
    missingAssets: missing.map((item) => ({
      assetId: item.asset.id,
      name: item.asset.name,
      assetTag: item.asset.assetTag,
      serialNumber: item.asset.serialNumber,
      location: item.asset.location,
      remarks: item.remarks,
      verifiedAt: item.verifiedAt,
      auditorName: item.auditor.name,
    })),
    damagedAssets: damaged.map((item) => ({
      assetId: item.asset.id,
      name: item.asset.name,
      assetTag: item.asset.assetTag,
      serialNumber: item.asset.serialNumber,
      location: item.asset.location,
      remarks: item.remarks,
      verifiedAt: item.verifiedAt,
      auditorName: item.auditor.name,
    })),
  };
};

module.exports = {
  getAuditCycles,
  getAuditCycleById,
  createAuditCycle,
  updateAuditCycle,
  assignAuditor,
  verifyAsset,
  closeAuditCycle,
  getDiscrepancyReport,
};
