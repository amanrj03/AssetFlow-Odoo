const { z } = require("zod");

const createTransferSchema = z.object({
  assetId: z
    .string({ required_error: "Asset ID is required" })
    .uuid("Invalid asset ID"),
  toEmployeeId: z
    .string({ required_error: "Target employee ID is required" })
    .uuid("Invalid employee ID"),
  reason: z
    .string({ required_error: "Reason is required" })
    .trim()
    .min(10, "Reason must be at least 10 characters long")
    .max(500, "Reason must be less than 500 characters"),
});

module.exports = {
  createTransferSchema,
};
