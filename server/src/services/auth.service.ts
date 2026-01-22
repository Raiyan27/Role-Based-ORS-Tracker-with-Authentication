import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { AppError } from "../middleware/error.middleware";
import { RegisterInput, LoginInput } from "../utils/validators";

export class AuthService {
  private generateToken(userId: string): string {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions,
    );
  }

  async register(
    data: RegisterInput,
  ): Promise<{ user: Partial<IUser>; token: string }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      throw new AppError(
        "User with this email or username already exists",
        400,
      );
    }

    // Create user
    const user = await User.create(data);

    // Generate token
    const token = this.generateToken(user._id.toString());

    // Return user without password
    const userObject = user.toObject() as any;
    const { password, ...userWithoutPassword } = userObject;

    return { user: userWithoutPassword, token };
  }

  async login(
    data: LoginInput,
  ): Promise<{ user: Partial<IUser>; token: string }> {
    // Find user with password
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    // Generate token
    const token = this.generateToken(user._id.toString());

    // Return user without password
    const userObject = user.toObject() as any;
    const { password, ...userWithoutPassword } = userObject;

    return { user: userWithoutPassword, token };
  }

  async getMe(userId: string): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

export default new AuthService();
