const prisma = require("../config/db");

const getNotifications = async ({ userId, isRead, type, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = { userId };

  if (isRead !== undefined) {
    where.isRead = isRead;
  }

  if (type) {
    where.type = type;
  }

  const [total, notifications] = await prisma.$transaction([
    prisma.notification.count({ where }),
    prisma.notification.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    notifications,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getNotificationById = async (id, userId) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification || notification.userId !== userId) {
    const error = new Error("Notification not found.");
    error.statusCode = 404;
    throw error;
  }

  return notification;
};

const markAsRead = async (id, userId) => {
  await getNotificationById(id, userId);

  const updatedNotification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return updatedNotification;
};

const markAllAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { count: result.count };
};

const deleteNotification = async (id, userId) => {
  await getNotificationById(id, userId);

  await prisma.notification.delete({
    where: { id },
  });

  return { success: true };
};

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
