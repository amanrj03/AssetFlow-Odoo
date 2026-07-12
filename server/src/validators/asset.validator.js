const { z } = require("zod");

const createAssetSchema = z.object({
  name: z
    .string({ required_error: "Asset name is required" })
    .trim()
    .min(1, "Asset name cannot be empty")
    .max(100, "Asset name must be less than 100 characters"),
  serialNumber: z
    .string()
    .trim()
    .max(100, "Serial number must be less than 100 characters")
    .optional()
    .nullable(),
  categoryId: z
    .string({ required_error: "Category ID is required" })
    .uuid("Invalid category ID"),
  departmentId: z
    .string()
    .uuid("Invalid department ID")
    .optional()
    .nullable(),
  purchaseDate: z
    .preprocess((val) => (val ? new Date(val) : undefined), z.date().refine((date) => date <= new Date(), {
      message: "Purchase date cannot be in the future",
    }))
    .optional()
    .nullable(),
  purchaseCost: z
    .preprocess((val) => (val !== undefined && val !== "" ? parseFloat(val) : undefined), z.number().positive("Purchase cost must be a positive number"))
    .optional()
    .nullable(),
  location: z
    .string()
    .trim()
    .max(100, "Location must be less than 100 characters")
    .optional()
    .nullable(),
  condition: z
    .enum(["EXCELLENT", "GOOD", "FAIR", "POOR", "DAMAGED"])
    .optional(),
  isBookable: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional()
    .default(false),
  remarks: z
    .string()
    .trim()
    .max(500, "Remarks must be less than 500 characters")
    .optional()
    .nullable(),
});

const updateAssetSchema = createAssetSchema
  .extend({
    status: z.enum([
      "AVAILABLE",
      "ALLOCATED",
      "RESERVED",
      "UNDER_MAINTENANCE",
      "LOST",
      "RETIRED",
      "DISPOSED",
    ]),
  })
  .partial();

module.exports = {
  createAssetSchema,
  updateAssetSchema,
};
