import {
  Box,
  IconButton,
  Modal,
  Separator,
  Typography,
} from "@/core/components/ui";
import ParticipantAutocomplete from "../components/ParticipantAutocomplete";
import ParticipantForm from "../components/ParticipantForm";
import { ParticipantProvider } from "../context/ParticipantContext";
import ParticipantList from "../containers/ParticipantsList";
import type { Participant } from "../types";
import { Plus } from "lucide-react";
import { useState } from "react";

export function PatientListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateParticipant = (data: Participant) => {
    console.log("Criar participante", data);
    setIsCreateOpen(false);
  };

  return (
    <ParticipantProvider>
      <Box className="flex flex-col h-[84vh]">
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
        <Box className="self-end radius-full absolute bottom-4 right-4">
          <IconButton
            variant="accent"
            icon={Plus}
            ariaLabel="Adicionar participante"
            onClick={() => setIsCreateOpen(true)}
          />
        </Box>

        <Modal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Cadastrar participante"
          description="Preencha os dados para adicionar um novo participante."
          size="lg"
        >
          <ParticipantForm
            onSubmit={handleCreateParticipant}
            onCancel={() => setIsCreateOpen(false)}
          />
        </Modal>
      </Box>
    </ParticipantProvider>
  );
}
