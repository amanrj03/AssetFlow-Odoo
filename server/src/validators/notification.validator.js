const { z } = require("zod");

// Simple placeholder or query validator if needed
const notificationQuerySchema = z.object({
  isRead: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }, z.boolean().optional()),
  type: z.string().optional(),
});

module.exports = {
  notificationQuerySchema,
};
