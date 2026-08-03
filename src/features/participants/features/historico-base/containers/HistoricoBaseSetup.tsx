import { useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Typography } from "@/core/components/ui";
import { getErrorMessage } from "@/core/utils";
import { FilePlus2, ListChecks } from "lucide-react";
import { useMutationHistoricoBase } from "../hooks/useMutationHistoricoBase";
import { useHistoricoBaseSelection } from "../hooks/useHistoricoBaseSelection";
import { SelectedBasesActions } from "../components/SelectedBasesActions";
import { HistoricoBaseList } from "./HistoricoBaseList";

interface HistoricoBaseSetupProps {
  participantId: string;
  hasBaseWithProfessional: boolean;
  onBaseCreated?: () => void;
}

export function HistoricoBaseSetup({
  participantId,
  hasBaseWithProfessional,
  onBaseCreated,
}: HistoricoBaseSetupProps) {
  const [isListVisible, setIsListVisible] = useState(false);

  const createBase = useMutationHistoricoBase(participantId);
  const {
    selectedBaseIds,
    selectedCount,
    toggleBase,
    clearSelection,
    requestSelectedBases,
    isRequesting,
  } = useHistoricoBaseSelection({
    participantId,
    onRequested: () => {
      setIsListVisible(false);
      onBaseCreated?.();
    },
  });

  const isPending = createBase.isPending || isRequesting;

  const toggleList = () => {
    setIsListVisible((visible) => {
      if (visible) clearSelection();
      return !visible;
    });
  };

  const handleCreateFromScratch = () => {
    createBase.mutate(
      { origin: "FROM_SCRATCH" },
      {
        onSuccess: () => {
          toast.success(
            hasBaseWithProfessional
              ? "Base existente re-vinculada."
              : "Base criada com sucesso.",
          );
          clearSelection();
          setIsListVisible(false);
          onBaseCreated?.();
        },
        onError: (error) =>
          toast.error(
            getErrorMessage(error, "Erro ao criar a base. Tente novamente."),
          ),
      },
    );
  };

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
          {hasBaseWithProfessional
            ? "Usar base existente"
            : "Criar base do zero"}
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

          <SelectedBasesActions
            selectedCount={selectedCount}
            onRequest={requestSelectedBases}
            isRequesting={isRequesting}
            disabled={isPending}
          />
        </Box>
      )}
    </Box>
  );
}
