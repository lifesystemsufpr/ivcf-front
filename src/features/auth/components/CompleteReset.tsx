import { useNavigate } from "react-router-dom";
import { Box, Button, Separator, Typography } from "@/core/components/ui";

export default function CompleteReset() {
  const router = useNavigate();

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
        <Typography variant="h1">Senha redefinida com sucesso!</Typography>
        <Separator />
        <Button variant="default" size="lg" onClick={() => router("/login")}>
          Voltar para o login
        </Button>
      </Box>
    </Box>
  );
}
