const prisma = require("../config/db");

const getMaintenanceRequests = async ({ assetId, status, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (assetId) where.assetId = assetId;
  if (status) where.status = status;

  const [total, requests] = await prisma.$transaction([
    prisma.maintenanceRequest.count({ where }),
    prisma.maintenanceRequest.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        asset: { select: { id: true, name: true, assetTag: true } },
        raisedBy: { select: { id: true, name: true, email: true, employeeCode: true } },
        approvedBy: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    requests,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getMaintenanceById = async (id) => {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: {
      asset: { select: { id: true, name: true, assetTag: true, status: true, condition: true } },
      raisedBy: { select: { id: true, name: true, email: true, employeeCode: true } },
      approvedBy: { select: { id: true, name: true } },
    },
  });

  if (!request) {
    const error = new Error("Maintenance request not found.");
    error.statusCode = 404;
    throw error;
  }

  return request;
};

const createMaintenanceRequest = async (data, userId, userRole) => {
  const { assetId, issue, priority, imageUrl } = data;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });
  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  // Enforce Rule 1: Only allocated users can raise requests (exempt Admins and Asset Managers)
  if (userRole !== "ADMIN" && userRole !== "ASSET_MANAGER") {
    const activeAlloc = await prisma.assetAllocation.findFirst({
      where: {
        assetId,
        employeeId: userId,
        status: { in: ["ACTIVE", "OVERDUE"] },
      },
    });

    if (!activeAlloc) {
      const error = new Error("You can only raise maintenance requests for assets currently allocated to you.");
      error.statusCode = 403;
      throw error;
    }
  }

  // Enforce Rule 4: Do not allow multiple active maintenance requests for the same asset
  const activeReq = await prisma.maintenanceRequest.findFirst({
    where: {
      assetId,
      status: { notIn: ["RESOLVED", "REJECTED"] },
    },
  });

  if (activeReq) {
    const error = new Error("There is already an active maintenance request for this asset.");
    error.statusCode = 400;
    throw error;
  }

  const request = await prisma.maintenanceRequest.create({
    data: {
      assetId,
      raisedById: userId,
      issue,
      priority: priority || "MEDIUM",
      imageUrl,
      status: "PENDING",
    },
    include: {
      asset: { select: { id: true, name: true, assetTag: true } },
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "Maintenance Request Submitted",
      message: `Your maintenance request for asset ${request.asset.name} (${request.asset.assetTag}) has been submitted.`,
      type: "MAINTENANCE_REQUEST", // Using standard type
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: "REQUEST_RAISED",
      entity: "MaintenanceRequest",
      entityId: request.id,
      metadata: { assetTag: request.asset.assetTag, priority: request.priority },
    },
  });

  return request;
};

const approveMaintenance = async (id, adminUserId) => {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: {
      asset: { select: { name: true, assetTag: true } },
    },
  });
  if (!request) {
    const error = new Error("Maintenance request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "PENDING") {
    const error = new Error("Request is not in pending status.");
    error.statusCode = 400;
    throw error;
  }

  const [updatedRequest] = await prisma.$transaction([
    prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: adminUserId,
      },
    }),
    prisma.asset.update({
      where: { id: request.assetId },
      data: { status: "UNDER_MAINTENANCE" },
    }),
  ]);

  await prisma.notification.create({
    data: {
      userId: request.raisedById,
      title: "Maintenance Approved",
      message: `Your maintenance request for asset ${request.asset.name} (${request.asset.assetTag}) has been approved.`,
      type: "MAINTENANCE_REQUEST",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "REQUEST_APPROVED",
      entity: "MaintenanceRequest",
      entityId: id,
      metadata: { assetTag: request.asset.assetTag },
    },
  });

  return updatedRequest;
};

