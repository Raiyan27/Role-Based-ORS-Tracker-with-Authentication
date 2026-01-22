import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthContext } from "../../../hooks/useAuthContext";
import type {
  LoginCredentials,
  RegisterCredentials,
} from "../../../types/auth";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const {
    login: setAuth,
    logout: clearAuth,
    user,
    isAuthenticated,
  } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      navigate("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      navigate("/dashboard");
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
    navigate("/login");
  };

  return {
    login: (credentials: LoginCredentials) => loginMutation.mutate(credentials),
    register: (credentials: RegisterCredentials) =>
      registerMutation.mutate(credentials),
    logout,
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
