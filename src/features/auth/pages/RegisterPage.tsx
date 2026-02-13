import {
  Box,
  Button,
  Label,
  Separator,
  Textarea,
  Input,
  Typography,
} from "@/core/components/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ProfileType = "participante" | "responsavel";

export default function RegisterPage() {
  const router = useNavigate();
  const [profile, setProfile] = useState<ProfileType>("participante");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router("/"); // Redireciona para a página inicial após o login
  };

  return (
    <Box display="flex" justify="center" align="center">
      <Box
        className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-2xl backdrop-blur"
        display="flex"
        direction="column"
      >
        <Box className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:p-10">
          {/* Left - Profile selection */}
          <Box className="relative" display="flex" direction="column" gap={20}>
            <Box display="flex" direction="column" gap={10}>
              <Typography variant="h2" className="text-foreground">
                Escolha o perfil
              </Typography>
              <Typography variant="body" className="text-muted-foreground">
                Selecione quem vai ser cadastrado para personalizar o
                formulário.
              </Typography>
            </Box>

            <Box className="flex flex-col gap-4">
              <label className="group cursor-pointer">
                <input
                  type="radio"
                  name="profile"
                  value="participante"
                  className="sr-only"
                  checked={profile === "participante"}
                  onChange={() => setProfile("participante")}
                />
                <Box
                  className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                    profile === "participante"
                      ? "border-primary/60 bg-primary/5 shadow-sm"
                      : "border-border/70 bg-muted/20 hover:border-primary/40"
                  }`}
                >
                  <Box
                    className={`h-14 w-14 rounded-full border-2 transition ${
                      profile === "participante"
                        ? "border-primary bg-primary/20"
                        : "border-border bg-background"
                    }`}
                    display="flex"
                    justify="center"
                    align="center"
                  >
                    <Box
                      className={`h-6 w-6 rounded-full transition ${
                        profile === "participante" ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  </Box>
                  <Box display="flex" direction="column" gap={4}>
                    <Typography variant="h4">Participante</Typography>
                    <Typography variant="small">
                      Cadastro completo com dados pessoais e medidas.
                    </Typography>
                  </Box>
                </Box>
              </label>

              <label className="group cursor-pointer">
                <input
                  type="radio"
                  name="profile"
                  value="responsavel"
                  className="sr-only"
                  checked={profile === "responsavel"}
                  onChange={() => setProfile("responsavel")}
                />
                <Box
                  className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                    profile === "responsavel"
                      ? "border-primary/60 bg-primary/5 shadow-sm"
                      : "border-border/70 bg-muted/20 hover:border-primary/40"
                  }`}
                >
                  <Box
                    className={`h-14 w-14 rounded-full border-2 transition ${
                      profile === "responsavel"
                        ? "border-primary bg-primary/20"
                        : "border-border bg-background"
                    }`}
                    display="flex"
                    justify="center"
                    align="center"
                  >
                    <Box
                      className={`h-6 w-6 rounded-full transition ${
                        profile === "responsavel" ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  </Box>
                  <Box display="flex" direction="column" gap={4}>
                    <Typography variant="h4">Responsavel</Typography>
                    <Typography variant="small">
                      Cadastro direto para quem acompanha o participante.
                    </Typography>
                  </Box>
                </Box>
              </label>
            </Box>

            <Box
              className="hidden md:block"
              display="flex"
              direction="column"
              gap={12}
            >
              <Separator />
              <Typography variant="small" className="text-muted-foreground">
                Você pode alterar o perfil a qualquer momento antes de enviar.
              </Typography>
            </Box>
          </Box>

          {/* Right - Form */}
          <Box className="rounded-xl border border-border/70 bg-background/90 p-6 shadow-lg">
            <Box display="flex" direction="column" gap={8}>
              <Box display="flex" justify="space-between" align="center">
                <Typography variant="h2">Criar conta</Typography>
                <a
                  href="/login"
                  className="text-sm text-primary hover:underline"
                >
                  Já tem uma conta?
                </a>
              </Box>
              <Typography variant="body" className="text-muted-foreground">
                Preencha os campos abaixo para finalizar o cadastro.
              </Typography>
            </Box>

            <Separator className="my-6" />

            <form className="grid gap-4" onSubmit={handleSubmit}>
              {profile === "participante" && (
                <>
                  <Box className="grid gap-4 md:grid-cols-2">
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Nome completo"
                      />
                    </Box>
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" name="cpf" placeholder="000.000.000-00" />
                    </Box>
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="birthdate">Data de nasc</Label>
                      <Input id="birthdate" name="birthdate" type="date" />
                    </Box>
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(00) 00000-0000"
                      />
                    </Box>
                  </Box>

                  <Box display="flex" direction="column" gap={6}>
                    <Label htmlFor="address">Endereco</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Rua, numero, bairro, cidade"
                    />
                  </Box>

                  <Box className="grid gap-4 md:grid-cols-2">
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                      />
                    </Box>
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="sexo">Sexo</Label>
                      <select
                        id="sexo"
                        name="sexo"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Selecione
                        </option>
                        <option value="f">Feminino</option>
                        <option value="m">Masculino</option>
                      </select>
                    </Box>
                  </Box>

                  <Box className="grid gap-4 md:grid-cols-2">
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="altura">Altura</Label>
                      <Input id="altura" name="altura" placeholder="Ex: 1,70" />
                    </Box>
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="peso">Peso</Label>
                      <Input id="peso" name="peso" placeholder="Ex: 70" />
                    </Box>
                  </Box>

                  <Box display="flex" direction="column" gap={6}>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Crie uma senha"
                    />
                  </Box>
                </>
              )}

              {profile === "responsavel" && (
                <>
                  <Box className="grid gap-4 md:grid-cols-2">
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Nome completo"
                      />
                    </Box>
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" name="cpf" placeholder="000.000.000-00" />
                    </Box>
                  </Box>

                  <Box className="grid gap-4 md:grid-cols-2">
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                      />
                    </Box>
                    <Box display="flex" direction="column" gap={6}>
                      <Label htmlFor="ocupacao">Ocupacao</Label>
                      <Input
                        id="ocupacao"
                        name="ocupacao"
                        placeholder="Profissao ou cargo"
                      />
                    </Box>
                  </Box>

                  <Box display="flex" direction="column" gap={6}>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Crie uma senha"
                    />
                  </Box>
                </>
              )}

              <Button type="submit" variant="default" size="lg" fullWidth>
                Registrar
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
