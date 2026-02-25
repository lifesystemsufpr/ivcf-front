import {
  Box,
  Button,
  Dialog,
  Modal,
  Table,
  createColumn,
} from "@/core/components/ui";
import { formatDate } from "@/core/utils";
import { clientRoutes } from "@/core/configs/client.routes";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, type MouseEvent } from "react";
import { Pencil, PlusCircle, Trash } from "lucide-react";
import ParticipantForm from "../components/ParticipantForm";
import { useParticipantContext } from "../context/ParticipantContext";
import type { Participant } from "../types";

export default function ParticipantList() {
  const { participants } = useParticipantContext();
  const navigate = useNavigate();

  const [participantToDelete, setParticipantToDelete] =
    useState<Participant | null>(null);
  const [participantToEdit, setParticipantToEdit] =
    useState<Participant | null>(null);

  const columns = useMemo(
    () => [
      createColumn<Participant>({
        field: "fullName",
        header: "Nome",
        sortable: true,
        filterable: true,
      }),
      createColumn<Participant>({
        field: "cpf",
        header: "CPF",
        sortable: true,
        filterable: true,
      }),
      createColumn<Participant>({
        field: "birthDate",
        header: "Nascimento",
        sortable: true,
        render: (value) => (value ? formatDate(String(value)) : "—"),
      }),
      createColumn<Participant>({
        field: "email",
        header: "E-mail",
        filterable: true,
      }),
    ],
    [],
  );

  const handleViewDetails = (participant: Participant) => {
    navigate(clientRoutes.PARTICIPANTS.DETAILS({ id: participant.id }));
  };

  const handleStartAssessment = (
    event: MouseEvent<HTMLButtonElement>,
    participant: Participant,
  ) => {
    event.stopPropagation();
    navigate(clientRoutes.IVCF.INSTRUCTIONS, {
      state: { participantId: participant.id },
    });
  };

  const handleEdit = (
    event: MouseEvent<HTMLButtonElement>,
    participant: Participant,
  ) => {
    event.stopPropagation();
    setParticipantToEdit(participant);
  };

  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>,
    participant: Participant,
  ) => {
    event.stopPropagation();
    setParticipantToDelete(participant);
  };

  const handleConfirmDelete = () => {
    if (!participantToDelete) return;
    console.log("Confirmar exclusao", participantToDelete.fullName);
    setParticipantToDelete(null);
  };

  const handleUpdateParticipant = (data: Participant) => {
    console.log("Atualizar participante", data);
    setParticipantToEdit(null);
  };

  return (
    <Box display="flex" direction="column" gap={4} className="mt-1">
      <Table.Root
        data={participants}
        columns={columns}
        pageSize={8}
        getRowId={(row) => row.id ?? row.cpf}
      >
        <Table.Header showActionsColumn actionsLabel="Ações" />

        <Table.Body
          onRowClick={handleViewDetails}
          renderActions={(participant) => (
            <Box display="flex" direction="row" gap={8} justify="center">
              <Button
                variant="secondary"
                size="sm"
                onClick={(event) => handleEdit(event, participant)}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(event) => handleStartAssessment(event, participant)}
              >
                <PlusCircle size={16} />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(event) => handleDelete(event, participant)}
              >
                <Trash size={16} />
              </Button>
            </Box>
          )}
        />

        <Table.Footer>
          <Table.Pagination extraColumns={1} />
        </Table.Footer>
      </Table.Root>

      <Dialog
        open={!!participantToDelete}
        onClose={() => setParticipantToDelete(null)}
        title="Excluir participante"
        description={
          participantToDelete
            ? `Tem certeza que deseja excluir ${participantToDelete.fullName}?`
            : undefined
        }
      >
        <div className="flex w-full justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setParticipantToDelete(null)}
          >
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </div>
      </Dialog>

      <Modal
        open={!!participantToEdit}
        onClose={() => setParticipantToEdit(null)}
        title="Editar participante"
        description="Atualize os dados do participante."
        size="lg"
      >
        {participantToEdit && (
          <ParticipantForm
            initialValues={participantToEdit}
            title="Editar participante"
            onSubmit={handleUpdateParticipant}
            onCancel={() => setParticipantToEdit(null)}
          />
        )}
      </Modal>
    </Box>
  );
}
