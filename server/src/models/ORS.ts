import mongoose, { Document, Schema } from "mongoose";

interface ITextDoc {
  label: string;
  description: string;
}

interface IDocument {
  textDoc: ITextDoc[];
  attachments: string[];
}

export interface IORS extends Document {
  vehicle: string;
  roadWorthinessScore: string;
  overallTrafficScore: "A" | "B" | "C" | "D" | "F";
  actionRequired: string;
  inspector: mongoose.Types.ObjectId;
  documents: IDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const textDocSchema = new Schema<ITextDoc>({
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const documentSchema = new Schema<IDocument>({
  textDoc: {
    type: [textDocSchema],
    default: [],
  },
  attachments: {
    type: [String],
    default: [],
  },
});

const orsSchema = new Schema<IORS>(
  {
    vehicle: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
    },
    roadWorthinessScore: {
      type: String,
      required: [true, "Roadworthiness score is required"],
    },
    overallTrafficScore: {
      type: String,
      enum: ["A", "B", "C", "D", "F"],
      required: [true, "Overall traffic score is required"],
    },
    actionRequired: {
      type: String,
      required: [true, "Action required is required"],
    },
    inspector: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Inspector is required"],
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IORS>("ORS", orsSchema);
