const { z } = require("zod");

const createMaintenanceSchema = z.object({
  assetId: z
    .string({ required_error: "Asset ID is required" })
    .uuid("Invalid asset ID"),
  issue: z
    .string({ required_error: "Issue description is required" })
    .trim()
    .min(10, "Issue description must be at least 10 characters long")
    .max(1000, "Issue description must be less than 1000 characters"),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .optional()
    .default("MEDIUM"),
  imageUrl: z
    .string()
    .url("Attachment must be a valid URL")
    .or(z.string().max(0))
    .optional()
    .nullable(),
});

const assignTechnicianSchema = z.object({
  technician: z
    .string({ required_error: "Technician name is required" })
    .trim()
    .min(2, "Technician name must be at least 2 characters long")
    .max(100, "Technician name must be less than 100 characters"),
});

const resolveMaintenanceSchema = z.object({
  resolutionNotes: z
    .string({ required_error: "Resolution notes are required" })
    .trim()
    .min(10, "Resolution notes must be at least 10 characters long")
    .max(1000, "Resolution notes must be less than 1000 characters"),
});

module.exports = {
  createMaintenanceSchema,
  assignTechnicianSchema,
  resolveMaintenanceSchema,
};
