const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

const DepartmentStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

const AssetStatus = {
  AVAILABLE: "AVAILABLE",
  ALLOCATED: "ALLOCATED",
  RESERVED: "RESERVED",
  UNDER_MAINTENANCE: "UNDER_MAINTENANCE",
  LOST: "LOST",
  RETIRED: "RETIRED",
  DISPOSED: "DISPOSED",
};

const AllocationStatus = {
  ACTIVE: "ACTIVE",
  RETURNED: "RETURNED",
  OVERDUE: "OVERDUE",
};

const TransferStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

const BookingStatus = {
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

const MaintenanceStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
};

const AuditStatus = {
  UPCOMING: "UPCOMING",
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED",
};

module.exports = {
  UserStatus,
  DepartmentStatus,
  AssetStatus,
  AllocationStatus,
  TransferStatus,
  BookingStatus,
  MaintenanceStatus,
  AuditStatus,
};
// 
