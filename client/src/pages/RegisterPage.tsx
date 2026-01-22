import React from "react";
import { Link } from "react-router-dom";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import { useAuth } from "../features/auth/hooks/useAuth";

const RegisterPage: React.FC = () => {
  const { register, isLoading, registerError } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ORS Tracker</h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        <RegisterForm
          onSubmit={register}
          isLoading={isLoading}
          error={registerError}
        />

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-400 cursor-pointer"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
