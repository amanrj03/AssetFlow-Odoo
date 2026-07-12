const prisma = require("../config/db");

/**
 * Validates that setting `parentId` as the parent of `departmentId` will not create a circular dependency.
 * @param {string} departmentId 
 * @param {string} parentId 
 */
const validateDepartmentHierarchy = async (departmentId, parentId) => {
  if (departmentId === parentId) {
    throw new Error("A department cannot be its own parent.");
  }

  let currentParentId = parentId;
  while (currentParentId) {
    const parentDep = await prisma.department.findUnique({
      where: { id: currentParentId },
      select: { id: true, parentDepartmentId: true },
    });

    if (!parentDep) {
      break;
    }

    if (parentDep.parentDepartmentId === departmentId) {
      throw new Error("Circular dependency detected: The selected parent department is a sub-department of this department.");
    }

    currentParentId = parentDep.parentDepartmentId;
  }
};

const getDepartments = async ({ search, status, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, departments] = await prisma.$transaction([
    prisma.department.count({ where }),
    prisma.department.findMany({
      where,
      skip,
      take,
      include: {
        parentDepartment: { select: { id: true, name: true } },
        head: { select: { id: true, name: true, email: true } },
        _count: {
          select: {
            users: true,
            assets: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const formattedDepartments = departments.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    status: d.status,
    parentDepartmentId: d.parentDepartmentId,
    parentDepartment: d.parentDepartment,
    headId: d.headId,
    head: d.head,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    employeeCount: d._count.users,
    assetCount: d._count.assets,
  }));

  return {
    departments: formattedDepartments,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getDepartmentById = async (id) => {
  const d = await prisma.department.findUnique({
    where: { id },
    include: {
      parentDepartment: { select: { id: true, name: true } },
      head: { select: { id: true, name: true, email: true } },
      _count: {
        select: {
          users: true,
          assets: true,
        },
      },
    },
  });

  if (!d) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: d.id,
    name: d.name,
    description: d.description,
    status: d.status,
    parentDepartmentId: d.parentDepartmentId,
    parentDepartment: d.parentDepartment,
    headId: d.headId,
    head: d.head,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    employeeCount: d._count.users,
    assetCount: d._count.assets,
  };
};

const createDepartment = async (data, adminUserId) => {
  const { name, description, parentDepartmentId, headId, status } = data;

  // 1. Unique Name Check
  const existing = await prisma.department.findUnique({
    where: { name },
  });
  if (existing) {
    const error = new Error("Department name already exists.");
    error.statusCode = 400;
    throw error;
  }

  // 2. Parent Department Exists Check
  if (parentDepartmentId) {
    const parent = await prisma.department.findUnique({
      where: { id: parentDepartmentId },
    });
    if (!parent) {
      const error = new Error("Parent department does not exist.");
      error.statusCode = 400;
      throw error;
    }
  }

  // 3. Create Department
  const department = await prisma.department.create({
    data: {
      name,
      description,
      parentDepartmentId,
      status: status || "ACTIVE",
    },
  });

  // 4. Assign Head if provided
  if (headId) {
    await assignDepartmentHead(department.id, headId, adminUserId);
  }

  // 5. Activity Log
  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "CREATE_DEPARTMENT",
      entity: "Department",
      entityId: department.id,
      metadata: { name: department.name },
    },
  });

  return getDepartmentById(department.id);
};

const updateDepartment = async (id, data, adminUserId) => {
  const { name, description, parentDepartmentId, status } = data;

  // 1. Fetch Department
  const department = await prisma.department.findUnique({
    where: { id },
  });
  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  const updatePayload = {};

  // 2. Duplicate Name Check on Update
  if (name && name !== department.name) {
    const existing = await prisma.department.findUnique({
      where: { name },
    });
    if (existing) {
      const error = new Error("Department name already exists.");
      error.statusCode = 400;
      throw error;
    }
    updatePayload.name = name;
  }

  if (description !== undefined) {
    updatePayload.description = description;
  }

  if (status !== undefined) {
    updatePayload.status = status;
  }

  // 3. Parent / Child Cycle & Self Parent Checks
  if (parentDepartmentId !== undefined) {
    if (parentDepartmentId) {
      const parent = await prisma.department.findUnique({
        where: { id: parentDepartmentId },
      });
      if (!parent) {
        const error = new Error("Parent department does not exist.");
        error.statusCode = 400;
        throw error;
      }
      await validateDepartmentHierarchy(id, parentDepartmentId);
    }
    updatePayload.parentDepartmentId = parentDepartmentId;
  }

  // 4. Update Database
  const updatedDepartment = await prisma.department.update({
    where: { id },
    data: updatePayload,
  });

  // 5. Activity Log
  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "UPDATE_DEPARTMENT",
      entity: "Department",
      entityId: id,
      metadata: { updatedFields: Object.keys(updatePayload) },
    },
  });

  return getDepartmentById(id);
};

const assignDepartmentHead = async (id, headId, adminUserId) => {
  // 1. Check Department
  const department = await prisma.department.findUnique({
    where: { id },
  });
  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check User
  const user = await prisma.user.findUnique({
    where: { id: headId },
  });
  if (!user) {
    const error = new Error("User assigned as department head not found.");
    error.statusCode = 400;
    throw error;
  }

  // 3. Prevent Multiple Heads for One User
  const otherHeading = await prisma.department.findFirst({
    where: { headId, id: { not: id } },
  });
  if (otherHeading) {
    const error = new Error(`User is already heading the '${otherHeading.name}' department.`);
    error.statusCode = 400;
    throw error;
  }

  // 4. Assign Head (only assign headId if it's changing)
  if (department.headId !== headId) {
    await prisma.$transaction([
      prisma.department.update({
        where: { id },
        data: { headId },
      }),
      // Promote new head to DEPARTMENT_HEAD (no automatic demotion of old head)
      prisma.user.update({
        where: { id: headId },
        data: { role: "DEPARTMENT_HEAD" },
      }),
    ]);

    // 5. Activity Log
    await prisma.activityLog.create({
      data: {
        userId: adminUserId,
        action: "ASSIGN_DEPARTMENT_HEAD",
        entity: "Department",
        entityId: id,
        metadata: { headId, employeeName: user.name },
      },
    });
  }

  return getDepartmentById(id);
};

const softDeleteDepartment = async (id, adminUserId) => {
  // 1. Check Department
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          users: true,
          assets: true,
        },
      },
    },
  });

  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  // 2. Deletion checks: check if department has users or assets
  if (department._count.users > 0 || department._count.assets > 0) {
    const error = new Error("Department cannot be deleted because it contains active employees or assets.");
    error.statusCode = 400;
    throw error;
  }

  // 3. Hard delete from database
  await prisma.department.delete({
    where: { id },
  });

  // 4. Activity Log
  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "DELETE_DEPARTMENT",
      entity: "Department",
      entityId: id,
      metadata: { name: department.name },
    },
  });

  return { id, deleted: true };
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  assignDepartmentHead,
  softDeleteDepartment,
  validateDepartmentHierarchy,
};
