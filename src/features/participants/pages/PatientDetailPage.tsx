import { Link as RouterLink, useParams } from "react-router-dom";
import { participantsMock } from "../mocks";
import ParticipantHeader from "../components/ParticipantHeader";
import { Box, Breadcrumbs, Link, Typography } from "@/core/components/ui";
import { clientRoutes } from "@/core/configs/client.routes";

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();

  const participant = participantsMock.find((p) => p.id === id);

  if (!participant) {
    return null;
  }

  return (
    <Box display="flex" direction="column" gap={3}>
      <Breadcrumbs>
        <Link as={RouterLink} to={clientRoutes.PARTICIPANTS.LIST}>
          Pacientes
        </Link>
        <Typography as="span" variant="small" className="text-foreground">
          {participant.fullName}
        </Typography>
      </Breadcrumbs>
      <ParticipantHeader participant={participant} />
    </Box>
  );
}
