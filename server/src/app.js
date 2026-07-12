const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "localhost",
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// Parse URL Encoded Data
app.use(express.urlencoded({ extended: true }));

// Parse Cookies
app.use(cookieParser());


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    project: "AssetFlow Backend",
    version: "1.0.0",
    message: "Server is running successfully :rocket:",
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Departments
const departmentRoutes = require("./routes/department.routes");
app.use("/api/departments", departmentRoutes);

// Categories
const categoryRoutes = require("./routes/category.routes");
app.use("/api/categories", categoryRoutes);

// Employees
const employeeRoutes = require("./routes/employee.routes");
app.use("/api/employees", employeeRoutes);

// Assets
const assetRoutes = require("./routes/asset.routes");
app.use("/api/assets", assetRoutes);

// Allocation
// const allocationRoutes = require("./routes/allocation.routes");
// app.use("/api/allocation", allocationRoutes);

// Booking
// const bookingRoutes = require("./routes/booking.routes");
// app.use("/api/bookings", bookingRoutes);

// Maintenance
// const maintenanceRoutes = require("./routes/maintenance.routes");
// app.use("/api/maintenance", maintenanceRoutes);

// Audit
// const auditRoutes = require("./routes/audit.routes");
// app.use("/api/audits", auditRoutes);

// Reports
// const reportRoutes = require("./routes/report.routes");
// app.use("/api/reports", reportRoutes);

// Notifications
// const notificationRoutes = require("./routes/notification.routes");
// app.use("/api/notifications", notificationRoutes);

/*
|--------------------------------------------------------------------------
| 404 Route
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

const errorMiddleware = require("./middleware/error.middleware");
app.use(errorMiddleware);

module.exports = app;