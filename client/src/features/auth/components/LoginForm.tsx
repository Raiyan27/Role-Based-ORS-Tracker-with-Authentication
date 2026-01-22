import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { LoginCredentials } from "../../../types/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="admin@ors.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300"
        >
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
          {error.message || "An error occurred during login"}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
