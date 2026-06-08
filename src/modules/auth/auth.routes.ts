import { Router } from "express";
import { AuthController } from "./auth.controller.ts";
import { AuthService } from "./auth.service.ts";
import { AuthRepository } from "./auth.repository.ts";

const router = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/register",authController.register);
router.post("/login",authController.login);

export default router;