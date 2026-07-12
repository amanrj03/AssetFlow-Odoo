const prisma = require("../config/db");
const generateAssetTag = require("../utils/generateAssetTag");
const generateQRCode = require("../utils/generateQRCode");
const { uploadBuffer } = require("../utils/cloudinaryUpload");

const getAssets = async ({ search, status, categoryId, departmentId, page = 1, limit = 10, sort }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (status) {
    where.status = status;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (departmentId) {
    where.departmentId = departmentId;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { assetTag: { contains: search, mode: "insensitive" } },
      { serialNumber: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy = { createdAt: "desc" };
  if (sort === "name") {
    orderBy = { name: "asc" };
  } else if (sort === "purchaseDate") {
    orderBy = { purchaseDate: "desc" };
  }

  const [total, assets] = await prisma.$transaction([
    prisma.asset.count({ where }),
    prisma.asset.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        category: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    assets,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getAssetById = async (id) => {
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      department: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true, email: true } },
      documents: true,
    },
  });

  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  return asset;
};

const getAssetByTag = async (assetTag) => {
  const asset = await prisma.asset.findUnique({
    where: { assetTag },
    include: {
      category: { select: { id: true, name: true } },
      department: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true, email: true } },
      documents: true,
    },
  });

  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  return asset;
};

const createAsset = async (data, files, creatorId) => {
  const {
    name,
    serialNumber,
    categoryId,
    departmentId,
    purchaseDate,
    purchaseCost,
    location,
    condition,
    isBookable,
    remarks,
  } = data;

  // 1. Verify Category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    const error = new Error("Category not found.");
    error.statusCode = 400;
    throw error;
  }

  // 2. Verify Department exists if provided
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

  // 3. Unique Serial Number check
  if (serialNumber) {
    const existingSerial = await prisma.asset.findUnique({
      where: { serialNumber },
    });
    if (existingSerial) {
      const error = new Error("Serial number already exists.");
      error.statusCode = 400;
      throw error;
    }
  }

  // 4. Generate tag & QR code
  const assetTag = await generateAssetTag();
  const qrCodeUrl = await generateQRCode(assetTag);

  // 5. Upload Image to Cloudinary if provided
  let imageUrl = null;
  const imageFile = files?.image?.[0] || files?.photo?.[0];
  if (imageFile) {
    const uploadRes = await uploadBuffer(imageFile.buffer, "assets");
    imageUrl = uploadRes.secure_url;
  }

  // 6. Upload documents to Cloudinary if provided
  const docFiles = files?.documents || [];
  const docRecords = [];
  for (const docFile of docFiles) {
    const uploadRes = await uploadBuffer(docFile.buffer, "documents");
    docRecords.push({
      documentName: docFile.originalname,
      documentType: docFile.mimetype,
      cloudinaryUrl: uploadRes.secure_url,
    });
  }

  // 7. Write to DB
  const asset = await prisma.asset.create({
    data: {
      assetTag,
      name,
      serialNumber,
      categoryId,
      departmentId,
      createdBy: creatorId,
      purchaseDate,
      purchaseCost,
      location,
      condition: condition || "GOOD",
      status: "AVAILABLE",
      isBookable: isBookable || false,
      qrCode: qrCodeUrl,
      imageUrl,
      remarks,
      documents: {
        create: docRecords,
      },
    },
    include: {
      category: { select: { id: true, name: true } },
      department: { select: { id: true, name: true } },
      documents: true,
    },
  });

  // 8. Log activity
  await prisma.activityLog.create({
    data: {
      userId: creatorId,
      action: "CREATE_ASSET",
      entity: "Asset",
      entityId: asset.id,
      metadata: { name: asset.name, assetTag: asset.assetTag },
    },
  });

  return asset;
};

