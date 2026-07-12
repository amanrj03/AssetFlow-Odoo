const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: User Signup
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name, employeeCode]
 *             properties:
 *               email: { type: string, example: user@gmail.com }
 *               password: { type: string, example: Password123! }
 *               name: { type: string, example: Aman Kumar }
 *               employeeCode: { type: string, example: EMP001 }
 *     responses:
 *       201:
 *         description: Created
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: user@gmail.com }
 *               password: { type: string, example: Password123! }
 *     responses:
 *       200:
 *         description: OK
 * /api/auth/me:
 *   get:
 *     summary: Get Current User Profile
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: OK
 * /api/auth/logout:
 *   post:
 *     summary: User Logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: OK
 */

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", protect, authController.getMe);
router.post("/logout", authController.logout);

module.exports = router;
