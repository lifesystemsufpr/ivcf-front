import { Avatar, Box, Typography } from "@/core/components/ui";
import type { Participant } from "../types";
import { formatDateTime } from "@/core/utils";

interface ParticipantHeaderProps {
  participant: Participant;
}

export default function ParticipantHeader({
  participant,
}: ParticipantHeaderProps) {
  const updatedAtFormatted = participant.updatedAt
    ? "Atualizado em " + formatDateTime(participant.updatedAt)
    : "Não atualizado";

  return (
    <Box display="flex" direction="row" align="center" gap={3}>
      <Avatar name={participant.fullName} />
      <Box display="flex" direction="column" gap={1} className="ml-3">
        <Typography className="font-bold text-primary">
          {participant.fullName}
        </Typography>
        <Typography variant={"caption"}>{updatedAtFormatted}</Typography>
      </Box>
    </Box>
  );
}
