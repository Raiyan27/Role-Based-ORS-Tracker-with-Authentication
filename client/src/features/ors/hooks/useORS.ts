import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orsApi } from "../api/orsApi";
import type { CreateORSInput, UpdateORSInput } from "../../../types/ors";

export const useORSList = (filters?: {
  vehicle?: string;
  inspector?: string;
  trafficScore?: string;
}) => {
  return useQuery({
    queryKey: ["ors", filters],
    queryFn: () => orsApi.getAll(filters),
  });
};

export const useORS = (id?: string) => {
  return useQuery({
    queryKey: ["ors", id],
    queryFn: () => orsApi.getById(id!),
    enabled: !!id,
  });
};

export const useORSStats = () => {
  return useQuery({
    queryKey: ["ors", "stats"],
    queryFn: orsApi.getStats,
  });
};

export const useCreateORS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateORSInput) => orsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ors"] });
    },
  });
};

export const useUpdateORS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateORSInput }) =>
      orsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ors"] });
    },
  });
};

export const useDeleteORS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ors"] });
    },
  });
};
