const prisma = require("../config/db");

const syncBookingStatuses = async () => {
  const now = new Date();

  await prisma.resourceBooking.updateMany({
    where: {
      status: { in: ["UPCOMING", "ONGOING"] },
      endTime: { lt: now },
    },
    data: { status: "COMPLETED" },
  });

  await prisma.resourceBooking.updateMany({
    where: {
      status: "UPCOMING",
      startTime: { lte: now },
      endTime: { gte: now },
    },
    data: { status: "ONGOING" },
  });
};

const getBookings = async ({ assetId, employeeId, status, page = 1, limit = 10 }) => {
  await syncBookingStatuses();

  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {};

  if (assetId) where.assetId = assetId;
  if (employeeId) where.bookedById = employeeId;
  if (status) where.status = status;

  const [total, bookings] = await prisma.$transaction([
    prisma.resourceBooking.count({ where }),
    prisma.resourceBooking.findMany({
      where,
      skip,
      take,
      orderBy: { startTime: "desc" },
      include: {
        asset: { select: { id: true, name: true, assetTag: true } },
        bookedBy: { select: { id: true, name: true, email: true, employeeCode: true } },
      },
    }),
  ]);

  return {
    bookings,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

const getBookingById = async (id) => {
  await syncBookingStatuses();

  const booking = await prisma.resourceBooking.findUnique({
    where: { id },
    include: {
      asset: { select: { id: true, name: true, assetTag: true, isBookable: true } },
      bookedBy: { select: { id: true, name: true, email: true, employeeCode: true } },
    },
  });

  if (!booking) {
    const error = new Error("Booking not found.");
    error.statusCode = 404;
    throw error;
  }

  return booking;
};

const getCalendarBookings = async (assetId) => {
  await syncBookingStatuses();

  const bookings = await prisma.resourceBooking.findMany({
    where: {
      assetId,
      status: { not: "CANCELLED" },
    },
    orderBy: { startTime: "asc" },
    include: {
      bookedBy: { select: { id: true, name: true } },
    },
  });

  return bookings;
};

const createBooking = async (data, creatorId) => {
  const { assetId, startTime, endTime, purpose } = data;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });
  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!asset.isBookable) {
    const error = new Error("This asset is not marked as bookable.");
    error.statusCode = 400;
    throw error;
  }

  const overlap = await prisma.resourceBooking.findFirst({
    where: {
      assetId,
      status: { not: "CANCELLED" },
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });

  if (overlap) {
    const error = new Error("Overlapping booking exists for this timeslot.");
    error.statusCode = 400;
    throw error;
  }

  const now = new Date();
  let initialStatus = "UPCOMING";
  if (startTime <= now && endTime >= now) {
    initialStatus = "ONGOING";
  }

  const booking = await prisma.resourceBooking.create({
    data: {
      assetId,
      bookedById: creatorId,
      startTime,
      endTime,
      purpose,
      status: initialStatus,
    },
    include: {
      asset: { select: { id: true, name: true, assetTag: true } },
    },
  });

  await prisma.notification.create({
    data: {
      userId: creatorId,
      title: "Booking Confirmed",
      message: `Your booking for ${booking.asset.name} (${booking.asset.assetTag}) has been confirmed from ${startTime.toLocaleString()} to ${endTime.toLocaleString()}.`,
      type: "BOOKING_CREATED",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: creatorId,
      action: "BOOKING_CREATED",
      entity: "ResourceBooking",
      entityId: booking.id,
      metadata: { assetTag: booking.asset.assetTag, startTime, endTime },
    },
  });

  return booking;
};

const rescheduleBooking = async (id, data, userId, userRole) => {
  const { startTime, endTime } = data;

  const booking = await prisma.resourceBooking.findUnique({
    where: { id },
    include: {
      asset: { select: { name: true, assetTag: true } },
    },
  });
  if (!booking) {
    const error = new Error("Booking not found.");
    error.statusCode = 404;
    throw error;
  }

  if (booking.bookedById !== userId && userRole !== "ADMIN" && userRole !== "ASSET_MANAGER") {
    const error = new Error("Not authorized to reschedule this booking.");
    error.statusCode = 403;
    throw error;
  }

  if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
    const error = new Error(`Cannot reschedule a ${booking.status.toLowerCase()} booking.`);
    error.statusCode = 400;
    throw error;
  }

  const overlap = await prisma.resourceBooking.findFirst({
    where: {
      assetId: booking.assetId,
      id: { not: id },
      status: { not: "CANCELLED" },
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });

  if (overlap) {
    const error = new Error("Overlapping booking exists for this timeslot.");
    error.statusCode = 400;
    throw error;
  }

  const now = new Date();
  let updatedStatus = "UPCOMING";
  if (startTime <= now && endTime >= now) {
    updatedStatus = "ONGOING";
  }

  const updatedBooking = await prisma.resourceBooking.update({
    where: { id },
    data: {
      startTime,
      endTime,
      status: updatedStatus,
    },
  });

  await prisma.notification.create({
    data: {
      userId: booking.bookedById,
      title: "Booking Rescheduled",
      message: `Your booking for resource ${booking.asset.name} has been rescheduled to: ${startTime.toLocaleString()} - ${endTime.toLocaleString()}.`,
      type: "BOOKING_CREATED",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: "BOOKING_RESCHEDULED",
      entity: "ResourceBooking",
      entityId: id,
      metadata: { assetTag: booking.asset.assetTag, startTime, endTime },
    },
  });

  return updatedBooking;
};

const cancelBooking = async (id, data, userId, userRole) => {
  const { cancelledReason } = data;

  const booking = await prisma.resourceBooking.findUnique({
    where: { id },
    include: {
      asset: { select: { name: true, assetTag: true } },
    },
  });
  if (!booking) {
    const error = new Error("Booking not found.");
    error.statusCode = 404;
    throw error;
  }

  if (booking.bookedById !== userId && userRole !== "ADMIN" && userRole !== "ASSET_MANAGER") {
    const error = new Error("Not authorized to cancel this booking.");
    error.statusCode = 403;
    throw error;
  }

  if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
    const error = new Error(`Booking is already ${booking.status.toLowerCase()}.`);
    error.statusCode = 400;
    throw error;
  }

  const updatedBooking = await prisma.resourceBooking.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancelledReason,
    },
  });

  await prisma.notification.create({
    data: {
      userId: booking.bookedById,
      title: "Booking Cancelled",
      message: `Your booking for resource ${booking.asset.name} has been cancelled: ${cancelledReason}`,
      type: "BOOKING_CANCELLED",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: "BOOKING_CANCELLED",
      entity: "ResourceBooking",
      entityId: id,
      metadata: { assetTag: booking.asset.assetTag, cancelledReason },
    },
  });

  return updatedBooking;
};

module.exports = {
  getBookings,
  getBookingById,
  getCalendarBookings,
  createBooking,
  rescheduleBooking,
  cancelBooking,
};
