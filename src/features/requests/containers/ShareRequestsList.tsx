import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Table, createColumn } from "@/core/components/ui";
import { formatDateTime, getErrorMessage } from "@/core/utils";
import { Check, X, Ban } from "lucide-react";
import { useListShareRequests } from "../hooks/useListShareRequests";
import { useShareRequestAction } from "../hooks/useShareRequestAction";
import type { ShareRequestAction } from "../services/share-requests.service";
import { ShareRequestStatusBadge } from "../components/ShareRequestStatusBadge";
import type { ShareRequestItem, ShareRequestRole } from "../types";

const actionMessages: Record<ShareRequestAction, string> = {
  approve: "Solicitação aprovada com sucesso.",
  reject: "Solicitação rejeitada.",
  cancel: "Solicitação cancelada.",
};

interface ShareRequestsListProps {
  role: ShareRequestRole;
}

export function ShareRequestsList({ role }: ShareRequestsListProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useListShareRequests({ as: role, page, limit });
  const shareRequestAction = useShareRequestAction();

  const requests = useMemo(() => data?.data ?? [], [data]);

  const isOwnerView = role === "owner";

  const columns = useMemo(
    () => [
      createColumn<ShareRequestItem>({
        field: "participantName",
        header: "Participante",
      }),
      createColumn<ShareRequestItem>({
        field: isOwnerView ? "requesterName" : "ownerName",
        header: isOwnerView ? "Solicitante" : "Dono da base",
      }),
      createColumn<ShareRequestItem>({
        field: "status",
        header: "Status",
        render: (value) => (
          <ShareRequestStatusBadge
            status={value as ShareRequestItem["status"]}
          />
        ),
      }),
      createColumn<ShareRequestItem>({
        field: "requestedAt",
        header: "Solicitada em",
        render: (value) => (value ? formatDateTime(String(value)) : "—"),
      }),
      createColumn<ShareRequestItem>({
        field: "respondedAt",
        header: "Respondida em",
        render: (value) => (value ? formatDateTime(String(value)) : "—"),
      }),
    ],
    [isOwnerView],
  );

  const runAction = (request: ShareRequestItem, action: ShareRequestAction) => {
    shareRequestAction.mutate(
      { id: request.id, action },
      {
        onSuccess: () => toast.success(actionMessages[action]),
        onError: (error) =>
          toast.error(
            getErrorMessage(
              error,
              "Erro ao atualizar a solicitação. Tente novamente.",
            ),
          ),
      },
    );
  };

  const isRowPending = (request: ShareRequestItem) =>
    shareRequestAction.isPending &&
    shareRequestAction.variables?.id === request.id;

  return (
    <Box display="flex" direction="column" gap={4} className="mt-1">
      <Table.Root
        data={requests}
        columns={columns}
        serverSide={{
          total: data?.meta?.total ?? requests.length,
          page: data?.meta?.page ?? page,
          pageSize: data?.meta?.pageSize ?? limit,
          onPageChange: setPage,
          onPageSizeChange: (nextLimit) => {
            setPage(1);
            setLimit(nextLimit);
          },
        }}
        getRowId={(row) => row.id}
      >
        <Table.Header showActionsColumn actionsLabel="Ações" />

        <Table.Body
          emptyMessage={
            isLoading
              ? "Carregando solicitações..."
              : "Nenhuma solicitação encontrada."
          }
          renderActions={(request: ShareRequestItem) => {
            if (request.status !== "PENDING") {
              return <span className="text-muted-foreground">—</span>;
            }

            const pending = isRowPending(request);

            return (
              <Box display="flex" direction="row" gap={8} justify="center">
                {isOwnerView ? (
                  <>
                    <Button
                      tooltip={{ content: "Aprovar solicitação" }}
                      variant="secondary"
                      size="sm"
                      loading={pending}
                      disabled={pending}
                      onClick={() => runAction(request, "approve")}
                    >
                      <Check size={16} />
                    </Button>
                    <Button
                      tooltip={{ content: "Rejeitar solicitação" }}
                      variant="destructive"
                      size="sm"
                      loading={pending}
                      disabled={pending}
                      onClick={() => runAction(request, "reject")}
                    >
                      <X size={16} />
                    </Button>
                  </>
                ) : (
                  <Button
                    tooltip={{ content: "Cancelar solicitação" }}
                    variant="outline"
                    size="sm"
                    loading={pending}
                    disabled={pending}
                    onClick={() => runAction(request, "cancel")}
                  >
                    <Ban size={16} />
                  </Button>
                )}
              </Box>
            );
          }}
        />

        <Table.Footer>
          <Table.Pagination extraColumns={1} pageSizeOptions={[5, 10, 20, 50]} />
        </Table.Footer>
      </Table.Root>
    </Box>
  );
}
