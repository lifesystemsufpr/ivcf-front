import { useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Typography } from "@/core/components/ui";
import { getErrorMessage } from "@/core/utils";
import { FilePlus2, ListChecks } from "lucide-react";
import { useMutationShareRequest } from "@/features/requests/hooks/useMutationShareRequest";
import { useMutationHistoricoBase } from "../hooks/useMutationHistoricoBase";
import { HistoricoBaseList } from "./HistoricoBaseList";

interface HistoricoBaseSetupProps {
  participantId: string;
  onBaseCreated?: () => void;
}

export function HistoricoBaseSetup({
  participantId,
  onBaseCreated,
}: HistoricoBaseSetupProps) {
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedBaseIds, setSelectedBaseIds] = useState<string[]>([]);

  const createBase = useMutationHistoricoBase(participantId);
  const createShareRequest = useMutationShareRequest();

  const isPending = createBase.isPending || createShareRequest.isPending;

  const toggleList = () => {
    setIsListVisible((visible) => {
      if (visible) setSelectedBaseIds([]);
      return !visible;
    });
  };

  const toggleBase = (baseId: string) => {
    setSelectedBaseIds((current) =>
      current.includes(baseId)
        ? current.filter((id) => id !== baseId)
        : [...current, baseId],
    );
  };

  const finish = (successMessage: string) => {
    toast.success(successMessage);
    setSelectedBaseIds([]);
    setIsListVisible(false);
    onBaseCreated?.();
  };

  const handleCreateFromScratch = () => {
    createBase.mutate(
      { origin: "FROM_SCRATCH" },
      {
        onSuccess: () => finish("Base criada do zero com sucesso."),
        onError: (error) =>
          toast.error(
            getErrorMessage(error, "Erro ao criar a base. Tente novamente."),
          ),
      },
    );
  };

  const handleRequestSelectedBases = () => {
    if (selectedBaseIds.length === 0) return;

    createShareRequest.mutate(
      { participantId, sourceHistoricoBaseIds: selectedBaseIds },
      {
        onSuccess: () =>
          finish("Solicitação enviada ao dono das bases selecionadas."),
        onError: (error) =>
          toast.error(
            getErrorMessage(
              error,
              "Erro ao solicitar as bases. Tente novamente.",
            ),
          ),
      },
    );
  };

  const selectedCount = selectedBaseIds.length;

  return (
    <Box display="flex" direction="column" gap={12}>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          leftIcon={<ListChecks size={16} />}
          onClick={toggleList}
          disabled={isPending}
        >
          {isListVisible ? "Ocultar bases existentes" : "Ver bases existentes"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          leftIcon={<FilePlus2 size={16} />}
          onClick={handleCreateFromScratch}
          loading={createBase.isPending}
          disabled={isPending}
        >
          Criar base do zero
        </Button>
      </div>

      {isListVisible && (
        <Box display="flex" direction="column" gap={12}>
          <Typography variant="caption" className="text-gray-500">
            Selecione as bases que deseja solicitar ao profissional responsável.
          </Typography>

          <HistoricoBaseList
            participantId={participantId}
            selectable
            selectedBaseIds={selectedBaseIds}
            onToggleBase={toggleBase}
          />

          {selectedCount > 0 && (
            <Box
              display="flex"
              direction="row"
              justify="space-between"
              align="center"
              gap={12}
              className="flex-wrap"
            >
              <Typography variant="caption" className="text-gray-500">
                {selectedCount === 1
                  ? "1 base selecionada"
                  : `${selectedCount} bases selecionadas`}
              </Typography>

              <Button
                type="button"
                onClick={handleRequestSelectedBases}
                loading={createShareRequest.isPending}
                disabled={isPending}
              >
                Solicitar acesso à seleção
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
