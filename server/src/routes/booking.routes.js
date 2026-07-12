const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { protect } = require("../middleware/auth.middleware");

// Calendar slot lookup
router.get("/calendar/:assetId", protect, bookingController.getCalendarBookings);

// Standard bookings read/create (open to all authenticated users)
router.get("/", protect, bookingController.getBookings);
router.get("/:id", protect, bookingController.getBookingById);
router.post("/", protect, bookingController.createBooking);

// Modify/Cancel (authorization verified within the controller/service)
router.put("/:id", protect, bookingController.rescheduleBooking);
router.patch("/:id/reschedule", protect, bookingController.rescheduleBooking);
router.patch("/:id/cancel", protect, bookingController.cancelBooking);

module.exports = router;
