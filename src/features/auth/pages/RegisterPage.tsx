import {
  Box,
  Button,
  Label,
  Separator,
  Input,
  Typography,
} from "@/core/components/ui";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const router = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de cadastro aqui
    router("/"); // Redireciona para a página inicial após o registro
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
                  placeholder="seu@email.com"
                  required
                />
              </Box>
              <Box display="flex" direction="column" gap={6}>
                <Label htmlFor="ocupacao">Ocupação / Vínculo</Label>
                <Input
                  id="ocupacao"
                  name="ocupacao"
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
                placeholder="Crie uma senha forte"
                required
              />
            </Box>

            <Box className="pt-2">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
              >
                Finalizar Cadastro
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
