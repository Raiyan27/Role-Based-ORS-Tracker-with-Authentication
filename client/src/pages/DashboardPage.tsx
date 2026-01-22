import React from "react";
import { Layout } from "../components/layout/Layout";
import { ORSChart } from "../features/ors/components/ORSChart";
import { useORSStats } from "../features/ors/hooks/useORS";

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useORSStats();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Overview of ORS tracking statistics
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : stats ? (
          <ORSChart stats={stats} />
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No statistics available</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
