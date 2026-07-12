const reportService = require("../services/report.service");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
  const result = await reportService.getDashboardData();
  return sendSuccess(res, "Dashboard statistics retrieved successfully", result);
});

const getAssetUtilization = asyncHandler(async (req, res) => {
  const result = await reportService.getAssetUtilization();
  return sendSuccess(res, "Asset utilization report retrieved successfully", result);
});

const getMaintenanceReport = asyncHandler(async (req, res) => {
  const result = await reportService.getMaintenanceReport();
  return sendSuccess(res, "Maintenance frequency report retrieved successfully", result);
});

const getBookingReport = asyncHandler(async (req, res) => {
  const result = await reportService.getBookingReport();
  return sendSuccess(res, "Booking report retrieved successfully", result);
});

const getDepartmentReport = asyncHandler(async (req, res) => {
  const result = await reportService.getDepartmentReport();
  return sendSuccess(res, "Department statistics retrieved successfully", result);
});

const getAuditReport = asyncHandler(async (req, res) => {
  const result = await reportService.getAuditReport();
  return sendSuccess(res, "Audit summary report retrieved successfully", result);
});

module.exports = {
  getDashboard,
  getAssetUtilization,
  getMaintenanceReport,
  getBookingReport,
  getDepartmentReport,
  getAuditReport,
};
