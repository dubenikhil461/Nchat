import type { Request, Response } from "express";
import { UserService } from "./user.service.ts";

export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  getProfile = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({
          success: false,
          message: "User id is required",
        });
      }

      const user = await this.userService.getProfile(id);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({
          success: false,
          message: "User id is required",
        });
      }

      const user = await this.userService.updateUser(id, {
        ...(req.body.name ? { name: req.body.name } : {}),
        ...(req.file ? { photo: req.file } : {}),
      });

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  };

  searchUsers = async (req: Request, res: Response) => {
    try {
      const query = typeof req.query.q === "string" ? req.query.q : "";
      const users = await this.userService.searchUsers(query);

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  };
}
