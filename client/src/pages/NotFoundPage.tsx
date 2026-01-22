import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";
import { Layout } from "../components/layout/Layout";

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-gray-800 rounded-lg p-12 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <FileQuestion size={80} className="text-gray-600" />
          </div>

          <div>
            <h1 className="text-6xl font-bold text-white mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <Home size={18} />
              Go to Dashboard
            </Link>
            <Link
              to="/ors"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              View ORS Plans
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
