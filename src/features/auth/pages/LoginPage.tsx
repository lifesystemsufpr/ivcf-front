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

export default function LoginPage() {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: login, isPending, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router("/");
    } catch (err) {
      console.error("Falha no login", err);
    }
  };

  return (
    <Box
      display="flex"
      justify="center"
      align="center"
      className="min-h-screen min-w-[85%]"
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

        {error && (
          <Box className="p-3 border border-destructive/40 bg-destructive/10 rounded-md">
            <Typography variant="body" className="text-destructive text-sm">
              {(error as ApiError).message || "Não foi possível fazer login."}
            </Typography>
          </Box>
        )}

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
