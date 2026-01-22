import ORS, { IORS } from "../models/ORS";
import { AppError } from "../middleware/error.middleware";
import { CreateORSInput, UpdateORSInput } from "../utils/ors.validators";

interface ORSQuery {
  vehicle?: RegExp;
  inspector?: string;
  overallTrafficScore?: string;
}

export class ORSService {
  async create(data: CreateORSInput, inspectorId: string): Promise<IORS> {
    const ors = await ORS.create({
      ...data,
      inspector: inspectorId,
    });

    return await ors.populate("inspector", "username email role");
  }

  async getAll(filters?: {
    vehicle?: string;
    inspector?: string;
    trafficScore?: string;
  }): Promise<IORS[]> {
    const query: ORSQuery = {};

    if (filters?.vehicle) {
      query.vehicle = new RegExp(filters.vehicle, "i");
    }

    if (filters?.inspector) {
      query.inspector = filters.inspector;
    }

    if (filters?.trafficScore) {
      query.overallTrafficScore = filters.trafficScore;
    }

    return await ORS.find(query)
      .populate("inspector", "username email role")
      .sort({ createdAt: -1 });
  }

  async getById(id: string): Promise<IORS> {
    const ors = await ORS.findById(id).populate(
      "inspector",
      "username email role",
    );

    if (!ors) {
      throw new AppError("ORS plan not found", 404);
    }

    return ors;
  }

  async update(
    id: string,
    data: UpdateORSInput,
    userId: string,
    userRole: string,
  ): Promise<IORS> {
    const ors = await ORS.findById(id);

    if (!ors) {
      throw new AppError("ORS plan not found", 404);
    }

    // Check authorization: Admin can update any, Inspector can update only their own
    if (userRole !== "admin" && ors.inspector.toString() !== userId) {
      throw new AppError("Not authorized to update this ORS plan", 403);
    }

    Object.assign(ors, data);
    await ors.save();

    return await ors.populate("inspector", "username email role");
  }

  async delete(id: string, userId: string, userRole: string): Promise<void> {
    const ors = await ORS.findById(id);

    if (!ors) {
      throw new AppError("ORS plan not found", 404);
    }

    // Check authorization: Admin can delete any, Inspector can delete only their own
    if (userRole !== "admin" && ors.inspector.toString() !== userId) {
      throw new AppError("Not authorized to delete this ORS plan", 403);
    }

    await ORS.findByIdAndDelete(id);
  }

  async getStats(): Promise<{
    total: number;
    avgScore: number;
    gradeDistribution: Record<string, number>;
    needsAction: number;
  }> {
    const allORS = await ORS.find();

    const total = allORS.length;

    // Calculate average score
    const scores = allORS.map((ors) => {
      const scoreStr = ors.roadWorthinessScore.replace("%", "");
      return parseInt(scoreStr, 10);
    });
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    // Grade distribution
    const gradeDistribution: Record<string, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    };
    allORS.forEach((ors) => {
      gradeDistribution[ors.overallTrafficScore]++;
    });

    // Count plans needing action (score < 80%)
    const needsAction = scores.filter((score) => score < 80).length;

    return { total, avgScore, gradeDistribution, needsAction };
  }
}

export default new ORSService();
