const notificationService = require("../services/notification.service");
const { notificationQuerySchema } = require("../validators/notification.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getNotifications = asyncHandler(async (req, res) => {
  const { isRead, type, page, limit } = req.query;

  const validatedQuery = notificationQuerySchema.parse({ isRead, type });

  const result = await notificationService.getNotifications({
    userId: req.user.id,
    isRead: validatedQuery.isRead,
    type: validatedQuery.type,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return sendSuccess(res, "Notifications retrieved successfully", result);
});

const getNotificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await notificationService.getNotificationById(id, req.user.id);
  return sendSuccess(res, "Notification retrieved successfully", { notification });
});

const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await notificationService.markAsRead(id, req.user.id);
  return sendSuccess(res, "Notification marked as read successfully", { notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  return sendSuccess(res, "All notifications marked as read successfully", result);
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await notificationService.deleteNotification(id, req.user.id);
  return sendSuccess(res, "Notification deleted successfully", result);
});

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
