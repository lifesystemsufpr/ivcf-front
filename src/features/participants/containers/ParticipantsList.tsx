import { Box } from "@/core/components/ui";
import { useParticipantContext } from "../context/ParticipantContext";
import ParticipantCard from "../components/ParticipantCard";

export default function ParticipantList() {
  const { participants } = useParticipantContext();
  return (
    <Box display="flex" direction="column" gap={10} className="mt-1">
      {participants.map((participant) => (
        <ParticipantCard key={participant.cpf} participant={participant} />
      ))}
    </Box>
  );
}
