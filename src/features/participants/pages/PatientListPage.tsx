import { Box, Separator, Typography } from "@/core/components/ui";
import ParticipantAutocomplete from "../components/ParticipantAutocomplet";
import { ParticipantProvider } from "../context/ParticipantContext";
import ParticipantList from "../containers/ParticipantsList";

export function PatientListPage() {
  return (
    <ParticipantProvider>
      <Box className="flex flex-col h-[83vh]">
        <Box
          display="flex"
          direction="row"
          justify="space-between"
          align="center"
        >
          <Typography variant="h4">Lista de Pacientes</Typography>
          <ParticipantAutocomplete />
        </Box>
        <Separator className="mt-3 mb-3" />
        <Box
          className="flex-1 overflow-y-auto pr-2 scrollbar-thin 

    [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-slate-300
    [&::-webkit-scrollbar-thumb]:rounded-full
    hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
        >
          <ParticipantList />
        </Box>
      </Box>
    </ParticipantProvider>
  );
}
