import { useMutation } from "@tanstack/react-query";
import { type ApiError } from "@/core/services/client.service";
import { useAuth } from "./useAuth";
import type { LoginPayload, LoginResponse } from "../types";
import { loginRequest } from "../services/loginRequest";

export function useLogin() {
  const auth = useAuth();

  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      auth.login({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
  });
}
