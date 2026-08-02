import { useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/core/utils";
import { useMutationShareRequest } from "@/features/requests/hooks/useMutationShareRequest";

interface UseHistoricoBaseSelectionParams {
  participantId: string;
  onRequested?: () => void;
}

/**
 * Seleção múltipla de bases e envio da solicitação de acesso ao profissional
 * responsável por elas.
 */
export function useHistoricoBaseSelection({
  participantId,
  onRequested,
}: UseHistoricoBaseSelectionParams) {
  const [selectedBaseIds, setSelectedBaseIds] = useState<string[]>([]);

  const createShareRequest = useMutationShareRequest();

  const toggleBase = (baseId: string) => {
    setSelectedBaseIds((current) =>
      current.includes(baseId)
        ? current.filter((id) => id !== baseId)
        : [...current, baseId],
    );
  };

  const clearSelection = () => setSelectedBaseIds([]);

  const requestSelectedBases = () => {
    if (selectedBaseIds.length === 0) return;

    createShareRequest.mutate(
      { participantId, sourceHistoricoBaseIds: selectedBaseIds },
      {
        onSuccess: () => {
          toast.success("Solicitação enviada ao dono das bases selecionadas.");
          clearSelection();
          onRequested?.();
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Erro ao solicitar as bases. Tente novamente.",
            ),
          );
        },
      },
    );
  };

  return {
    selectedBaseIds,
    selectedCount: selectedBaseIds.length,
    toggleBase,
    clearSelection,
    requestSelectedBases,
    isRequesting: createShareRequest.isPending,
  };
}
