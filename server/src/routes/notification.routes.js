const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, notificationController.getNotifications);
router.patch("/read-all", protect, notificationController.markAllAsRead);

router.get("/:id", protect, notificationController.getNotificationById);
router.patch("/:id/read", protect, notificationController.markAsRead);
router.delete("/:id", protect, notificationController.deleteNotification);

module.exports = router;
