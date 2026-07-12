const prisma = require("../config/db");

const getAdminDashboard = async (userId) => {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

  const [
    availableAssets,
    allocatedAssets,
    underMaintenance,
    lostAssets,
    retiredAssets,
    maintenanceToday,
    activeBookings,
    pendingTransfers,
    upcomingReturns,
    overdueReturns,
    recentActivities,
    notifications,
    maintenanceRequests,
    bookingsToday,
  ] = await prisma.$transaction([
    prisma.asset.count({ where: { status: "AVAILABLE" } }),
    prisma.asset.count({ where: { status: "ALLOCATED" } }),
    prisma.asset.count({ where: { status: "UNDER_MAINTENANCE" } }),
    prisma.asset.count({ where: { status: "LOST" } }),
    prisma.asset.count({ where: { status: "RETIRED" } }),
    prisma.maintenanceRequest.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.resourceBooking.count({ where: { status: "ONGOING" } }),
    prisma.transferRequest.count({ where: { status: "PENDING" } }),
    prisma.assetAllocation.count({
      where: {
        status: "ACTIVE",
        expectedReturnDate: { gte: now, lte: sevenDaysLater },
      },
    }),
    prisma.assetAllocation.count({ where: { status: "OVERDUE" } }),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.notification.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.maintenanceRequest.findMany({
      where: { status: { notIn: ["RESOLVED", "REJECTED"] } },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { asset: { select: { name: true, assetTag: true } } },
    }),
    prisma.resourceBooking.findMany({
      where: { startTime: { gte: todayStart } },
      orderBy: { startTime: "asc" },
      include: { asset: { select: { name: true, assetTag: true } } },
    }),
  ]);

  return {
    kpis: {
      availableAssets,
      allocatedAssets,
      underMaintenance,
      lostAssets,
      retiredAssets,
      maintenanceToday,
      activeBookings,
      pendingTransfers,
      upcomingReturns,
      overdueReturns,
    },
    recentActivities: recentActivities.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      metadata: log.metadata,
      createdAt: log.createdAt,
      userName: log.user ? log.user.name : "System",
    })),
    notifications,
    maintenanceRequests,
    bookingsToday,
  };
};

const getManagerDashboard = async (userId) => {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

  const [
    availableAssets,
    allocatedAssets,
    underMaintenance,
    lostAssets,
    retiredAssets,
    maintenanceToday,
    activeBookings,
    pendingTransfers,
    upcomingReturns,
    overdueReturns,
    recentActivities,
    notifications,
    maintenanceRequests,
    pendingTransfersList,
  ] = await prisma.$transaction([
    prisma.asset.count({ where: { status: "AVAILABLE" } }),
    prisma.asset.count({ where: { status: "ALLOCATED" } }),
    prisma.asset.count({ where: { status: "UNDER_MAINTENANCE" } }),
    prisma.asset.count({ where: { status: "LOST" } }),
    prisma.asset.count({ where: { status: "RETIRED" } }),
    prisma.maintenanceRequest.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.resourceBooking.count({ where: { status: "ONGOING" } }),
    prisma.transferRequest.count({ where: { status: "PENDING" } }),
    prisma.assetAllocation.count({
      where: {
        status: "ACTIVE",
        expectedReturnDate: { gte: now, lte: sevenDaysLater },
      },
    }),
    prisma.assetAllocation.count({ where: { status: "OVERDUE" } }),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.notification.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.maintenanceRequest.findMany({
      where: { status: { notIn: ["RESOLVED", "REJECTED"] } },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { asset: { select: { name: true, assetTag: true } } },
    }),
    prisma.transferRequest.findMany({
      where: { status: "PENDING" },
      take: 5,
      orderBy: { requestedAt: "desc" },
      include: {
        asset: { select: { name: true, assetTag: true } },
        fromEmployee: { select: { name: true } },
        toEmployee: { select: { name: true } },
      },
    }),
  ]);

  return {
    kpis: {
      availableAssets,
      allocatedAssets,
      underMaintenance,
      lostAssets,
      retiredAssets,
      maintenanceToday,
      activeBookings,
      pendingTransfers,
      upcomingReturns,
      overdueReturns,
    },
    recentActivities: recentActivities.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      metadata: log.metadata,
      createdAt: log.createdAt,
      userName: log.user ? log.user.name : "System",
    })),
    notifications,
    maintenanceRequests,
    pendingTransfers: pendingTransfersList,
  };
};

