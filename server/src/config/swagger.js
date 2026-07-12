const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AssetFlow ERP Backend API Documentation",
      version: "1.0.0",
      description: "API Documentation for AssetFlow Enterprise Resource Planning (ERP)",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "Access token stored in secure HTTP-Only cookie",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Alternative Bearer Token header authentication",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "Authentication", description: "Endpoints for login, signup, and session" },
      { name: "Departments", description: "CRUD operations and head configurations for organizational departments" },
      { name: "Categories", description: "Asset categories configuration" },
      { name: "Employees", description: "Admin panel for managing employees and user roles" },
      { name: "Assets", description: "Register, retrieve, upload media, and generate QR codes for assets" },
      { name: "Allocations", description: "Allocate assets (checkout) and return active allocations" },
      { name: "Transfers", description: "Request, approve, or reject employee asset transfers" },
      { name: "Bookings", description: "Schedule resource bookings and prevent time conflict overlaps" },
      { name: "Maintenance", description: "Technician assignment and maintenance repair request workflows" },
      { name: "Audits", description: "Conduct audit cycles, auditor assignments, and generate discrepancy logs" },
      { name: "Notifications", description: "Read and manage personal notifications" },
      { name: "ActivityLogs", description: "Search activity log operations" },
      { name: "Dashboard", description: "Fetch role-specific metrics summaries" },
      { name: "Reports", description: "Aggregate usage summaries" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📝 Swagger documentation initialized at http://localhost:5000/api-docs");
};

module.exports = setupSwagger;
