import Filter from "../components/Filter";
import AssesmentCard from "@/features/assessment/components/AssesmentCard";
import useFetchAssessments from "../hooks/useFetchAssessments";
import { Box, Separator, Typography } from "@/core/components/ui";

interface ParticipantAssessmentsScreenProps {
  id: string;
}

export default function ParticipantAssessmentsScreen({
  id,
}: ParticipantAssessmentsScreenProps) {
  const participantId = id;
  const { assessments, errors, isLoading } = useFetchAssessments(participantId);
  return (
    <Box display="flex" direction="column" gap={6}>
      <Filter />

      <Separator />
      {isLoading && <Typography>Carregando avaliações...</Typography>}
      {errors && <Typography color="accent">{errors}</Typography>}
      {!isLoading && !errors && assessments.length === 0 && (
        <Typography>
          Nenhuma avaliação encontrada para este paciente.
        </Typography>
      )}
      {!isLoading && !errors && assessments.length > 0 && (
        <Box display="flex" direction="column" gap={3}>
          {assessments.map((assessment) => (
            <AssesmentCard key={assessment.id} assessment={assessment} />
          ))}
        </Box>
      )}
    </Box>
  );
}
