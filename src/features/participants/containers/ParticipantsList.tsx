import {
  Box,
  Button,
  Dialog,
  type FilterState,
  Modal,
  type SortState,
  Table,
  createColumn,
} from "@/core/components/ui";
import { formatDate } from "@/core/utils";
import { clientRoutes } from "@/core/configs/client.routes";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, type MouseEvent } from "react";
import { Pencil, Trash, ClipboardPlus } from "lucide-react";
import ParticipantForm from "../components/ParticipantForm";
import type { Participant, ParticipantRequest } from "../types";
import { useUpdateParticipant } from "../hooks/useUpdateParticipant";
import { Bounce, toast } from "react-toastify";
import { useDeleteParticipant } from "../hooks/useDeleteParticipant";
import { useListParticipants } from "../hooks/useListParticipants";
import { parseParticipantResponse } from "../utils";

export default function ParticipantList() {
  const navigate = useNavigate();
  const updateParticipantMutation = useUpdateParticipant();
  const deleteParticipantMutation = useDeleteParticipant();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [sort, setSort] = useState<SortState>({
    field: null,
    direction: "asc",
  });
  const [filters, setFilters] = useState<FilterState>({});
  const { data } = useListParticipants({ page, pageSize, sort, filters });

  const [participantToDelete, setParticipantToDelete] =
    useState<Participant | null>(null);
  const [participantToEdit, setParticipantToEdit] =
    useState<Participant | null>(null);
  const participants = useMemo(
    () =>
      data?.data.map((participant) => parseParticipantResponse(participant)) ??
      [],
    [data],
  );

  const columns = useMemo(
    () => [
      createColumn<Participant>({
        field: "fullName",
        header: "Nome",
        sortable: true,
        filterable: true,
      }),
      createColumn<Participant>({
        field: "email",
        header: "E-mail",
        filterable: true,
      }),
      createColumn<Participant>({
        field: "birthDate",
        header: "Nascimento",
        sortable: true,
        render: (value) => (value ? formatDate(String(value), true) : "—"),
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

    deleteParticipantMutation.mutate(participantToDelete.id, {
      onSuccess: () => {
        toast.success("Participante excluido com sucesso.", {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        setParticipantToDelete(null);
      },
      onError: (error) => {
        console.error("Erro ao excluir participante:", error);
        const msg =
          error.message ||
          "Erro ao excluir participante. Por favor, tente novamente.";
        toast.error(msg, {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      },
    });
  };

  const handleUpdateParticipant = async (data: ParticipantRequest) => {
    if (!participantToEdit) return;

    updateParticipantMutation.mutate(
      {
        id: participantToEdit.id,
        data,
      },
      {
        onSuccess: () => {
          setParticipantToEdit(null);
        },
        onError: (error) => {
          console.error("Erro ao atualizar participante:", error);
          const msg =
            error.message ||
            "Erro ao atualizar participante. Por favor, tente novamente.";
          toast.error(msg, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        },
      },
    );
  };

  return (
    <Box display="flex" direction="column" gap={4} className="mt-1">
      <Table.Root
        data={participants}
        columns={columns}
        serverSide={{
          total: data?.meta?.total ?? 0,
          page: data?.meta?.page ?? page,
          pageSize: data?.meta?.pageSize ?? pageSize,
          sort,
          filters,
          onPageChange: setPage,
          onPageSizeChange: (nextPageSize) => {
            setPage(1);
            setPageSize(nextPageSize);
          },
          onSortChange: (nextSort) => {
            setPage(1);
            setSort(nextSort);
          },
          onFilterChange: (field, value) => {
            setPage(1);
            setFilters((current) => ({
              ...current,
              [field]: value,
            }));
          },
        }}
        getRowId={(row) => row.id ?? row.email}
      >
        <Table.Header showActionsColumn actionsLabel="Ações" />

        <Table.Body
          onRowClick={handleViewDetails}
          renderActions={(participant) => (
            <Box display="flex" direction="row" gap={8} justify="center">
              <Button
                variant="secondary"
                size="sm"
                onClick={(event) => handleStartAssessment(event, participant)}
              >
                <ClipboardPlus size={16} />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={(event) => handleEdit(event, participant)}
              >
                <Pencil size={16} />
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
          <Table.Pagination
            extraColumns={1}
            pageSizeOptions={[5, 8, 10, 20, 50]}
          />
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
            disabled={deleteParticipantMutation.isPending}
            onClick={() => setParticipantToDelete(null)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={deleteParticipantMutation.isPending}
            onClick={handleConfirmDelete}
          >
            {deleteParticipantMutation.isPending ? "Excluindo..." : "Excluir"}
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
