import { Box, Typography } from "@/core/components/ui";
import ParticipantAutocomplete from "../components/ParticipantAutocomplet";

export function PatientListPage() {
  return (
    <Box>
      <Box display="flex" direction="row" justify="space-between">
        <Typography variant="h4">Lista de Pacientes</Typography>
        <ParticipantAutocomplete />
      </Box>
    </Box>
  );
}
