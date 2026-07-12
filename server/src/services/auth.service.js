const bcrypt = require("bcrypt");
const prisma = require("../config/db");
const { generateToken } = require("../utils/jwt");
const Messages = require("../constants/messages");

const signup = async (userData) => {
  const { name, email, password, phone, employeeCode } = userData;

  // 1. Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error(Messages.AUTH.EMAIL_EXISTS);
    error.statusCode = 400;
    throw error;
  }

  // 2. Generate employee code if not provided
  let finalEmployeeCode = employeeCode;
  if (!finalEmployeeCode) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    finalEmployeeCode = `EMP-${randomSuffix}`;

    const codeExists = await prisma.user.findUnique({
      where: { employeeCode: finalEmployeeCode },
    });
    if (codeExists) {
      finalEmployeeCode = `EMP-${randomSuffix + 1}`;
    }
  } else {
    const codeExists = await prisma.user.findUnique({
      where: { employeeCode: finalEmployeeCode },
    });
    if (codeExists) {
      const error = new Error(Messages.AUTH.EMPLOYEE_CODE_EXISTS);
      error.statusCode = 400;
      throw error;
    }
  }

  // 3. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Create user (Force role to EMPLOYEE, status to ACTIVE)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      employeeCode: finalEmployeeCode,
      role: "EMPLOYEE",
      status: "ACTIVE",
    },
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
    },
  });

  // 5. Generate token
  const token = generateToken({ id: user.id, role: user.role });

  return { user, token };
};

const login = async (email, password) => {
  // 1. Retrieve user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error(Messages.AUTH.INVALID_CREDENTIALS);
    error.statusCode = 400;
    throw error;
  }

  if (user.status !== "ACTIVE") {
    const error = new Error("Access Denied: Account is deactivated.");
    error.statusCode = 403;
    throw error;
  }

  // 2. Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error(Messages.AUTH.INVALID_CREDENTIALS);
    error.statusCode = 400;
    throw error;
  }

  // 3. Generate token
  const token = generateToken({ id: user.id, role: user.role });

  // 4. Prepare return object (exclude password)
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
    },
  });

  if (!user) {
    const error = new Error(Messages.AUTH.NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  signup,
  login,
  getCurrentUser,
};
