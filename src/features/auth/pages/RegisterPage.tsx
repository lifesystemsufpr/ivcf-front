import {
  Box,
  Button,
  Label,
  Separator,
  Input,
  Typography,
} from "@/core/components/ui";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { RegisterPayload } from "../types";
import { useRegisterAndLogin } from "../hooks/useRegisterAndLogin";
import { Bounce, toast } from "react-toastify";
import { getErrorMessage } from "../utils/error";

interface FormData {
  name: string;
  email: string;
  ocupacao: string;
  password: string;
}

export default function RegisterPage() {
  const router = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    ocupacao: "",
    password: "",
  });

  const { mutateAsync: registerAndLogin, isPending } = useRegisterAndLogin();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de senha
    if (formData.password.length < 6) {
      toast.error("A senha deve conter no mínimo 6 caracteres.", {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
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

      toast.success("Registro realizado com sucesso!", {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: 1,
        theme: "colored",
        transition: Bounce,
      });

      setTimeout(() => {
        router("/");
      }, 1000);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      toast.error(`Erro ao realizar cadastro. ${errorMessage}`, {
        toastId: "register-error",
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <Box
      display="flex"
      justify="center"
      align="center"
      className="min-h-screen p-4 min-w-[80%]"
    >
      <Box
        className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-background/80 shadow-2xl backdrop-blur"
        display="flex"
        direction="column"
      >
        <Box className="p-6 md:p-10">
          {/* Header do Formulário */}
          <Box display="flex" direction="column" gap={8}>
            <Box display="flex" justify="space-between" align="center">
              <Typography variant="h2" className="text-foreground">
                Cadastro de Responsável
              </Typography>
              <a href="/login" className="text-sm text-primary hover:underline">
                Já tem uma conta?
              </a>
            </Box>
            <Typography variant="body" className="text-muted-foreground">
              Preencha os dados abaixo para criar sua conta de responsável e
              gerenciar seus acompanhados.
            </Typography>
          </Box>

          <Separator className="my-6" />

          {/* Form - Somente campos de Responsável */}
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <Box className="grid gap-4 md:grid-cols-1">
              <Box display="flex" direction="column" gap={6}>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                />
              </Box>
            </Box>

            <Box className="grid gap-4 md:grid-cols-2">
              <Box display="flex" direction="column" gap={6}>
                <Label htmlFor="email">E-mail Profissional/Pessoal</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                />
              </Box>
              <Box display="flex" direction="column" gap={6}>
                <Label htmlFor="ocupacao">Ocupação / Vínculo</Label>
                <Input
                  id="ocupacao"
                  name="ocupacao"
                  value={formData.ocupacao}
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </Box>

            <Box className="pt-2">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Cadastrando..." : "Finalizar Cadastro"}
              </Button>
            </Box>

            <Typography
              variant="small"
              className="text-center text-muted-foreground"
            >
              Ao se cadastrar, você concorda com nossos Termos de Uso e Política
              de Privacidade.
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
