const { z } = require("zod");
const Messages = require("../constants/messages");

const signupSchema = z.object({
  name: z.string({ required_error: Messages.VALIDATION.NAME_REQUIRED }).min(1, Messages.VALIDATION.NAME_REQUIRED),
  email: z.string().email(Messages.VALIDATION.INVALID_EMAIL),
  password: z.string().min(6, Messages.VALIDATION.PASSWORD_MIN),
  phone: z.string().optional().nullable(),
  employeeCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(Messages.VALIDATION.INVALID_EMAIL),
  password: z.string().min(1, "Password is required"),
});

module.exports = {
  signupSchema,
  loginSchema,
};
