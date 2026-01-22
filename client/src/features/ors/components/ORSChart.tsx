import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { ORSStats } from "../../../types/ors";

interface ORSChartProps {
  stats: ORSStats;
}

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#6B7280"];

export const ORSChart: React.FC<ORSChartProps> = ({ stats }) => {
  const gradeData = Object.entries(stats.gradeDistribution).map(
    ([grade, count]) => ({
      grade,
      count,
    }),
  );

  // Filter out grades with zero count for the pie chart
  const pieChartData = gradeData.filter((item) => item.count > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Total Plans</p>
          <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Average Score</p>
          <p className="text-3xl font-bold text-white mt-2">
            {stats.avgScore}%
          </p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Needs Action</p>
          <p className="text-3xl font-bold text-red-400 mt-2">
            {stats.needsAction}
          </p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Passing Rate</p>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {stats.total > 0
              ? Math.round(
                  ((stats.total - stats.needsAction) / stats.total) * 100,
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Grade Distribution Bar Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Traffic Score Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gradeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="grade" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#F3F4F6" }}
            />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" name="Number of Plans" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Distribution Pie Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Traffic Score Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props) => {
                const entry = props as unknown as {
                  grade: string;
                  count: number;
                };
                return `${entry.grade}: ${entry.count}`;
              }}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
            >
              {pieChartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "0.5rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
