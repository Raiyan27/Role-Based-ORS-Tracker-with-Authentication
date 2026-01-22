import { Request, Response, NextFunction } from "express";
import { upload } from "../middleware/upload";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { AppError } from "../middleware/error.middleware";

export const uploadFile = [
  protect,
  authorize("admin", "inspector"),
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new AppError("No file uploaded", 400);
      }

      const file = req.file as Express.Multer.File & { path: string };

      res.status(200).json({
        success: true,
        url: file.path,
        filename: req.file.originalname,
      });
    } catch (error) {
      next(error);
    }
  },
];

export const uploadMultipleFiles = [
  protect,
  authorize("admin", "inspector"),
  upload.array("files", 10),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new AppError("No files uploaded", 400);
      }

      const files = req.files.map((file: any) => ({
        url: file.path,
        filename: file.originalname,
      }));

      res.status(200).json({
        success: true,
        files,
      });
    } catch (error) {
      next(error);
    }
  },
];
