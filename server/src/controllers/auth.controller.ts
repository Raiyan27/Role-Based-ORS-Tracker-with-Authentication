import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { registerSchema, loginSchema } from "../utils/validators";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);

      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  async getMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Not authenticated", 401);
      }

      const user = await authService.getMe(req.user._id.toString());

      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
