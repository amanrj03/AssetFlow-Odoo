const { z } = require("zod");

const createBookingSchema = z
  .object({
    assetId: z
      .string({ required_error: "Asset ID is required" })
      .uuid("Invalid asset ID"),
    startTime: z
      .preprocess((val) => (val ? new Date(val) : undefined), z.date())
      .refine((date) => date >= new Date(Date.now() - 5 * 60 * 1000), {
        message: "Start time cannot be in the past",
      }),
    endTime: z
      .preprocess((val) => (val ? new Date(val) : undefined), z.date()),
    purpose: z
      .string()
      .trim()
      .max(255, "Purpose must be less than 255 characters")
      .optional()
      .nullable(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

const rescheduleBookingSchema = z
  .object({
    startTime: z
      .preprocess((val) => (val ? new Date(val) : undefined), z.date())
      .refine((date) => date >= new Date(Date.now() - 5 * 60 * 1000), {
        message: "Start time cannot be in the past",
      }),
    endTime: z
      .preprocess((val) => (val ? new Date(val) : undefined), z.date()),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

const cancelBookingSchema = z.object({
  cancelledReason: z
    .string({ required_error: "Cancellation reason is required" })
    .trim()
    .min(5, "Reason must be at least 5 characters long")
    .max(500, "Reason must be less than 500 characters"),
});

module.exports = {
  createBookingSchema,
  rescheduleBookingSchema,
  cancelBookingSchema,
};
