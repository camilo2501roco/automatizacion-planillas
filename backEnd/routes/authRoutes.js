import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { loginValidation, changePasswordValidation } from "../middlewares/validators/authValidator.js";
import { login, changePassword } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/login — público
router.post("/login", loginValidation, login);

// PUT /api/auth/password — protegido con JWT
router.put("/password", authMiddleware, changePasswordValidation, changePassword);

export default router;
