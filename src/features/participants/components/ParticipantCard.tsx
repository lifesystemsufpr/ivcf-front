import {
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@/core/components/ui";
import type { Participant } from "../types";

interface ParticipantCardProps {
  participant: Participant;
}

export default function ParticipantCard({ participant }: ParticipantCardProps) {
  return (
    <Card>
      <CardHeader title={participant.fullName} />
      <CardContent>
        <Typography variant="caption">CPF: {participant.cpf}</Typography>
      </CardContent>
    </Card>
  );
}
