const bookingService = require("../services/booking.service");
const {
  createBookingSchema,
  rescheduleBookingSchema,
  cancelBookingSchema,
} = require("../validators/booking.validator");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getBookings = asyncHandler(async (req, res) => {
  const { assetId, employeeId, status, page, limit } = req.query;

  const result = await bookingService.getBookings({
    assetId,
    employeeId,
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
  const parsedData = createBookingSchema.parse(req.body);
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
