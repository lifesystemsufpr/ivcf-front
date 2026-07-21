import { http } from "@/core/services/client.service";
import type { LoginPayload, LoginResponse } from "../types";
import { apiRoutes } from "@/core/configs/api.routes";

export async function loginRequest(
  payload: LoginPayload,
): Promise<LoginResponse> {
  return http.post<LoginResponse>(apiRoutes.AUTH.LOGIN, payload, {
    auth: false,
  });
}
