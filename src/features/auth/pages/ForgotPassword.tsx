import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Label,
  Typography,
  Separator,
} from "@/core/components/ui";
import { useNavigate } from "react-router-dom";
import { MailCheck, ArrowLeft } from "lucide-react";
import type { ForgotPasswordPayload } from "../types";
import { forgotRequest } from "../services/forgotRequest";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ForgotPasswordPayload = {
      email,
    };
    try {
      const resp = await forgotRequest(payload);
      toast.success(
        resp.message || "E-mail de recuperação enviado com sucesso!",
      );
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao enviar o e-mail de recuperação. Por favor, tente novamente.",
      );
    } finally {
      setIsSubmitted(true);
    }
  };

  return (
    <Box className="overflow-hidden rounded-2xl border bg-background/80 p-4 shadow-2xl backdrop-blur md:p-8">
      {!isSubmitted ? (
        <>
          <Box display="flex" direction="column" gap={8}>
            <Box>
              <Typography variant="h2" className="text-foreground">
                Recuperar senha
              </Typography>
              <Typography variant="body" className="mt-2 text-muted-foreground">
                Esqueceu seus dados? Insira seu e-mail abaixo para receber as
                instruções de acesso.
              </Typography>
            </Box>
          </Box>

          <Separator className="my-8" />

          <form onSubmit={handleSubmit} className="grid gap-6">
            <Box display="flex" direction="column" gap={6}>
              <Label htmlFor="email">E-mail de cadastro</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Box>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
            >
              Enviar link de acesso
            </Button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </button>
          </form>
        </>
      ) : (
        /* Estado de Sucesso */
        <Box
          display="flex"
          direction="column"
          align="center"
          justify="center"
          className="text-center py-4"
          gap={12}
        >
          <Box className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck size={40} />
          </Box>

          <Box display="flex" direction="column" gap={4}>
            <Typography variant="h2">E-mail enviado!</Typography>
            <Typography variant="body" className="text-muted-foreground">
              Se o e-mail <strong>{email}</strong> estiver cadastrado, você
              receberá em instantes as instruções para criar sua nova senha.
            </Typography>
          </Box>

          <Separator className="w-full" />

          <Box className="w-full" display="flex" direction="column" gap={4}>
            <Button
              onClick={() => navigate("/login")}
              variant="default"
              className="w-full"
            >
              Ir para o Login
            </Button>
            <Typography variant="small" className="text-muted-foreground">
              Não recebeu? Verifique sua pasta de spam ou tente novamente em
              alguns minutos.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
