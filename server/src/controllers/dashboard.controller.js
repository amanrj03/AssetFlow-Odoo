const dashboardService = require("../services/dashboard.service");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
  const { role, id } = req.user;
  let data;

  if (role === "ADMIN") {
    data = await dashboardService.getAdminDashboard(id);
  } else if (role === "ASSET_MANAGER") {
    data = await dashboardService.getManagerDashboard(id);
  } else if (role === "DEPARTMENT_HEAD") {
    data = await dashboardService.getDepartmentDashboard(id);
  } else {
    data = await dashboardService.getEmployeeDashboard(id);
  }

  return sendSuccess(res, "Dashboard data retrieved successfully", data);
});

module.exports = {
  getDashboard,
};
