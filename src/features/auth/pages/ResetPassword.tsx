import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Label,
  Separator,
  Typography,
} from "@/core/components/ui";

import { useState } from "react";
import { resetPasswordRequest } from "../services/forgotRequest";
import { toast } from "react-toastify";
import CompleteReset from "../components/CompleteReset";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [isPasswordTooShort, setIsPasswordTooShort] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNotEqual, setIsNotEqual] = useState(false);

  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordTooShort(false);
    setIsNotEqual(false);

    if (newPassword.length < 8) {
      setIsPasswordTooShort(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsNotEqual(true);
      return;
    }

    try {
      await resetPasswordRequest({
        newPassword,
        token: token ?? "",
      });
      setSuccess(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Erro ao redefinir senha. Por favor, tente novamente.");
    }
  };

  return (
    <Box
      display="flex"
      justify="center"
      align="center"
      className="min-h-screen min-w-[85%]"
    >
      {!success ? (
        <Box
          className="w-full max-w-2xl rounded-xl shadow-2xl p-6 border"
          display="flex"
          direction="column"
          gap={24}
        >
          <Typography variant="h1">Redefinir senha</Typography>
          <Separator />
          <Box display="flex" direction="column" gap={8}>
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              type="password"
              required
              errorMessage={
                isPasswordTooShort
                  ? "A senha deve conter no mínimo 8 caracteres"
                  : ""
              }
              placeholder="Digite sua nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Box>

          <Box display="flex" direction="column" gap={8}>
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              required
              type="password"
              errorMessage={isNotEqual ? "As senhas não coincidem" : ""}
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>

          <Button
            variant="default"
            size="lg"
            onClick={handleSubmit}
            disabled={!newPassword || !confirmPassword}
          >
            Redefinir senha
          </Button>
        </Box>
      ) : (
        <CompleteReset />
      )}
    </Box>
  );
}
