import { Response, NextFunction } from "express";
import orsService from "../services/ors.service";
import { createORSSchema, updateORSSchema } from "../utils/ors.validators";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

export class ORSController {
  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Not authenticated", 401);
      }

      const validatedData = createORSSchema.parse(req.body);
      const ors = await orsService.create(
        validatedData,
        req.user._id.toString(),
      );

      res.status(201).json({
        status: "success",
        data: { ors },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { vehicle, inspector, trafficScore } = req.query;

      const orsPlans = await orsService.getAll({
        vehicle: vehicle as string,
        inspector: inspector as string,
        trafficScore: trafficScore as string,
      });

      res.status(200).json({
        status: "success",
        results: orsPlans.length,
        data: { orsPlans },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ors = await orsService.getById(req.params.id as string);

      res.status(200).json({
        status: "success",
        data: { ors },
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Not authenticated", 401);
      }

      const validatedData = updateORSSchema.parse(req.body);
      const ors = await orsService.update(
        req.params.id as string,
        validatedData,
        req.user._id.toString(),
        req.user.role,
      );

      res.status(200).json({
        status: "success",
        data: { ors },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Not authenticated", 401);
      }

      await orsService.delete(
        req.params.id as string,
        req.user._id.toString(),
        req.user.role,
      );

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const stats = await orsService.getStats();

      res.status(200).json({
        status: "success",
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ORSController();
