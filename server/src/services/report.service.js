const prisma = require("../config/db");

const getAssetUtilization = async () => {
  // 1. Most used assets (by allocation count)
  const mostUsedGroup = await prisma.assetAllocation.groupBy({
    by: ["assetId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  const mostUsedAssets = [];
  for (const item of mostUsedGroup) {
    const asset = await prisma.asset.findUnique({
      where: { id: item.assetId },
      select: { id: true, name: true, assetTag: true },
    });
    if (asset) {
      mostUsedAssets.push({ ...asset, allocationCount: item._count.id });
    }
  }

  // 2. Least used assets
  const leastUsedGroup = await prisma.assetAllocation.groupBy({
    by: ["assetId"],
    _count: { id: true },
    orderBy: { _count: { id: "asc" } },
    take: 5,
  });

  const leastUsedAssets = [];
  for (const item of leastUsedGroup) {
    const asset = await prisma.asset.findUnique({
      where: { id: item.assetId },
      select: { id: true, name: true, assetTag: true },
    });
    if (asset) {
      leastUsedAssets.push({ ...asset, allocationCount: item._count.id });
    }
  }

  // 3. Retired, Lost, Under Maintenance assets
  const [retiredAssets, lostAssets, underMaintenance] = await prisma.$transaction([
    prisma.asset.findMany({ where: { status: "RETIRED" }, select: { id: true, name: true, assetTag: true, location: true }, take: 10 }),
    prisma.asset.findMany({ where: { status: "LOST" }, select: { id: true, name: true, assetTag: true, location: true }, take: 10 }),
    prisma.asset.findMany({ where: { status: "UNDER_MAINTENANCE" }, select: { id: true, name: true, assetTag: true, location: true }, take: 10 }),
  ]);

  return {
    mostUsedAssets,
    leastUsedAssets,
    retiredAssets,
    lostAssets,
    underMaintenance,
  };
};

const getDepartmentSummary = async () => {
  const departments = await prisma.department.findMany({
    include: {
      employees: { select: { id: true } },
      assets: { select: { id: true, status: true } },
    },
  });

  const departmentSummaryList = departments.map((d) => {
    const employeesCount = d.employees.length;
    const assetsCount = d.assets.length;
    const allocatedCount = d.assets.filter((a) => a.status === "ALLOCATED").length;

    return {
      name: d.name,
      employees: employeesCount,
      assets: assetsCount,
      allocated: allocatedCount,
    };
  });

  return {
    departments: departmentSummaryList,
  };
};

const getMaintenanceReport = async () => {
  const [pending, resolved] = await prisma.$transaction([
    prisma.maintenanceRequest.count({ where: { status: "PENDING" } }),
    prisma.maintenanceRequest.count({ where: { status: "RESOLVED" } }),
  ]);

  // Average repair time for RESOLVED requests
  const resolvedRequests = await prisma.maintenanceRequest.findMany({
    where: { status: "RESOLVED", resolvedAt: { not: null } },
    select: { createdAt: true, resolvedAt: true },
  });

  let averageRepairTime = "0 Days";
  if (resolvedRequests.length > 0) {
    let totalMs = 0;
    for (const req of resolvedRequests) {
      totalMs += req.resolvedAt.getTime() - req.createdAt.getTime();
    }
    const avgMs = totalMs / resolvedRequests.length;
    const avgDays = Math.round(avgMs / (1000 * 60 * 60 * 24));
    averageRepairTime = `${avgDays} ${avgDays === 1 ? "Day" : "Days"}`;
  }

  // Most repaired assets
  const mostRepairedGroup = await prisma.maintenanceRequest.groupBy({
    by: ["assetId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  const mostRepairedAssets = [];
  for (const item of mostRepairedGroup) {
    const asset = await prisma.asset.findUnique({
      where: { id: item.assetId },
      select: { id: true, name: true, assetTag: true },
    });
    if (asset) {
      mostRepairedAssets.push({ ...asset, repairCount: item._count.id });
    }
  }

  return {
    pending,
    resolved,
    averageRepairTime,
    mostRepairedAssets,
  };
};

const getBookingReport = async () => {
  const [cancelledBookings, activeBookings, allBookings] = await prisma.$transaction([
    prisma.resourceBooking.count({ where: { status: "CANCELLED" } }),
    prisma.resourceBooking.count({ where: { status: { in: ["UPCOMING", "ONGOING"] } } }),
    prisma.resourceBooking.findMany({
      where: { status: { not: "CANCELLED" } },
      select: { startTime: true },
    }),
  ]);

  // Calculate peak hours
  const hourCounts = Array(24).fill(0);
  for (const b of allBookings) {
    const hour = b.startTime.getHours();
    hourCounts[hour]++;
  }

  const peakHours = hourCounts
    .map((count, hour) => ({ hour: `${hour}:00`, bookingCount: count }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 5);

  // Most booked resources
  const mostBookedGroup = await prisma.resourceBooking.groupBy({
    by: ["assetId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  const mostBookedResources = [];
  for (const item of mostBookedGroup) {
    const asset = await prisma.asset.findUnique({
      where: { id: item.assetId },
      select: { id: true, name: true, assetTag: true },
    });
    if (asset) {
      mostBookedResources.push({ ...asset, bookingCount: item._count.id });
    }
  }

  return {
    peakHours,
    mostBookedResources,
    cancelledBookings,
    activeBookings,
  };
};

const getAuditReport = async () => {
  const [activeAudits, completedAudits, missingAssets, damagedAssets] = await prisma.$transaction([
    prisma.auditCycle.count({ where: { status: "ACTIVE" } }),
    prisma.auditCycle.count({ where: { status: "CLOSED" } }),
    prisma.auditItem.count({ where: { result: "MISSING" } }),
    prisma.auditItem.count({ where: { result: "DAMAGED" } }),
  ]);

  return {
    activeAudits,
    completedAudits,
    missingAssets,
    damagedAssets,
  };
};

const getDashboardReport = async () => {
  const now = new Date();
  const [
    assetsAvailable,
    assetsAllocated,
    underMaintenance,
    activeBookings,
    pendingTransfers,
    upcomingReturns,
    overdueReturns,
  ] = await prisma.$transaction([
    prisma.asset.count({ where: { status: "AVAILABLE" } }),
    prisma.asset.count({ where: { status: "ALLOCATED" } }),
    prisma.asset.count({ where: { status: "UNDER_MAINTENANCE" } }),
    prisma.resourceBooking.count({ where: { status: "ONGOING" } }),
    prisma.transferRequest.count({ where: { status: "PENDING" } }),
    prisma.assetAllocation.count({ where: { status: "ACTIVE", expectedReturnDate: { gte: now } } }),
    prisma.assetAllocation.count({ where: { status: "OVERDUE" } }),
  ]);

  return {
    assetsAvailable,
    assetsAllocated,
    underMaintenance,
    activeBookings,
    pendingTransfers,
    upcomingReturns,
    overdueReturns,
  };
};

const exportCSV = async (type) => {
  let csvContent = "";
  let filename = "report.csv";

  if (type === "assets") {
    filename = "assets_report.csv";
    const assets = await prisma.asset.findMany({
      include: {
        category: { select: { name: true } },
        department: { select: { name: true } },
      },
    });

    csvContent = "Asset Tag,Name,Serial Number,Category,Department,Status,Condition,Purchase Cost,Location\n";
    for (const a of assets) {
      csvContent += `"${a.assetTag}","${a.name}","${a.serialNumber || ""}","${a.category?.name || ""}","${a.department?.name || ""}","${a.status}","${a.condition}","${a.purchaseCost || 0}","${a.location || ""}"\n`;
    }
  } else if (type === "maintenance") {
    filename = "maintenance_report.csv";
    const requests = await prisma.maintenanceRequest.findMany({
      include: {
        asset: { select: { assetTag: true } },
        raisedBy: { select: { name: true } },
      },
    });

    csvContent = "Request ID,Asset Tag,Raised By,Issue,Priority,Status,Technician,Resolved At\n";
    for (const r of requests) {
      csvContent += `"${r.id}","${r.asset?.assetTag || ""}","${r.raisedBy?.name || ""}","${r.issue.replace(/"/g, '""')}","${r.priority}","${r.status}","${r.technician || ""}","${r.resolvedAt ? r.resolvedAt.toISOString() : ""}"\n`;
    }
  } else if (type === "bookings") {
    filename = "bookings_report.csv";
    const bookings = await prisma.resourceBooking.findMany({
      include: {
        asset: { select: { assetTag: true } },
        bookedBy: { select: { name: true } },
      },
    });

    csvContent = "Booking ID,Asset Tag,Booked By,Start Time,End Time,Status\n";
    for (const b of bookings) {
      csvContent += `"${b.id}","${b.asset?.assetTag || ""}","${b.bookedBy?.name || ""}","${b.startTime.toISOString()}","${b.endTime.toISOString()}","${b.status}"\n`;
    }
  } else if (type === "departments") {
    filename = "departments_report.csv";
    const departments = await prisma.department.findMany({
      include: {
        head: { select: { name: true } },
        _count: { select: { assets: true, employees: true } },
      },
    });

    csvContent = "Department Name,Head Employee,Status,Total Employees,Total Assets\n";
    for (const d of departments) {
      csvContent += `"${d.name}","${d.head?.name || ""}","${d.status}","${d._count.employees}","${d._count.assets}"\n`;
    }
  } else if (type === "audits") {
    filename = "audits_report.csv";
    const cycles = await prisma.auditCycle.findMany();

    csvContent = "Cycle Title,Status,Scope,Location,Start Date,End Date\n";
    for (const c of cycles) {
      csvContent += `"${c.title}","${c.status}","${c.scope || ""}","${c.location || ""}","${c.startDate.toISOString()}","${c.endDate.toISOString()}"\n`;
    }
  } else {
    throw new Error("Invalid export type specified.");
  }

  return {
    csvContent,
    filename,
  };
};

module.exports = {
  getAssetUtilization,
  getDepartmentSummary,
  getMaintenanceReport,
  getBookingReport,
  getAuditReport,
  getDashboardReport,
  exportCSV,
};
