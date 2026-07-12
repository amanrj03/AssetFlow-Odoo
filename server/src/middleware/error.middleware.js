const { sendError } = require("../utils/response");

const errorMiddleware = (err, req, res, next) => {
  console.error("Error handler caught error:", err);

  let message = err.message || "Internal Server Error";
  let statusCode = err.statusCode || 500;

  // Zod Validation Error
  if (err.name === "ZodError" || (err.issues && Array.isArray(err.issues))) {
    statusCode = 400;
    message = err.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" | ");
  }

  // Prisma Known Request Error (e.g. Unique Constraint, Not Found)
  if (err.code && err.code.startsWith("P")) {
    statusCode = 400;
    if (err.code === "P2002") {
      const targetFields = err.meta?.target ? err.meta.target.join(", ") : "field";
      message = `Conflict: A record with that ${targetFields} already exists.`;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = err.meta?.cause || "The requested record was not found.";
    } else {
      message = `Database Error: [${err.code}] ${err.message || "Operation failed."}`;
    }
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Access Denied: Invalid authentication token.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Access Denied: Authentication token has expired.";
  }

  return sendError(res, message, statusCode);
};

module.exports = errorMiddleware;
