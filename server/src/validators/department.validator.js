const { z } = require("zod");

const createDepartmentSchema = z.object({
  name: z
    .string({ required_error: "Department name is required" })
    .trim()
    .min(1, "Department name cannot be empty")
    .max(100, "Department name must be less than 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  parentDepartmentId: z
    .string()
    .uuid("Invalid parent department ID")
    .optional()
    .nullable(),
  headId: z
    .string()
    .uuid("Invalid head user ID")
    .optional()
    .nullable(),
  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),
});

const updateDepartmentSchema = createDepartmentSchema.partial();

module.exports = {
  createDepartmentSchema,
  updateDepartmentSchema,
};
