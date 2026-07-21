import { apiRoutes } from "@/core/configs/api.routes";
import type { RegisterPayload, RegisterResponse } from "../types";
import { http } from "@/core/services/client.service";

export async function registerRequest(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  try {
    return http.post<RegisterResponse>(apiRoutes.AUTH.REGISTER, payload, {
      auth: false,
    });
  } catch (error) {
    throw error;
  }
}