const getDepartmentDashboard = async (userId) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  let dept = await prisma.department.findFirst({
    where: { headId: userId },
  });

  if (!dept) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.departmentId) {
      dept = await prisma.department.findUnique({ where: { id: user.departmentId } });
    }
  }

  const departmentId = dept?.id;

  if (!departmentId) {
    return {
      kpis: { departmentAssets: 0, departmentEmployees: 0, departmentBookings: 0, activeAllocations: 0 },
      recentActivities: [],
      notifications: [],
      departmentAssetsList: [],
      bookingsToday: [],
    };
  }

  const [
    departmentAssets,
    departmentEmployees,
    departmentBookings,
    activeAllocations,
    recentActivities,
    notifications,
    departmentAssetsList,
    bookingsToday,
  ] = await prisma.$transaction([
    prisma.asset.count({ where: { departmentId } }),
    prisma.user.count({ where: { departmentId } }),
    prisma.resourceBooking.count({
      where: {
        status: { not: "CANCELLED" },
        asset: { departmentId },
      },
    }),
    prisma.assetAllocation.count({
      where: {
        status: { in: ["ACTIVE", "OVERDUE"] },
        employee: { departmentId },
      },
    }),
    prisma.activityLog.findMany({
      where: { user: { departmentId } },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.notification.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.asset.findMany({
      where: { departmentId },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.resourceBooking.findMany({
      where: {
        startTime: { gte: todayStart },
        asset: { departmentId },
      },
      orderBy: { startTime: "asc" },
      include: { asset: { select: { name: true, assetTag: true } } },
    }),
  ]);

  return {
    kpis: {
      departmentAssets,
      departmentEmployees,
      departmentBookings,
      activeAllocations,
    },
    recentActivities: recentActivities.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      metadata: log.metadata,
      createdAt: log.createdAt,
      userName: log.user ? log.user.name : "System",
    })),
    notifications,
    departmentAssetsList,
    bookingsToday,
  };
};

const getEmployeeDashboard = async (userId) => {
  const [
    myAssets,
    myBookings,
    myNotifications,
    myMaintenanceRequests,
    recentActivities,
    notifications,
    myAllocatedAssets,
    myBookingsList,
  ] = await prisma.$transaction([
    prisma.assetAllocation.count({
      where: {
        employeeId: userId,
        status: { in: ["ACTIVE", "OVERDUE"] },
      },
    }),
    prisma.resourceBooking.count({
      where: {
        bookedById: userId,
        status: { in: ["UPCOMING", "ONGOING"] },
      },
    }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
    prisma.maintenanceRequest.count({
      where: {
        raisedById: userId,
        status: { notIn: ["RESOLVED", "REJECTED"] },
      },
    }),
    prisma.activityLog.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.notification.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.assetAllocation.findMany({
      where: {
        employeeId: userId,
        status: { in: ["ACTIVE", "OVERDUE"] },
      },
      include: { asset: { select: { name: true, assetTag: true, status: true } } },
    }),
    prisma.resourceBooking.findMany({
      where: {
        bookedById: userId,
        status: { in: ["UPCOMING", "ONGOING"] },
      },
      orderBy: { startTime: "asc" },
      include: { asset: { select: { name: true, assetTag: true } } },
    }),
  ]);

  return {
    kpis: {
      myAssets,
      myBookings,
      myNotifications,
      myMaintenanceRequests,
    },
    recentActivities: recentActivities.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      metadata: log.metadata,
      createdAt: log.createdAt,
      userName: log.user ? log.user.name : "System",
    })),
    notifications,
    myAllocatedAssets,
    myBookingsList,
  };
};

module.exports = {
  getAdminDashboard,
  getManagerDashboard,
  getDepartmentDashboard,
  getEmployeeDashboard,
};
