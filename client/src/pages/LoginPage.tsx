import React from "react";
import { Link } from "react-router-dom";
import { LoginForm } from "../features/auth/components/LoginForm";
import { useAuth } from "../features/auth/hooks/useAuth";

const LoginPage: React.FC = () => {
  const { login, isLoading, loginError } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ORS Tracker</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <LoginForm onSubmit={login} isLoading={isLoading} error={loginError} />

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-400 cursor-pointer"
            >
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-700 rounded text-sm text-gray-300">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Email: admin@ors.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
