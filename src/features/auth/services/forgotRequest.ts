import { client } from "@/core/services/client.service";
import type { ForgotPasswordPayload, ResetPasswordPayload } from "../types";

export type ForgotPasswordResponse = {
  message: string;
};

export async function forgotRequest({
  email,
}: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
  try {
    const resp = await client<ForgotPasswordResponse>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
    return resp;
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    throw error;
  }
}

export async function resetPasswordRequest({
  token,
  newPassword,
}: ResetPasswordPayload): Promise<ForgotPasswordResponse> {
  try {
    const resp = await client<ForgotPasswordResponse>("/auth/reset-password", {
      method: "POST",
      body: { token, newPassword },
    });
    return resp;
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    throw error;
  }
}
