export interface TextDoc {
  label: string;
  description: string;
}

export interface Document {
  textDoc: TextDoc[];
  attachments: string[];
}

export interface ORS {
  _id: string;
  vehicle: string;
  roadWorthinessScore: string;
  overallTrafficScore: "A" | "B" | "C" | "D" | "F";
  actionRequired: string;
  inspector: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateORSInput {
  vehicle: string;
  roadWorthinessScore: string;
  overallTrafficScore: "A" | "B" | "C" | "D" | "F";
  actionRequired: string;
  documents: Document[];
}

export interface UpdateORSInput extends Partial<CreateORSInput> {}

export interface ORSStats {
  total: number;
  avgScore: number;
  gradeDistribution: Record<string, number>;
  needsAction: number;
}
