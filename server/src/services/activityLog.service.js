const prisma = require("../config/db");

const getActivityLogs = async ({ userId, departmentId, action, entity, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (entity) where.entity = entity;
  if (departmentId) {
    where.user = {
      departmentId: departmentId
    };
  }

  const [total, logs] = await prisma.$transaction([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  return {
    logs,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getActivityLogById = async (id) => {
  const log = await prisma.activityLog.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!log) {
    const error = new Error("Activity log not found.");
    error.statusCode = 404;
    throw error;
  }

  return log;
};

module.exports = {
  getActivityLogs,
  getActivityLogById,
};
