const prisma = require("../config/db");

const getDashboardData = async () => {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

  const [
    assetsAvailable,
    assetsAllocated,
    maintenanceToday,
    activeBookings,
    pendingTransfers,
    upcomingReturns,
    overdueReturns,
    activeAuditCycles,
    recentActivities,
  ] = await prisma.$transaction([
    prisma.asset.count({ where: { status: "AVAILABLE" } }),
    prisma.asset.count({ where: { status: "ALLOCATED" } }),
    prisma.maintenanceRequest.count({
      where: {
        createdAt: { gte: todayStart },
      },
    }),
    prisma.resourceBooking.count({
      where: { status: "ONGOING" },
    }),
    prisma.transferRequest.count({
      where: { status: "PENDING" },
    }),
    prisma.assetAllocation.count({
      where: {
        status: "ACTIVE",
        expectedReturnDate: {
          gte: now,
          lte: sevenDaysLater,
        },
      },
    }),
    prisma.assetAllocation.count({
      where: { status: "OVERDUE" },
    }),
    prisma.auditCycle.count({
      where: { status: "ACTIVE" },
    }),
    prisma.activityLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    }),
  ]);

  return {
    assetsAvailable,
    assetsAllocated,
    maintenanceToday,
    activeBookings,
    pendingTransfers,
    upcomingReturns,
    overdueReturns,
    activeAuditCycles,
    recentActivities: recentActivities.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      metadata: log.metadata,
      createdAt: log.createdAt,
      userName: log.user ? log.user.name : "System",
    })),
  };
};

const getAssetUtilization = async () => {
  const allocationsGroup = await prisma.assetAllocation.groupBy({
    by: ["assetId"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 5,
  });

  const topAllocatedAssets = [];
  for (const item of allocationsGroup) {
    const asset = await prisma.asset.findUnique({
      where: { id: item.assetId },
      select: { id: true, name: true, assetTag: true },
    });
    if (asset) {
      topAllocatedAssets.push({
        ...asset,
        allocationCount: item._count.id,
      });
    }
  }

  const idleAssets = await prisma.asset.findMany({
    where: {
      status: "AVAILABLE",
      allocations: {
        none: {},
      },
    },
    select: {
      id: true,
      name: true,
      assetTag: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
    take: 5,
  });

  return {
    topAllocatedAssets,
    idleAssets,
  };
};

const getMaintenanceReport = async () => {
  const maintenanceGroup = await prisma.maintenanceRequest.groupBy({
    by: ["assetId"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 5,
  });

  const topRepairedAssets = [];
  for (const item of maintenanceGroup) {
    const asset = await prisma.asset.findUnique({
      where: { id: item.assetId },
      select: { id: true, name: true, assetTag: true },
    });
    if (asset) {
      topRepairedAssets.push({
        ...asset,
        maintenanceCount: item._count.id,
      });
    }
  }

  const statuses = ["PENDING", "APPROVED", "REJECTED", "ASSIGNED", "IN_PROGRESS", "RESOLVED"];
  const statusCounts = {};
  for (const stat of statuses) {
    statusCounts[stat] = await prisma.maintenanceRequest.count({
      where: { status: stat },
    });
  }

  return {
    topRepairedAssets,
    statusCounts,
  };
};

const getBookingReport = async () => {
  const bookingsGroup = await prisma.resourceBooking.groupBy({
    by: ["assetId"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 5,
  });

  const topBookedResources = [];
  for (const item of bookingsGroup) {
    const asset = await prisma.asset.findUnique({
      where: { id: item.assetId },
      select: { id: true, name: true, assetTag: true },
    });
    if (asset) {
      topBookedResources.push({
        ...asset,
        bookingCount: item._count.id,
      });
    }
  }

  return {
    topBookedResources,
  };
};

const getDepartmentReport = async () => {
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          employees: true,
          assets: true,
        },
      },
    },
  });

  return {
    departments: departments.map((d) => ({
      id: d.id,
      name: d.name,
      employeeCount: d._count.employees,
      assetCount: d._count.assets,
    })),
  };
};

const getAuditReport = async () => {
  const [totalCycles, completedCycles, missingCount, damagedCount] = await prisma.$transaction([
    prisma.auditCycle.count(),
    prisma.auditCycle.count({ where: { status: "CLOSED" } }),
    prisma.auditItem.count({ where: { result: "MISSING" } }),
    prisma.auditItem.count({ where: { result: "DAMAGED" } }),
  ]);

  return {
    statistics: {
      totalCycles,
      completedCycles,
      missingCount,
      damagedCount,
    },
  };
};

module.exports = {
  getDashboardData,
  getAssetUtilization,
  getMaintenanceReport,
  getBookingReport,
  getDepartmentReport,
  getAuditReport,
};
