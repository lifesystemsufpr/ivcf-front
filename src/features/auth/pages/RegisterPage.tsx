import {
  Box,
  Button,
  Label,
  Separator,
  Typography,
} from "@/core/components/ui";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const router = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router("/"); // Redireciona para a página inicial após o login
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
            <Typography variant="h1">Register</Typography>
            <a href="/login" className="text-sm text-primary hover:underline">
              Já tem uma conta?
            </a>
          </Box>
          <Separator />
          <Typography variant="body" className="text-muted-foreground">
            Crie sua conta preenchendo os campos abaixo.
          </Typography>
        </Box>

        {/* Form Fields */}
        <Box display="flex" direction="column" gap={16}>
          <Box display="flex" direction="column" gap={6}>
            <Label htmlFor="name">Nome Completo</Label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Seu nome completo"
              className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition"
            />
          </Box>

          <Box display="flex" direction="column" gap={6}>
            <Label htmlFor="email">Email</Label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Seu email"
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
        </Box>
        {/* Submit */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
        >
          Registrar
        </Button>
      </Box>
    </Box>
  );
}
