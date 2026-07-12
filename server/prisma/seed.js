const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning up database...");
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.auditItem.deleteMany({});
  await prisma.auditCycle.deleteMany({});
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.resourceBooking.deleteMany({});
  await prisma.assetAllocation.deleteMany({});
  await prisma.transferRequest.deleteMany({});
  await prisma.assetDocument.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.category.deleteMany({});
  
  await prisma.department.updateMany({ data: { headId: null } });
  await prisma.user.deleteMany({});
  await prisma.department.deleteMany({});

  console.log("🌱 Database cleaned.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  console.log("🌱 Seeding departments...");
  const deptIT = await prisma.department.create({
    data: {
      name: "Information Technology",
      description: "IT and Infrastructure support",
    },
  });

  const deptHR = await prisma.department.create({
    data: {
      name: "Human Resources",
      description: "HR operations and recruitment",
    },
  });

  const deptFinance = await prisma.department.create({
    data: {
      name: "Finance",
      description: "Accounting and accounts support",
    },
  });

  console.log("🌱 Seeding users...");
  const admin = await prisma.user.create({
    data: {
      email: "admin@assetflow.com",
      password: hashedPassword,
      name: "Admin User",
      employeeCode: "EMP001",
      role: "ADMIN",
      status: "ACTIVE",
      departmentId: deptIT.id,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@assetflow.com",
      password: hashedPassword,
      name: "Asset Manager User",
      employeeCode: "EMP002",
      role: "ASSET_MANAGER",
      status: "ACTIVE",
      departmentId: deptIT.id,
    },
  });

  const head = await prisma.user.create({
    data: {
      email: "head@assetflow.com",
      password: hashedPassword,
      name: "IT Department Head",
      employeeCode: "EMP003",
      role: "DEPARTMENT_HEAD",
      status: "ACTIVE",
      departmentId: deptIT.id,
    },
  });

  const employee = await prisma.user.create({
    data: {
      email: "employee@assetflow.com",
      password: hashedPassword,
      name: "Regular Employee User",
      employeeCode: "EMP004",
      role: "EMPLOYEE",
      status: "ACTIVE",
      departmentId: deptHR.id,
    },
  });

  await prisma.department.update({
    where: { id: deptIT.id },
    data: { headId: head.id },
  });

  console.log("🌱 Seeding categories...");
  const catLaptops = await prisma.category.create({
    data: {
      name: "Laptops",
      description: "Developer workstations and business notebooks",
    },
  });

  const catRooms = await prisma.category.create({
    data: {
      name: "Meeting Rooms",
      description: "Shared collaborative office spaces",
    },
  });

  console.log("🌱 Seeding assets...");
  const assetWorkstation = await prisma.asset.create({
    data: {
      assetTag: "AF-000001",
      name: "ThinkPad Workstation",
      serialNumber: "SN123456789",
      categoryId: catLaptops.id,
      departmentId: deptIT.id,
      createdBy: admin.id,
      condition: "EXCELLENT",
      status: "AVAILABLE",
      isBookable: false,
      purchaseCost: 1500,
      location: "HQ - 3rd Floor",
      qrCode: "https://res.cloudinary.com/demo/image/upload/v1570975825/sample.jpg",
    },
  });

  const assetRoom = await prisma.asset.create({
    data: {
      assetTag: "AF-000002",
      name: "Conference Room Alpha",
      serialNumber: "ROOM_ALPHA_101",
      categoryId: catRooms.id,
      departmentId: deptIT.id,
      createdBy: admin.id,
      condition: "EXCELLENT",
      status: "AVAILABLE",
      isBookable: true,
      purchaseCost: 5000,
      location: "HQ - 1st Floor",
      qrCode: "https://res.cloudinary.com/demo/image/upload/v1570975825/sample.jpg",
    },
  });

  console.log("🌱 Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
