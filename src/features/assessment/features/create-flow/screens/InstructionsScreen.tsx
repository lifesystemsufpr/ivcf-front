import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, CardHeader, CardTitle, Typography } from "@/core/components/ui";
import { clientRoutes } from "@/core/configs/client.routes";
import ParticipantAutocomplete from "@/features/participants/components/ParticipantAutocomplete";
import { useAssessmentContext } from "../context/CreateAssessmentContext";

interface InstructionsScreenProps {
	participantId?: string;
}

export default function InstructionsScreen({ participantId }: InstructionsScreenProps) {
	const navigate = useNavigate();
	const { participantId: selectedId, selectParticipant, reset } = useAssessmentContext();
	const [localParticipantId, setLocalParticipantId] = useState<string | null>(participantId ?? null);

	useEffect(() => {
		if (participantId) {
			selectParticipant(participantId);
		}
	}, [participantId, selectParticipant]);

	useEffect(() => {
		if (selectedId && !localParticipantId) {
			setLocalParticipantId(selectedId);
		}
	}, [selectedId, localParticipantId]);

	const canStart = Boolean(localParticipantId || participantId || selectedId);

	const handleStart = () => {
		const effectiveId = localParticipantId || participantId || selectedId;
		if (!effectiveId) return;

		reset();
		selectParticipant(effectiveId);
		navigate(clientRoutes.IVCF.TEST);
	};

	return (
		<Box className="min-h-screen bg-muted/30 p-6 flex items-center justify-center">
			<Card className="w-full max-w-4xl" padding="lg">
				<CardHeader>
					<CardTitle>Instruções do IVCF-20</CardTitle>
					<Typography variant="small" className="text-muted-foreground">
						Siga as orientações antes de iniciar a avaliação. O questionário tem 20 perguntas e leva poucos minutos.
					</Typography>
				</CardHeader>
				<CardContent className="space-y-6">
					<Box className="space-y-2">
						<Typography>O que esperar:</Typography>
						<ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
							<li>Uma pergunta por vez, para manter o foco.</li>
							<li>Suas respostas são salvas automaticamente durante o preenchimento.</li>
							<li>Você poderá voltar para revisar antes de finalizar.</li>
						</ul>
					</Box>

					{!participantId && (
						<Box className="space-y-2">
							<Typography variant="small" className="font-medium">
								Escolha o participante
							</Typography>
							<ParticipantAutocomplete
								onChange={(value) => setLocalParticipantId(value?.id ?? null)}
								className="max-w-xl"
							/>
						</Box>
					)}

					<Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<Typography variant="small" className="text-muted-foreground">
							Depois de começar, você pode navegar entre as questões e retomar de onde parou.
						</Typography>
						<Button onClick={handleStart} disabled={!canStart} size="lg">
							Iniciar questionário
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
