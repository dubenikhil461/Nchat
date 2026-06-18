import { Router } from "express";
import { login, logout, register } from "../controller/auth.controller.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { loginSchema, registerSchema } from "../validations/auth.validation.ts";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;
