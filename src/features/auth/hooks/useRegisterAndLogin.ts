import { useMutation } from "@tanstack/react-query";
import { type ApiError } from "@/core/services/client.service";
import type { RegisterPayload, RegisterResponse } from "../types";
import { registerRequest } from "../services/registerRequest";
import { useLogin } from "./useLogin";

export function useRegisterAndLogin() {
  const authMutation = useLogin();

  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: registerRequest,
    onSuccess: async (data, variables) => {
      const email = data.email;
      const password = variables.user.password;

      await authMutation.mutateAsync({ email, password });
    },
  });
}
