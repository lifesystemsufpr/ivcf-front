import {
  Box,
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
    <Card
      onClick={() => {
        console.log("Clicou");
      }}
      variant={"elevated"}
    >
      <CardHeader className="p-2">
        <Box display="flex" direction="row" gap={5} align="center">
          <Typography>{participant.fullName}</Typography>
          <Typography variant="caption">· CPF: {participant.cpf}</Typography>
        </Box>
      </CardHeader>
      <CardContent className="p-2">
        <Typography variant="caption">{participant.birthDate}</Typography>
      </CardContent>
    </Card>
  );
}
