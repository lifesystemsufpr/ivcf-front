import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardContent, CardHeader, CardTitle, Typography } from "@/core/components/ui";
import { clientRoutes } from "@/core/configs/client.routes";
import { getStylesByClassification } from "@/features/assessment/utils";
import { IVCF_TOTAL_QUESTIONS } from "../questions";
import { loadSavedAssessment } from "../services/saveAssessment";

export default function ResultScreen() {
	const navigate = useNavigate();
	const { id } = useParams();

	const assessment = useMemo(() => {
		if (!id) return null;
		return loadSavedAssessment(id);
	}, [id]);

	if (!assessment) {
		return (
			<Box className="min-h-screen bg-muted/30 p-6 flex items-center justify-center">
				<Card padding="lg" className="w-full max-w-3xl space-y-4">
					<CardHeader>
						<CardTitle>Resultado não encontrado</CardTitle>
						<Typography variant="small" className="text-muted-foreground">
							Não localizamos os dados desta avaliação. Inicie um novo questionário para continuar.
						</Typography>
					</CardHeader>
					<CardContent className="flex gap-3">
						<Button variant="outline" onClick={() => navigate(clientRoutes.IVCF.LIST)}>Voltar à lista</Button>
						<Button onClick={() => navigate(clientRoutes.IVCF.INSTRUCTIONS)}>Iniciar novo IVCF</Button>
					</CardContent>
				</Card>
			</Box>
		);
	}

	const styles = getStylesByClassification(assessment.classification);

	return (
		<Box className="min-h-screen bg-muted/30 p-6 flex items-center justify-center">
			<Card padding="lg" className="w-full max-w-4xl">
				<CardHeader className="space-y-1">
					<CardTitle>Resultado do IVCF-20</CardTitle>
					<Typography variant="small" className="text-muted-foreground">
						Avaliação concluída em {new Date(assessment.createdAt).toLocaleDateString("pt-BR")}
					</Typography>
				</CardHeader>
				<CardContent className="space-y-6">
					<Box className="grid gap-4 sm:grid-cols-3">
						<Card className="border" padding="md">
							<Typography variant="small" className="text-muted-foreground">Pontuação total</Typography>
							<Typography variant="h2">{assessment.totalScore}</Typography>
							<Typography variant="caption" className="text-muted-foreground">
								{IVCF_TOTAL_QUESTIONS} questões respondidas
							</Typography>
						</Card>
						<Card className={`border ${styles.bg} ${styles.border}`} padding="md">
							<Typography variant="small" className="text-muted-foreground">Classificação</Typography>
							<Typography variant="h2" className={styles.text}>{assessment.classification}</Typography>
							<Typography variant="caption" className="text-muted-foreground">
								Calculada a partir da soma dos escores.
							</Typography>
						</Card>
						<Card className="border" padding="md">
							<Typography variant="small" className="text-muted-foreground">Protocolo</Typography>
							<Typography variant="h3" className="font-semibold">{assessment.id}</Typography>
							<Typography variant="caption" className="text-muted-foreground">Guarde este número para futuras consultas.</Typography>
						</Card>
					</Box>

					<Box className="flex flex-col gap-3 sm:flex-row sm:justify-end">
						<Button variant="outline" onClick={() => navigate(clientRoutes.IVCF.LIST)}>
							Voltar para lista
						</Button>
						<Button onClick={() => navigate(clientRoutes.IVCF.INSTRUCTIONS)}>
							Nova avaliação
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
