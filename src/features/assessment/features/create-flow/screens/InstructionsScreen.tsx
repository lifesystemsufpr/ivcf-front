import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Typography,
} from "@/core/components/ui";
import { clientRoutes } from "@/core/configs/client.routes";
import ParticipantAutocomplete from "@/features/participants/components/ParticipantAutocomplete";
import { useAssessmentContext } from "../context/CreateAssessmentContext";

interface InstructionsScreenProps {
  participantId?: string;
}

export default function InstructionsScreen({
  participantId: propParticipantId,
}: InstructionsScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectParticipant, reset } = useAssessmentContext();

  const initialId = useMemo(() => {
    const stateId = (location.state as { participantId?: string } | null)
      ?.participantId;
    return propParticipantId ?? stateId ?? null;
  }, [propParticipantId, location.state]);

  const [selectedLocalId, setSelectedLocalId] = useState<string | null>(
    initialId,
  );

  const handleStart = () => {
    if (!selectedLocalId) return;
    reset();
    selectParticipant(selectedLocalId);

    navigate(clientRoutes.IVCF.TEST);
  };

  const canStart = Boolean(selectedLocalId);

  return (
    <Box className=" p-3 flex items-center justify-center">
      <Card className="w-full max-w-4xl" padding="lg">
        <CardHeader>
          <CardTitle>Instruções do IVCF-20</CardTitle>
          <Typography variant="small" className="text-muted-foreground">
            Siga as orientações antes de iniciar a avaliação. O questionário tem
            20 perguntas e leva poucos minutos.
          </Typography>
        </CardHeader>
        <CardContent className="space-y-6">
          <Box className="space-y-2">
            <Typography className="font-medium">O que esperar:</Typography>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Uma pergunta por vez, para manter o foco.</li>
              <li>Suas respostas são salvas automaticamente.</li>
              <li>Você poderá voltar para revisar antes de finalizar.</li>
            </ul>
          </Box>

          {/* Só mostra o seletor se não veio um ID fixo por prop ou state */}
          {!initialId && (
            <Box className="space-y-2">
              <Typography variant="small" className="font-medium">
                Escolha o participante
              </Typography>
              <ParticipantAutocomplete
                onChange={(value) => setSelectedLocalId(value?.id ?? null)}
                initialId={selectedLocalId}
                className="max-w-xl"
              />
            </Box>
          )}

          {/* Feedback visual se o participante já estiver selecionado */}
          {initialId && (
            <Box className="p-3 bg-primary/5 border border-primary/10 rounded-md">
              <Typography variant="small" className="text-primary font-medium">
                Participante selecionado para avaliação.
              </Typography>
            </Box>
          )}

          <Box className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Typography
              variant="small"
              className="text-muted-foreground max-w-md"
            >
              Ao iniciar, você será direcionado para a primeira questão do
              IVCF-20.
            </Typography>
            <Button
              onClick={handleStart}
              disabled={!canStart}
              size="lg"
              className="px-8"
            >
              Iniciar questionário
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
