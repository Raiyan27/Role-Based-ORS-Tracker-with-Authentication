import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RegisterCredentials } from "../../../types/auth";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "inspector", "viewer"]).default("viewer"),
});

interface RegisterFormProps {
  onSubmit: (data: RegisterCredentials) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "viewer",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-300"
        >
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          id="username"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="johndoe"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
        )}
      </div>

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
          placeholder="john@example.com"
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

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-300"
        >
          Role
        </label>
        <select
          {...register("role")}
          id="role"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="viewer">Viewer</option>
          <option value="inspector">Inspector</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
          {error.message || "An error occurred during registration"}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};
