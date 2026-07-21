import { useMutation } from "@tanstack/react-query";
import { type ApiError } from "@/core/services/client.service";
import { useAuth } from "./useAuth";
import type { JwtPayload, LoginPayload, LoginResponse } from "../types";
import { loginRequest } from "../services/loginRequest";
import { decodeJWT } from "../utils/decoder";

export function useLogin() {
  const auth = useAuth();

  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      const user: JwtPayload | null = decodeJWT(data.access_token);

      if (!user) {
        console.error("Failed to decode JWT");
        return;
      }

      auth.login({
        user: {
          id: user.sub,
          email: user.email,
          name: user.username,
        },
        accessToken: data.access_token,
        refreshToken: data.refreshToken,
      });
    },
  });
}
