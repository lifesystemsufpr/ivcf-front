import {
  Box,
  Button,
  Label,
  Separator,
  Input,
  Typography,
  Checkbox,
  Modal,
} from "@/core/components/ui";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { RegisterPayload } from "../types";
import { useRegisterAndLogin } from "../hooks/useRegisterAndLogin";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/error";
import { useScreenInfo } from "@/core/hooks/useScreenInfo";
import Term from "../components/Term";
import { useRegisterForm } from "../hooks/useRegisterForm";

export default function RegisterPage() {
  const router = useNavigate();
  const { isMobile, isShortHeight } = useScreenInfo();
  const [openTerms, setOpenTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const useCompactLayout = isMobile || isShortHeight;

  const { mutateAsync: registerAndLogin, isPending } = useRegisterAndLogin();

  const { formData, errors, handleChange, validate, setErrors } =
    useRegisterForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate();

    if (!isValid) {
      toast.error("Verifique os campos do formulário.");
      return;
    }

    try {
      const payload: RegisterPayload = {
        speciality: formData.ocupacao,
        user: {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        },
      };

      await registerAndLogin(payload);

      toast.success("Registro realizado com sucesso!");

      router("/");
    } catch (err) {
      const errorMessage = getErrorMessage(err);

      if (
        errorMessage === "O e-mail já está em uso." ||
        errorMessage === "O e-mail deve ser válido"
      ) {
        setErrors((prev) => ({
          ...prev,
          email: errorMessage,
        }));
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Box
      display="flex"
      justify="center"
      align="center"
      className="h-full w-full"
    >
      <Box
        className={`w-full max-w-2xl overflow-hidden border bg-background/80 backdrop-blur ${
          useCompactLayout
            ? "max-h-[calc(100dvh-1.5rem)] rounded-xl shadow-lg"
            : "rounded-2xl shadow-2xl"
        }`}
        display="flex"
        direction="column"
      >
        <Box
          className={useCompactLayout ? "overflow-y-auto p-4" : "p-6 md:p-10"}
        >
          {/* Header do Formulário */}
          <Box display="flex" direction="column" gap={useCompactLayout ? 6 : 8}>
            <Box
              display="flex"
              justify="space-between"
              align={useCompactLayout ? "flex-start" : "center"}
              className={useCompactLayout ? "flex-col gap-2" : ""}
            >
              <Typography
                variant="h2"
                className={`text-foreground ${useCompactLayout ? "text-2xl" : ""}`}
              >
                Cadastro de Responsável
              </Typography>
              <a href="/login" className="text-sm text-primary hover:underline">
                Já tem uma conta?
              </a>
            </Box>
            {!useCompactLayout && (
              <Typography variant="body" className="text-muted-foreground">
                Preencha os dados abaixo para criar sua conta de responsável e
                gerenciar seus acompanhados.
              </Typography>
            )}
          </Box>

          <Separator className={useCompactLayout ? "my-4" : "my-6"} />

          {/* Form - Somente campos de Responsável */}
          <form
            className={useCompactLayout ? "grid gap-4" : "grid gap-6"}
            onSubmit={handleSubmit}
          >
            <Box className="grid gap-4 md:grid-cols-1">
              <Box display="flex" direction="column" gap={6}>
                <Label htmlFor="email">E-mail Profissional/Pessoal</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  errorMessage={errors.email}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                />
              </Box>
            </Box>

            <Box className="grid gap-4 md:grid-cols-2">
              <Box display="flex" direction="column" gap={6}>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  errorMessage={errors.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                />
              </Box>
              <Box display="flex" direction="column" gap={6}>
                <Label htmlFor="ocupacao">Ocupação / Vínculo</Label>
                <Input
                  id="ocupacao"
                  name="ocupacao"
                  value={formData.ocupacao}
                  errorMessage={errors.ocupacao}
                  onChange={handleChange}
                  placeholder="Ex: Médico, Filho(a), Cuidador"
                  required
                />
              </Box>
            </Box>

            <Box display="flex" direction="column" gap={6}>
              <Label htmlFor="password">Senha de Acesso</Label>
              <Input
                id="password"
                name="password"
                type="password"
                errorMessage={errors.password}
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </Box>

            <Box display="flex" align="center" gap={8} direction="row">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <Typography
                variant="small"
                className="text-muted-foreground cursor-pointer"
                onClick={() => setOpenTerms(true)}
              >
                Li e concordo com os Termos de Uso e a Política de Privacidade.
              </Typography>
            </Box>

            <Box className="pt-2">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={isPending || !termsAccepted}
              >
                {isPending ? "Cadastrando..." : "Finalizar Cadastro"}
              </Button>
            </Box>
          </form>

          {openTerms && (
            <Modal
              open={openTerms}
              onClose={() => setOpenTerms(false)}
              hideCloseButton
              size="xl"
            >
              <Term />
            </Modal>
          )}
        </Box>
      </Box>
    </Box>
  );
}
