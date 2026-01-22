import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { AppError } from "./error.middleware";

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Not authorized to access this resource", 403);
    }

    next();
  };
};
