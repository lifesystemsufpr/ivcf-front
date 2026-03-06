import {
  Box,
  Button,
  Label,
  Separator,
  Typography,
} from "@/core/components/ui";
import { clientRoutes } from "@/core/configs/client.routes";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const router = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router("/");
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
        <Box display="flex" direction="column" gap={16}>
          <Box display="flex" direction="column" gap={6}>
            <Label htmlFor="email">Email</Label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seu.email@exemplo.com"
              className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition"
            />
          </Box>

          <Box display="flex" direction="column" gap={6}>
            <Label htmlFor="password">Senha</Label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition"
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
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
}
