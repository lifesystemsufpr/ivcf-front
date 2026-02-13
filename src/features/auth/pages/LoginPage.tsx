import {
  Box,
  Button,
  Label,
  Separator,
  Typography,
} from "@/core/components/ui";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const router = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router("/");
  };

  return (
    <Box display="flex" justify="center" align="center">
      <Box
        className="w-full max-w-md rounded-xl shadow-lg "
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
            Digite seu CPF e senha para acessar sua conta.
          </Typography>
        </Box>

        {/* Form Fields */}
        <Box display="flex" direction="column" gap={16}>
          <Box display="flex" direction="column" gap={6}>
            <Label htmlFor="cpf">CPF</Label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
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
            <a href="#" className="text-sm text-primary hover:underline">
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
