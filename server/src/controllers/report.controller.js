const reportService = require("../services/report.service");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getAssetUtilization = asyncHandler(async (req, res) => {
  const result = await reportService.getAssetUtilization();
  return sendSuccess(res, "Asset utilization report retrieved successfully", result);
});

const getDepartmentSummary = asyncHandler(async (req, res) => {
  const result = await reportService.getDepartmentSummary();
  return sendSuccess(res, "Department summary report retrieved successfully", result);
});

const getMaintenanceReport = asyncHandler(async (req, res) => {
  const result = await reportService.getMaintenanceReport();
  return sendSuccess(res, "Maintenance frequency report retrieved successfully", result);
});

const getBookingReport = asyncHandler(async (req, res) => {
  const result = await reportService.getBookingReport();
  return sendSuccess(res, "Booking report retrieved successfully", result);
});

const getAuditReport = asyncHandler(async (req, res) => {
  const result = await reportService.getAuditReport();
  return sendSuccess(res, "Audit summary report retrieved successfully", result);
});

const getDashboardReport = asyncHandler(async (req, res) => {
  const result = await reportService.getDashboardReport();
  return sendSuccess(res, "Combined dashboard analytics report retrieved successfully", result);
});

const exportCSV = asyncHandler(async (req, res) => {
  const { type } = req.query;

  try {
    const { csvContent, filename } = await reportService.exportCSV(type);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  getAssetUtilization,
  getDepartmentSummary,
  getMaintenanceReport,
  getBookingReport,
  getAuditReport,
  getDashboardReport,
  exportCSV,
};
