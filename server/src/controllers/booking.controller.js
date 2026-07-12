const prisma = require("../config/db");
const bookingService = require("../services/booking.service");
const {
  createBookingSchema,
  rescheduleBookingSchema,
  cancelBookingSchema,
} = require("../validators/booking.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const resolveBookingRefs = async (body) => {
  const resolved = { ...body };
  
  let assetId = resolved.assetId || resolved.resource;
  if (assetId && !isUUID(assetId)) {
    const cleanName = assetId.split("(")[0].trim();
    let asset = await prisma.asset.findFirst({
      where: { name: { contains: cleanName, mode: "insensitive" } }
    });
    if (!asset) {
      asset = await prisma.asset.findFirst({
        where: { isBookable: true }
      });
    }
    resolved.assetId = asset ? asset.id : null;
  }

  let employeeId = resolved.employeeId || resolved.employee;
  if (employeeId && !isUUID(employeeId)) {
    const user = await prisma.user.findFirst({
      where: { name: { equals: employeeId, mode: "insensitive" } }
    });
    resolved.employeeId = user ? user.id : null;
  }

  if (resolved.start) resolved.startTime = new Date(resolved.start).toISOString();
  if (resolved.end) resolved.endTime = new Date(resolved.end).toISOString();
  if (resolved.notes) resolved.purpose = resolved.notes;

  return resolved;
};

const getBookings = asyncHandler(async (req, res) => {
  let { assetId, employeeId, status, page, limit } = req.query;

  let departmentId = undefined;
  if (req.user.role === "DEPARTMENT_HEAD") {
    departmentId = req.user.departmentId;
  } else if (req.user.role === "EMPLOYEE") {
    employeeId = req.user.id;
  }

  const result = await bookingService.getBookings({
    assetId,
    employeeId,
    departmentId,
    status,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return sendSuccess(res, "Bookings retrieved successfully", result);
});

const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await bookingService.getBookingById(id);
  return sendSuccess(res, "Booking retrieved successfully", { booking });
});

const getCalendarBookings = asyncHandler(async (req, res) => {
  const { assetId } = req.params;
  const bookings = await bookingService.getCalendarBookings(assetId);
  return sendSuccess(res, "Calendar bookings retrieved successfully", { bookings });
});

const createBooking = asyncHandler(async (req, res) => {
  const resolvedBody = await resolveBookingRefs(req.body);
  const parsedData = createBookingSchema.parse(resolvedBody);
  const booking = await bookingService.createBooking(parsedData, req.user.id);
  return sendSuccess(res, "Booking created successfully", { booking }, 201);
});

const rescheduleBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = rescheduleBookingSchema.parse(req.body);
  const booking = await bookingService.rescheduleBooking(id, parsedData, req.user.id, req.user.role);
  return sendSuccess(res, "Booking rescheduled successfully", { booking });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsedData = cancelBookingSchema.parse(req.body);
  const booking = await bookingService.cancelBooking(id, parsedData, req.user.id, req.user.role);
  return sendSuccess(res, "Booking cancelled successfully", { booking });
});

module.exports = {
  getBookings,
  getBookingById,
  getCalendarBookings,
  createBooking,
  rescheduleBooking,
  cancelBooking,
};
