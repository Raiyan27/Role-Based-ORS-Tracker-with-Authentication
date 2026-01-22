import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { ORSTable } from "../features/ors/components/ORSTable";
import { useORSList } from "../features/ors/hooks/useORS";
import { useAuthContext } from "../hooks/useAuthContext";

const ORSListPage: React.FC = () => {
  const { user } = useAuthContext();
  const [filters, setFilters] = useState({
    vehicle: "",
    trafficScore: "",
  });

  const { data: orsPlans, isLoading } = useORSList(filters);

  const canCreate = user?.role === "admin" || user?.role === "inspector";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">ORS Plans</h1>
            <p className="text-gray-400 mt-2">
              Manage vehicle operational roadworthiness scores
            </p>
          </div>
          {canCreate && (
            <Link
              to="/ors/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              <Plus size={20} />
              New ORS Plan
            </Link>
          )}
        </div>

        <form onSubmit={handleSearch} className="bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Vehicle
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.vehicle}
                  onChange={(e) =>
                    setFilters({ ...filters, vehicle: e.target.value })
                  }
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 pl-10"
                  placeholder="Truck-12"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Traffic Score
              </label>
              <select
                value={filters.trafficScore}
                onChange={(e) =>
                  setFilters({ ...filters, trafficScore: e.target.value })
                }
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2"
              >
                <option value="">All Grades</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setFilters({ vehicle: "", trafficScore: "" })}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </form>

        <ORSTable orsPlans={orsPlans || []} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default ORSListPage;
