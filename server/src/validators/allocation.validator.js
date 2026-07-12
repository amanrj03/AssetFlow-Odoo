const { z } = require("zod");

const createAllocationSchema = z.object({
  assetId: z
    .string({ required_error: "Asset ID is required" })
    .uuid("Invalid asset ID"),
  employeeId: z
    .string({ required_error: "Employee ID is required" })
    .uuid("Invalid employee ID"),
  expectedReturnDate: z
    .preprocess((val) => (val ? new Date(val) : undefined), z.date().refine((date) => date > new Date(), {
      message: "Expected return date must be in the future",
    }))
    .optional()
    .nullable(),
});

const returnAllocationSchema = z.object({
  returnCondition: z
    .enum(["EXCELLENT", "GOOD", "FAIR", "POOR", "DAMAGED"])
    .optional(),
  returnNotes: z
    .string()
    .trim()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .nullable(),
});

module.exports = {
  createAllocationSchema,
  returnAllocationSchema,
};
