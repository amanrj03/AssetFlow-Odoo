const activityLogService = require("../services/activityLog.service");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getActivityLogs = asyncHandler(async (req, res) => {
  let { userId, action, entity, page, limit } = req.query;

  let departmentId = undefined;
  if (req.user.role === "DEPARTMENT_HEAD") {
    departmentId = req.user.departmentId;
  } else if (req.user.role === "EMPLOYEE") {
    userId = req.user.id;
  }

  const result = await activityLogService.getActivityLogs({
    userId,
    departmentId,
    action,
    entity,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return sendSuccess(res, "Activity logs retrieved successfully", result);
});

const getActivityLogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const log = await activityLogService.getActivityLogById(id);
  return sendSuccess(res, "Activity log retrieved successfully", { log });
});

module.exports = {
  getActivityLogs,
  getActivityLogById,
};