const updateAsset = async (id, data, files, adminUserId) => {
  const {
    name,
    serialNumber,
    categoryId,
    departmentId,
    purchaseDate,
    purchaseCost,
    location,
    condition,
    isBookable,
    remarks,
    status,
  } = data;

  // 1. Fetch Asset
  const asset = await prisma.asset.findUnique({
    where: { id },
  });
  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  const updatePayload = {};

  if (name !== undefined) updatePayload.name = name;
  if (location !== undefined) updatePayload.location = location;
  if (condition !== undefined) updatePayload.condition = condition;
  if (isBookable !== undefined) updatePayload.isBookable = isBookable;
  if (remarks !== undefined) updatePayload.remarks = remarks;
  if (status !== undefined) updatePayload.status = status;
  if (purchaseDate !== undefined) updatePayload.purchaseDate = purchaseDate;
  if (purchaseCost !== undefined) updatePayload.purchaseCost = purchaseCost;

  // 2. Validate Serial Uniqueness on update
  if (serialNumber !== undefined && serialNumber !== asset.serialNumber) {
    if (serialNumber) {
      const existingSerial = await prisma.asset.findFirst({
        where: { serialNumber, id: { not: id } },
      });
      if (existingSerial) {
        const error = new Error("Serial number already exists.");
        error.statusCode = 400;
        throw error;
      }
    }
    updatePayload.serialNumber = serialNumber;
  }

  // 3. Category Check
  if (categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      const error = new Error("Category not found.");
      error.statusCode = 400;
      throw error;
    }
    updatePayload.categoryId = categoryId;
  }

  // 4. Department Check
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

  // 5. Upload New Photo if provided
  const imageFile = files?.image?.[0] || files?.photo?.[0];
  if (imageFile) {
    const uploadRes = await uploadBuffer(imageFile.buffer, "assets");
    updatePayload.imageUrl = uploadRes.secure_url;
  }

  // 6. Upload and Append New Documents if provided
  const docFiles = files?.documents || [];
  const docRecords = [];
  for (const docFile of docFiles) {
    const uploadRes = await uploadBuffer(docFile.buffer, "documents");
    docRecords.push({
      documentName: docFile.originalname,
      documentType: docFile.mimetype,
      cloudinaryUrl: uploadRes.secure_url,
    });
  }

  if (docRecords.length > 0) {
    updatePayload.documents = {
      create: docRecords,
    };
  }

  // 7. Update Asset record
  const updatedAsset = await prisma.asset.update({
    where: { id },
    data: updatePayload,
    include: {
      category: { select: { id: true, name: true } },
      department: { select: { id: true, name: true } },
      documents: true,
    },
  });

  // 8. Log activity
  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "UPDATE_ASSET",
      entity: "Asset",
      entityId: id,
      metadata: { name: updatedAsset.name, updatedFields: Object.keys(updatePayload) },
    },
  });

  return updatedAsset;
};

const disposeAsset = async (id, adminUserId) => {
  // 1. Fetch Asset
  const asset = await prisma.asset.findUnique({
    where: { id },
  });
  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  // 2. Mark status as DISPOSED
  const updatedAsset = await prisma.asset.update({
    where: { id },
    data: { status: "DISPOSED" },
  });

  // 3. Log activity
  await prisma.activityLog.create({
    data: {
      userId: adminUserId,
      action: "DISPOSE_ASSET",
      entity: "Asset",
      entityId: id,
      metadata: { name: asset.name, assetTag: asset.assetTag },
    },
  });

  return updatedAsset;
};

const getAssetHistory = async (id) => {
  // Check if asset exists
  const asset = await prisma.asset.findUnique({
    where: { id },
    select: { id: true, name: true, assetTag: true },
  });
  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  // Fetch allocation, transfer, and maintenance histories
  const [allocations, transfers, maintenance] = await prisma.$transaction([
    prisma.assetAllocation.findMany({
      where: { assetId: id },
      orderBy: { allocatedDate: "desc" },
      include: {
        employee: { select: { id: true, name: true, email: true, employeeCode: true } },
        allocatedBy: { select: { id: true, name: true } },
      },
    }),
    prisma.transferRequest.findMany({
      where: { assetId: id },
      orderBy: { requestedAt: "desc" },
      include: {
        fromEmployee: { select: { id: true, name: true, employeeCode: true } },
        toEmployee: { select: { id: true, name: true, employeeCode: true } },
        requestedBy: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
      },
    }),
    prisma.maintenanceRequest.findMany({
      where: { assetId: id },
      orderBy: { createdAt: "desc" },
      include: {
        raisedBy: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    asset,
    allocations,
    transfers,
    maintenance,
  };
};

module.exports = {
  getAssets,
  getAssetById,
  getAssetByTag,
  createAsset,
  updateAsset,
  disposeAsset,
  getAssetHistory,
};
