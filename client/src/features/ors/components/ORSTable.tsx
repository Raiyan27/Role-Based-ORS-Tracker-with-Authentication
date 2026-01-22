import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye } from "lucide-react";
import { ScoreBadge } from "./ScoreBadge";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useDeleteORS } from "../hooks/useORS";
import type { ORS } from "../../../types/ors";

interface ORSTableProps {
  orsPlans: ORS[];
  isLoading?: boolean;
}

export const ORSTable: React.FC<ORSTableProps> = ({ orsPlans, isLoading }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const deleteMutation = useDeleteORS();

  const canEdit = (ors: ORS) => {
    if (!user) return false;
    return user.role === "admin" || ors.inspector._id === user._id;
  };

  const handleEdit = (id: string) => {
    navigate(`/ors/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this ORS plan?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orsPlans.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <p className="text-gray-400 text-lg">No ORS plans found</p>
        <p className="text-gray-500 mt-2">
          Create your first ORS plan to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Vehicle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Roadworthiness Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Traffic Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Action Required
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Inspector
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {orsPlans.map((ors) => (
            <tr key={ors._id} className="hover:bg-gray-750">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {ors.vehicle}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ScoreBadge score={ors.roadWorthinessScore} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-900 border border-blue-500 text-blue-200">
                  {ors.overallTrafficScore}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                {ors.actionRequired}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {ors.inspector.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/ors/${ors._id}`)}
                    className="text-green-400 hover:text-green-300 cursor-pointer"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  {canEdit(ors) && (
                    <>
                      <button
                        onClick={() => handleEdit(ors._id)}
                        className="text-blue-400 hover:text-blue-300 cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(ors._id)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                        title="Delete"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
