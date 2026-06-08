import {
  Box,
  Button,
  Input,
  Label,
  Separator,
  Typography,
} from "@/core/components/ui";
import { clientRoutes } from "@/core/configs/client.routes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import type { ApiError } from "@/core/services/client.service";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: login, isPending } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router("/");
    } catch (err) {
      const message =
        (err as ApiError).message || "Não foi possível fazer login.";
      toast.error(message, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <Box
      display="flex"
      justify="center"
      align="center"
      className="h-full min-w-[85%]"
    >
      <Box
        className="w-full max-w-2xl rounded-xl shadow-2xl p-6 border"
        display="flex"
        direction="column"
        gap={24}
      >
        {/* Header */}
        <Box display="flex" direction="column" gap={8}>
          <Box display="flex" justify="space-between" align="center">
            <Typography variant="h1">Login</Typography>
            <a
              href="/register"
              className="text-sm text-primary hover:underline"
            >
              Não tem uma conta?
            </a>
          </Box>
          <Separator />
          <Typography variant="body" className="text-muted-foreground">
            Digite seu Email e senha para acessar sua conta.
          </Typography>
        </Box>

        {/* Form Fields */}
        <Box
          display="flex"
          direction="column"
          gap={16}
          onSubmit={handleSubmit}
          as="form"
        >
          <Box display="flex" direction="column" gap={6}>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Box>

          <Box display="flex" direction="column" gap={6}>
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              required
            />
          </Box>

          <Box display="flex" justify="flex-end">
            <a
              href={clientRoutes.AUTH.FORGOT_PASSWORD}
              className="text-sm text-primary hover:underline"
            >
              Esqueci minha senha
            </a>
          </Box>
        </Box>

        {/* Submit */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </Box>
    </Box>
  );
}
