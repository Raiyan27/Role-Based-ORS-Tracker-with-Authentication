import api from "../../../lib/api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../../../types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      credentials,
    );
    return response.data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>("/auth/me");
    return response.data;
  },
};
