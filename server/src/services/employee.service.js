const prisma = require("../config/db");

const getEmployees = async ({ search, role, departmentId, status, page = 1, limit = 10, sort = "name" }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (status) {
    where.status = status;
  }

  if (role) {
    where.role = role;
  }

  if (departmentId) {
    where.departmentId = departmentId;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { employeeCode: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy = { name: "asc" };
  if (sort === "createdAt") {
    orderBy = { createdAt: "desc" };
  }

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        status: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    employees: users,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getEmployeeById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      employeeCode: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
      departmentId: true,
      createdAt: true,
      updatedAt: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const updateEmployee = async (id, data, adminUserId) => {
  const { name, phone, profileImage, departmentId } = data;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const updatePayload = {};

  if (name !== undefined) updatePayload.name = name;
  if (phone !== undefined) updatePayload.phone = phone;
  if (profileImage !== undefined) updatePayload.profileImage = profileImage;

  if (departmentId !== undefined) {
    if (departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: departmentId },
      });
      if (!dept) {
        const error = new Error("Department not found.");
        error.statusCode = 400;
        throw error;
      }
    }
    updatePayload.departmentId = departmentId;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updatePayload,
    select: {
      id: true,
      employeeCode: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
      departmentId: true,
      createdAt: true,
      updatedAt: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "UPDATE_EMPLOYEE_PROFILE",
      entity: "User",
      entityId: id,
      metadata: { name: updatedUser.name, updatedFields: Object.keys(updatePayload) },
    },
  });

  return updatedUser;
};

const promoteEmployee = async (employeeId, newRole, adminUserId) => {
  const user = await prisma.user.findUnique({
    where: { id: employeeId },
  });

  if (!user) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "ADMIN") {
    const error = new Error("Cannot modify the role of an Admin.");
    error.statusCode = 400;
    throw error;
  }

  const updatedUser = await prisma.user.update({
    where: { id: employeeId },
    data: { role: newRole },
    select: {
      id: true,
      employeeCode: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "PROMOTE_EMPLOYEE",
      entity: "User",
      entityId: employeeId,
      metadata: { name: updatedUser.name, newRole },
    },
  });

  return updatedUser;
};

const changeStatus = async (employeeId, status, adminUserId) => {
  const user = await prisma.user.findUnique({
    where: { id: employeeId },
  });

  if (!user) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "ADMIN") {
    const error = new Error("Cannot modify the status of an Admin.");
    error.statusCode = 400;
    throw error;
  }

  const updatedUser = await prisma.user.update({
    where: { id: employeeId },
    data: { status },
    select: {
      id: true,
      employeeCode: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "CHANGE_EMPLOYEE_STATUS",
      entity: "User",
      entityId: employeeId,
      metadata: { name: updatedUser.name, status },
    },
  });

  return updatedUser;
};

const changeDepartment = async (employeeId, departmentId, adminUserId) => {
  const user = await prisma.user.findUnique({
    where: { id: employeeId },
  });

  if (!user) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  if (departmentId) {
    const dept = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!dept) {
      const error = new Error("Department not found.");
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: employeeId },
    data: { departmentId },
    select: {
      id: true,
      employeeCode: true,
      name: true,
      email: true,
      role: true,
      status: true,
      departmentId: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "CHANGE_EMPLOYEE_DEPARTMENT",
      entity: "User",
      entityId: employeeId,
      metadata: { name: updatedUser.name, departmentId },
    },
  });

  return updatedUser;
};

module.exports = {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  promoteEmployee,
  changeStatus,
  changeDepartment,
};
