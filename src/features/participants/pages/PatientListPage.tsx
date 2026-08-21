import { Box, IconButton, Separator, Typography } from "@/core/components/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ParticipantProvider } from "../context/ParticipantContext";
import ParticipantList from "../containers/ParticipantsList";
import { CreateParticipantModal } from "../containers/CreateParticipantModal";

const scrollAreaClassName = `flex-1 overflow-y-auto pr-2 scrollbar-thin
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-slate-300
  [&::-webkit-scrollbar-thumb]:rounded-full
  hover:[&::-webkit-scrollbar-thumb]:bg-slate-400`;

export function PatientListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <ParticipantProvider>
      <Box type="screen" className="flex flex-col">
        <Box
          display="flex"
          direction="row"
          justify="space-between"
          align="center"
        >
          <Typography variant="h1">Lista de Participantes</Typography>
        </Box>

        <Separator className="mt-3 mb-3" />

        <Box className={scrollAreaClassName}>
          <ParticipantList />
        </Box>

        <Box className="self-end radius-full absolute bottom-10 right-10">
          <IconButton
            variant="accent"
            icon={Plus}
            ariaLabel="Adicionar participante"
            onClick={() => setIsCreateOpen(true)}
          />
        </Box>

        <CreateParticipantModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </Box>
    </ParticipantProvider>
  );
}
