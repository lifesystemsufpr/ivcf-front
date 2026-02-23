import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, Ear, Hand, Clock } from "lucide-react"; // Ícones para a lista
import { Box, Button, Typography } from "@/core/components/ui";
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
    <Box className="max-h-screen flex flex-col">
      {/* Conteúdo Branco Arredondado */}
      <Box className="max-w-2xl mx-auto bg-popover rounded-[2.5rem] shadow-xl p-8 md:p-12 flex flex-col gap-8">
        <Typography variant="h3" className="text-3xl font-bold mb-1">
          IVCF-20 - Instruções
        </Typography>
        <Box direction="column" gap={16}>
          <Typography
            variant="h2"
            className="text-primary text-3xl font-bold leading-tight"
          >
            Antes de iniciar a avaliação
          </Typography>

          <Typography className="text-muted-foreground leading-relaxed">
            O IVCF-20 é um instrumento de triagem para identificar
            vulnerabilidades clínico-funcionais do idoso. Leia as perguntas com
            clareza sem induzir respostas.
          </Typography>
        </Box>

        {/* Lista de Instruções com Ícones */}
        <Box direction="column" gap={24} className="my-2">
          {[
            {
              Icon: MessageCircle,
              text: "Realize em local calmo e sem interrupções",
            },
            { Icon: Ear, text: "Leia cada pergunta de forma pausada" },
            {
              Icon: Hand,
              text: "Não tente explicar ou interpretar as perguntas para o paciente",
            },
            { Icon: Clock, text: "Tempo estimado: 5 a 10 minutos" },
          ].map((item, index) => (
            <Box
              key={index}
              display="flex"
              align="center"
              direction="row"
              gap={8}
            >
              <item.Icon className="text-primary shrink-0" size={24} />
              <Typography className="text-muted-foreground font-medium">
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Lógica de Seleção de Participante */}
        <Box
          direction="column"
          gap={12}
          className="border-t border-slate-100 pt-6"
        >
          {!initialId ? (
            <>
              <Typography
                variant="small"
                className="font-semibold text-primary"
              >
                Escolha o participante para continuar:
              </Typography>
              <ParticipantAutocomplete
                onChange={(value) => setSelectedLocalId(value?.id ?? null)}
                initialId={selectedLocalId}
                className="w-full"
              />
            </>
          ) : (
            <Box className="p-4 bg-primary-soft rounded-2xl border border-primary/10">
              <Typography
                variant="small"
                className="text-primary font-bold text-center"
              >
                ✓ Participante selecionado e pronto para avaliação.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Botão de Ação (Verde Accent) */}
        <Box display="flex" justify="center" className="pt-4">
          <Button
            onClick={handleStart}
            disabled={!canStart}
            variant="secondary"
            fullWidth
            size="lg"
            className="w-full max-w-xs h-14 text-lg rounded-xl shadow-lg shadow-accent/20"
          >
            Iniciar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
