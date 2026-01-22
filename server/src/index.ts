import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { errorHandler, notFound } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import orsRoutes from "./routes/ors.routes";
import uploadRoutes from "./routes/upload.routes";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/ors", orsRoutes);
app.use("/api/upload", uploadRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
