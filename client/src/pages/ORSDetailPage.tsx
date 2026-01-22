import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Paperclip,
  FileX,
} from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { useORS, useDeleteORS } from "../features/ors/hooks/useORS";
import { ScoreBadge } from "../features/ors/components/ScoreBadge";
import { useAuthContext } from "../hooks/useAuthContext";

const ORSDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data: ors, isLoading } = useORS(id);
  const deleteMutation = useDeleteORS();

  const canEdit = () => {
    if (!user || !ors) return false;
    return user.role === "admin" || ors.inspector._id === user._id;
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this ORS plan?")) {
      try {
        await deleteMutation.mutateAsync(id!);
        navigate("/ors");
      } catch (error) {
        console.error("Error deleting ORS:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!ors) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-400">ORS plan not found</p>
          <Link
            to="/ors"
            className="text-blue-500 hover:text-blue-400 mt-4 inline-block"
          >
            Back to ORS Plans
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <button
              onClick={() => navigate("/ors")}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft size={20} />
              Back to ORS Plans
            </button>
            <h1 className="text-3xl font-bold text-white">{ors.vehicle}</h1>
            <p className="text-gray-400 mt-2">
              Created by {ors.inspector.username} on{" "}
              {new Date(ors.createdAt).toLocaleDateString()}
            </p>
          </div>

          {canEdit() && (
            <div className="flex gap-2">
              <Link
                to={`/ors/${id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <Edit size={18} />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-md"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Scores Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Roadworthiness Score</p>
            <ScoreBadge score={ors.roadWorthinessScore} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Traffic Score</p>
            <span className="px-4 py-2 rounded-full text-lg font-semibold bg-blue-900 border border-blue-500 text-blue-200">
              {ors.overallTrafficScore}
            </span>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Inspector</p>
            <p className="text-white font-medium">{ors.inspector.username}</p>
            <p className="text-gray-400 text-sm capitalize">
              {ors.inspector.role}
            </p>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Action Required
          </h2>
          <p className="text-gray-300 whitespace-pre-wrap">
            {ors.actionRequired}
          </p>
        </div>

        {/* Documents Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={24} />
            Documents
          </h2>

          {!ors.documents ||
          ors.documents.length === 0 ||
          ors.documents.every(
            (doc) =>
              (!doc.textDoc || doc.textDoc.length === 0) &&
              (!doc.attachments || doc.attachments.length === 0),
          ) ? (
            <div className="text-center py-12">
              <FileX size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No documents available</p>
              <p className="text-gray-500 mt-2">
                {canEdit()
                  ? "Edit this ORS plan to add documents and attachments"
                  : "No documents have been added to this ORS plan yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {ors.documents.map((doc, docIndex) => (
                <div
                  key={docIndex}
                  className="border-t border-gray-700 pt-4 first:border-t-0 first:pt-0"
                >
                  {/* Text Documents */}
                  {doc.textDoc && doc.textDoc.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white mb-3">
                        Text Documents
                      </h3>
                      <div className="space-y-3">
                        {doc.textDoc.map((textDoc, textIndex) => (
                          <div
                            key={textIndex}
                            className="bg-gray-700 p-4 rounded-md"
                          >
                            <p className="text-blue-400 font-medium mb-2">
                              {textDoc.label}
                            </p>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">
                              {textDoc.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {doc.attachments && doc.attachments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                        <Paperclip size={18} />
                        Attachments ({doc.attachments.length})
                      </h3>
                      <div className="space-y-2">
                        {doc.attachments.map((attachment, attIndex) => {
                          const isUrl =
                            attachment.startsWith("http://") ||
                            attachment.startsWith("https://");
                          const fileName = isUrl
                            ? new URL(attachment).pathname.split("/").pop() ||
                              attachment
                            : attachment;

                          return (
                            <a
                              key={attIndex}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="flex items-center gap-3 text-blue-400 hover:text-blue-300 bg-gray-700 hover:bg-gray-600 p-3 rounded-md transition-colors group"
                            >
                              <Paperclip size={16} className="shrink-0" />
                              <span className="truncate flex-1">
                                {fileName}
                              </span>
                              <span className="text-xs text-gray-500 group-hover:text-gray-400">
                                {isUrl ? "External Link" : "Download"}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Created</p>
              <p className="text-white">
                {new Date(ors.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Last Updated</p>
              <p className="text-white">
                {new Date(ors.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ORSDetailPage;