const rejectMaintenance = async (id, adminUserId) => {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: {
      asset: { select: { name: true, assetTag: true } },
    },
  });
  if (!request) {
    const error = new Error("Maintenance request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "PENDING") {
    const error = new Error("Request is not in pending status.");
    error.statusCode = 400;
    throw error;
  }

  const updatedRequest = await prisma.maintenanceRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      approvedById: adminUserId,
    },
  });

  await prisma.notification.create({
    data: {
      userId: request.raisedById,
      title: "Maintenance Rejected",
      message: `Your maintenance request for asset ${request.asset.name} (${request.asset.assetTag}) has been rejected.`,
      type: "MAINTENANCE_REQUEST",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "REQUEST_REJECTED", // Action description matching log
      entity: "MaintenanceRequest",
      entityId: id,
      metadata: { assetTag: request.asset.assetTag },
    },
  });

  return updatedRequest;
};

const assignTechnician = async (id, data, adminUserId) => {
  const { technician } = data;

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: {
      asset: { select: { name: true, assetTag: true } },
    },
  });
  if (!request) {
    const error = new Error("Maintenance request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "APPROVED" && request.status !== "ASSIGNED") {
    const error = new Error("Request must be approved before assigning a technician.");
    error.statusCode = 400;
    throw error;
  }

  const updatedRequest = await prisma.maintenanceRequest.update({
    where: { id },
    data: {
      status: "ASSIGNED",
      technician,
    },
  });

  await prisma.notification.create({
    data: {
      userId: request.raisedById,
      title: "Technician Assigned",
      message: `Technician ${technician} has been assigned to repair your asset ${request.asset.name} (${request.asset.assetTag}).`,
      type: "MAINTENANCE_REQUEST",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "TECHNICIAN_ASSIGNED",
      entity: "MaintenanceRequest",
      entityId: id,
      metadata: { assetTag: request.asset.assetTag, technician },
    },
  });

  return updatedRequest;
};

const startMaintenance = async (id, adminUserId) => {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: {
      asset: { select: { name: true, assetTag: true } },
    },
  });
  if (!request) {
    const error = new Error("Maintenance request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "ASSIGNED") {
    const error = new Error("Technician must be assigned before starting work.");
    error.statusCode = 400;
    throw error;
  }

  const updatedRequest = await prisma.maintenanceRequest.update({
    where: { id },
    data: { status: "IN_PROGRESS" },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "WORK_STARTED",
      entity: "MaintenanceRequest",
      entityId: id,
      metadata: { assetTag: request.asset.assetTag },
    },
  });

  return updatedRequest;
};

const resolveMaintenance = async (id, data, adminUserId) => {
  const { resolutionNotes } = data;

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: {
      asset: { select: { name: true, assetTag: true, condition: true } },
    },
  });
  if (!request) {
    const error = new Error("Maintenance request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "IN_PROGRESS") {
    const error = new Error("Work must be in progress before resolving.");
    error.statusCode = 400;
    throw error;
  }

  const [updatedRequest] = await prisma.$transaction([
    prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status: "RESOLVED",
        resolutionNotes,
        resolvedAt: new Date(),
      },
    }),
    prisma.asset.update({
      where: { id: request.assetId },
      data: { status: "AVAILABLE" },
    }),
  ]);

  await prisma.notification.create({
    data: {
      userId: request.raisedById,
      title: "Maintenance Completed",
      message: `Maintenance completed for asset ${request.asset.name} (${request.asset.assetTag}). Resolution: ${resolutionNotes}`,
      type: "MAINTENANCE_REQUEST",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "WORK_COMPLETED",
      entity: "MaintenanceRequest",
      entityId: id,
      metadata: { assetTag: request.asset.assetTag, resolutionNotes },
    },
  });

  return updatedRequest;
};

module.exports = {
  getMaintenanceRequests,
  getMaintenanceById,
  createMaintenanceRequest,
  approveMaintenance,
  rejectMaintenance,
  assignTechnician,
  startMaintenance,
  resolveMaintenance,
};
