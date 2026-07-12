const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, reportController.getDashboard);

module.exports = router;
