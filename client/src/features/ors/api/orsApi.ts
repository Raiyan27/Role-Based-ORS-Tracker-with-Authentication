import api from "../../../lib/api";
import type {
  CreateORSInput,
  ORS,
  ORSStats,
  UpdateORSInput,
} from "../../../types/ors";

interface ORSListResponse {
  status: string;
  results: number;
  data: {
    orsPlans: ORS[];
  };
}

interface ORSResponse {
  status: string;
  data: {
    ors: ORS;
  };
}

interface ORSStatsResponse {
  status: string;
  data: {
    stats: ORSStats;
  };
}

export const orsApi = {
  getAll: async (filters?: {
    vehicle?: string;
    inspector?: string;
    trafficScore?: string;
  }): Promise<ORS[]> => {
    const params = new URLSearchParams();
    if (filters?.vehicle) params.append("vehicle", filters.vehicle);
    if (filters?.inspector) params.append("inspector", filters.inspector);
    if (filters?.trafficScore)
      params.append("trafficScore", filters.trafficScore);

    const response = await api.get<ORSListResponse>(
      `/ors?${params.toString()}`,
    );
    return response.data.data.orsPlans;
  },

  getById: async (id: string): Promise<ORS> => {
    const response = await api.get<ORSResponse>(`/ors/${id}`);
    return response.data.data.ors;
  },

  create: async (data: CreateORSInput): Promise<ORS> => {
    const response = await api.post<ORSResponse>("/ors", data);
    return response.data.data.ors;
  },

  update: async (id: string, data: UpdateORSInput): Promise<ORS> => {
    const response = await api.put<ORSResponse>(`/ors/${id}`, data);
    return response.data.data.ors;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/ors/${id}`);
  },

  getStats: async (): Promise<ORSStats> => {
    const response = await api.get<ORSStatsResponse>("/ors/stats");
    return response.data.data.stats;
  },
};
