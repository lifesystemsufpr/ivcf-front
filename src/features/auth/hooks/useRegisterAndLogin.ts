import { useMutation } from "@tanstack/react-query";
import { type ApiError } from "@/core/services/client.service";
import type { JwtPayload, RegisterPayload, RegisterResponse } from "../types";
import { registerRequest } from "../services/registerRequest";
import { decodeJWT } from "../utils/decoder";
import { useAuth } from "./useAuth";

export function useRegisterAndLogin() {
  const auth = useAuth();

  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      //Agora chaar o useLogin para logar o usuário após o registro

      const email = data.email;
      const password = data.pas; // Supondo que a senha esteja disponível aqui, o que pode não ser o caso dependendo da implementação do backend
    },
  });
}
