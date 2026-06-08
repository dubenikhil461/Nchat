import type { Request, Response } from "express";
import { AuthService } from "./auth.service.ts";

export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.authService.createUser(req.body);

      return res.status(201).json({
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
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await this.authService.getUserByEmail(email);

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
  }
}