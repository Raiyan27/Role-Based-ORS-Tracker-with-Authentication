import { Router } from "express";
import {
  uploadFile,
  uploadMultipleFiles,
} from "../controllers/upload.controller";

const router = Router();

// Check if Cloudinary is configured
router.get("/config", (req, res) => {
  const isConfigured =
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
    process.env.CLOUDINARY_API_KEY !== "your_api_key" &&
    process.env.CLOUDINARY_API_SECRET !== "your_api_secret";

  res.json({ enabled: isConfigured });
});

// Single file upload
router.post("/", uploadFile);

// Multiple files upload
router.post("/multiple", uploadMultipleFiles);

export default router;
