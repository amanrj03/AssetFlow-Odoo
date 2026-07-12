const { z } = require("zod");

const updateEmployeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .optional()
    .nullable(),
  profileImage: z
    .string()
    .url("Profile image must be a valid URL")
    .or(z.string().max(0))
    .optional()
    .nullable(),
  departmentId: z
    .string()
    .uuid("Invalid department ID")
    .optional()
    .nullable(),
});

const promoteEmployeeSchema = z.object({
  employeeId: z.string({ required_error: "Employee ID is required" }).uuid("Invalid employee ID"),
  role: z.enum(["EMPLOYEE", "ASSET_MANAGER", "DEPARTMENT_HEAD"], {
    errorMap: () => ({ message: "Role must be EMPLOYEE, ASSET_MANAGER, or DEPARTMENT_HEAD" }),
  }),
});

const changeStatusSchema = z.object({
  employeeId: z.string({ required_error: "Employee ID is required" }).uuid("Invalid employee ID"),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Status must be ACTIVE or INACTIVE" }),
  }),
});

const changeDepartmentSchema = z.object({
  employeeId: z.string({ required_error: "Employee ID is required" }).uuid("Invalid employee ID"),
  departmentId: z
    .string({ required_error: "Department ID is required" })
    .uuid("Invalid department ID")
    .nullable(),
});

module.exports = {
  updateEmployeeSchema,
  promoteEmployeeSchema,
  changeStatusSchema,
  changeDepartmentSchema,
};
