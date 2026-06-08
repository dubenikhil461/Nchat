import { Router } from "express";
import multer from "multer";
import { UserController } from "./user.controller.ts";
import { UserService } from "./user.service.ts";
import { UserRepository } from "./user.repository.ts";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/search", userController.searchUsers);
router.get("/:id", userController.getProfile);
router.patch("/:id", upload.single("photo"), userController.updateUser);

export default router;
