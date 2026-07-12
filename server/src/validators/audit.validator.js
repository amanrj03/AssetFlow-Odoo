const { z } = require("zod");

const createAuditCycleSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(1, "Title cannot be empty")
      .max(100, "Title must be less than 100 characters"),
    scope: z
      .string()
      .trim()
      .max(255, "Scope must be less than 255 characters")
      .optional()
      .nullable(),
    departmentId: z
      .string()
      .uuid("Invalid department ID")
      .optional()
      .nullable(),
    location: z
      .string()
      .trim()
      .max(100, "Location must be less than 100 characters")
      .optional()
      .nullable(),
    startDate: z
      .preprocess((val) => (val ? new Date(val) : undefined), z.date()),
    endDate: z
      .preprocess((val) => (val ? new Date(val) : undefined), z.date()),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

const assignAuditorSchema = z.object({
  auditorId: z
    .string({ required_error: "Auditor ID is required" })
    .uuid("Invalid auditor ID"),
  assetIds: z
    .array(z.string().uuid("Invalid asset ID"))
    .min(1, "At least one asset must be specified for assignment"),
});

const verifyAssetSchema = z.object({
  assetId: z
    .string({ required_error: "Asset ID is required" })
    .uuid("Invalid asset ID"),
  result: z.enum(["VERIFIED", "MISSING", "DAMAGED"], {
    errorMap: () => ({ message: "Result must be VERIFIED, MISSING, or DAMAGED" }),
  }),
  remarks: z
    .string()
    .trim()
    .max(500, "Remarks must be less than 500 characters")
    .optional()
    .nullable(),
});

module.exports = {
  createAuditCycleSchema,
  assignAuditorSchema,
  verifyAssetSchema,
};
