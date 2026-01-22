import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { ORSForm } from "../features/ors/components/ORSForm";
import {
  useORS,
  useCreateORS,
  useUpdateORS,
} from "../features/ors/hooks/useORS";
import { useAuthContext } from "../hooks/useAuthContext";
import type { CreateORSInput } from "../types/ors";

const ORSFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const isEditMode = !!id;

  const { data: ors, isLoading: isLoadingORS } = useORS(id);
  const createMutation = useCreateORS();
  const updateMutation = useUpdateORS();

  // Check edit permissions for edit mode
  useEffect(() => {
    if (isEditMode && ors && user) {
      const canEdit = user.role === "admin" || ors.inspector._id === user._id;
      if (!canEdit) {
        navigate(`/ors/${id}`, { replace: true });
      }
    }
  }, [isEditMode, ors, user, navigate, id]);

  const handleSubmit = async (data: CreateORSInput) => {
    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate("/ors");
    } catch (error) {
      console.error("Error saving ORS plan:", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isLoadingORS) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <button
            onClick={() => navigate("/ors")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            Back to ORS Plans
          </button>
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? "Edit ORS Plan" : "Create New ORS Plan"}
          </h1>
          <p className="text-gray-400 mt-2">
            {isEditMode
              ? "Update the details of this ORS plan"
              : "Fill in the details for a new ORS plan"}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <ORSForm
            onSubmit={handleSubmit}
            defaultValues={ors}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ORSFormPage;
