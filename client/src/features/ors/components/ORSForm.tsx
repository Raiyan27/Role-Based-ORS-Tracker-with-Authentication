import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Upload,
  X,
  Paperclip,
  Link as LinkIcon,
} from "lucide-react";
import type { CreateORSInput } from "../../../types/ors";
import api from "../../../lib/api";

const textDocSchema = z.object({
  label: z.string().min(1, "Label is required"),
  description: z.string().min(1, "Description is required"),
});

const documentSchema = z.object({
  textDoc: z.array(textDocSchema).default([]),
  attachments: z.array(z.string()).default([]),
});

const orsFormSchema = z.object({
  vehicle: z.string().min(1, "Vehicle name is required"),
  roadWorthinessScore: z
    .string()
    .regex(/^\d+%?$/, "Score must be a number with optional %"),
  overallTrafficScore: z.enum(["A", "B", "C", "D", "F"]),
  actionRequired: z.string().min(1, "Action required is required"),
  documents: z.array(documentSchema).default([]),
});

interface ORSFormProps {
  onSubmit: (data: CreateORSInput) => void;
  defaultValues?: Partial<CreateORSInput>;
  isLoading?: boolean;
}

export const ORSForm: React.FC<ORSFormProps> = ({
  onSubmit,
  defaultValues,
  isLoading,
}) => {
  const [attachments, setAttachments] = useState<string[]>(
    defaultValues?.documents?.[0]?.attachments || [],
  );
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileUploadsEnabled, setFileUploadsEnabled] = useState(false);

  // Check if Cloudinary is configured on the server
  React.useEffect(() => {
    const checkCloudinaryConfig = async () => {
      try {
        const response = await api.get("/upload/config");
        setFileUploadsEnabled(response.data.enabled);
      } catch {
        setFileUploadsEnabled(false);
      }
    };
    checkCloudinaryConfig();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    // @ts-expect-error - Zod resolver type mismatch with optional array fields
    resolver: zodResolver(orsFormSchema),
    defaultValues: defaultValues || {
      vehicle: "",
      roadWorthinessScore: "",
      overallTrafficScore: "A" as const,
      actionRequired: "",
      documents: [{ textDoc: [], attachments: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents.0.textDoc",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setAttachments((prev) => [...prev, ...urls]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error uploading files:", error);
      setUploadError(error.response?.data?.message || "Failed to upload files");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    // Basic URL validation
    try {
      new URL(urlInput);
      setAttachments((prev) => [...prev, urlInput]);
      setUrlInput("");
    } catch {
      setUploadError("Please enter a valid URL");
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: CreateORSInput) => {
    // Include attachments in the submission
    const formData = {
      ...data,
      documents: [
        {
          textDoc: data.documents[0]?.textDoc || [],
          attachments: attachments,
        },
      ],
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Vehicle Name
          </label>
          <input
            {...register("vehicle")}
            type="text"
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Truck-12"
          />
          {errors.vehicle && (
            <p className="mt-1 text-sm text-red-400">
              {errors.vehicle.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Roadworthiness Score
          </label>
          <input
            {...register("roadWorthinessScore")}
            type="text"
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="78%"
          />
          {errors.roadWorthinessScore && (
            <p className="mt-1 text-sm text-red-400">
              {errors.roadWorthinessScore.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Overall Traffic Score
          </label>
          <select
            {...register("overallTrafficScore")}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
          {errors.overallTrafficScore && (
            <p className="mt-1 text-sm text-red-400">
              {errors.overallTrafficScore.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Action Required
        </label>
        <textarea
          {...register("actionRequired")}
          rows={3}
          className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the required actions..."
        />
        {errors.actionRequired && (
          <p className="mt-1 text-sm text-red-400">
            {errors.actionRequired.message}
          </p>
        )}
      </div>

      <div className="bg-gray-700 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Text Documents</h3>
          <button
            type="button"
            onClick={() => append({ label: "", description: "" })}
            className="flex items-center text-sm px-1 py-1 sm:text-base sm:gap-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
          >
            <Plus size={18} />
            Add Document
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-800 p-4 rounded-md">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-medium text-gray-300">
                  Document {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Label
                  </label>
                  <input
                    {...register(`documents.0.textDoc.${index}.label`)}
                    type="text"
                    className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2"
                    placeholder="e.g., Brake System Check"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register(`documents.0.textDoc.${index}.description`)}
                    rows={2}
                    className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2"
                    placeholder="Detailed findings..."
                  />
                </div>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No documents added. Click "Add Document" to create one.
            </p>
          )}
        </div>
      </div>

      {/* File Attachments Section */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          {fileUploadsEnabled ? "File Attachments" : "Attachment URLs"}
        </h3>

        {/* File Upload */}
        <div className="space-y-4">
          {fileUploadsEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Files (PDF, DOC, DOCX, Images)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-750 text-gray-300 rounded-md cursor-pointer border border-gray-600 hover:border-blue-500 transition-colors">
                  <Upload size={18} />
                  <span>{uploading ? "Uploading..." : "Choose Files"}</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={uploading || isLoading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max file size: 10MB per file. Supported formats: PDF, DOC, DOCX,
                JPG, PNG
              </p>
            </div>
          )}

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {fileUploadsEnabled ? "Or Add URL" : "Add Attachment URL"}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="flex-1 rounded-md bg-gray-800 border-gray-600 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!urlInput.trim() || isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-md cursor-pointer"
              >
                <LinkIcon size={18} />
                Add
              </button>
            </div>
          </div>

          {/* Error Display */}
          {uploadError && (
            <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-md">
              {uploadError}
            </div>
          )}

          {/* Attachments List */}
          {attachments.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-300 mb-2">
                Attached Files ({attachments.length})
              </p>
              <div className="space-y-2">
                {attachments.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-800 p-3 rounded-md"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Paperclip size={16} className="text-gray-400 shrink-0" />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 truncate text-sm"
                      >
                        {url}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      disabled={isLoading}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          {isLoading ? "Saving..." : "Save ORS Plan"}
        </button>
      </div>
    </form>
  );
};
