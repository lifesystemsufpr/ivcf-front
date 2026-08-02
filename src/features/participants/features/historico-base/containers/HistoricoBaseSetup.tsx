import { useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Typography } from "@/core/components/ui";
import { getErrorMessage } from "@/core/utils";
import { FilePlus2, ListChecks } from "lucide-react";
import { useMutationHistoricoBase } from "../hooks/useMutationHistoricoBase";
import { HistoricoBaseList } from "./HistoricoBaseList";
import type { Base, CreateBaseRequest } from "../types";

interface HistoricoBaseSetupProps {
  participantId: string;
  onBaseCreated?: (base: Base) => void;
}

export function HistoricoBaseSetup({
  participantId,
  onBaseCreated,
}: HistoricoBaseSetupProps) {
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedBaseIds, setSelectedBaseIds] = useState<string[]>([]);

  const createBase = useMutationHistoricoBase(participantId);

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

  const createWith = (payload: CreateBaseRequest, successMessage: string) => {
    createBase.mutate(payload, {
      onSuccess: (base) => {
        toast.success(successMessage);
        setSelectedBaseIds([]);
        setIsListVisible(false);
        onBaseCreated?.(base);
      },
      onError: (error) => {
        toast.error(
          getErrorMessage(error, "Erro ao criar a base. Tente novamente."),
        );
      },
    });
  };

  const handleCreateFromScratch = () => {
    createWith({ origin: "FROM_SCRATCH" }, "Base criada do zero com sucesso.");
  };

  const handleCopySelectedBases = () => {
    if (selectedBaseIds.length === 0) return;

    createWith(
      { origin: "COPIED", sourceBaseIds: selectedBaseIds },
      "Base criada a partir das bases selecionadas.",
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
          disabled={createBase.isPending}
        >
          {isListVisible ? "Ocultar bases existentes" : "Ver bases existentes"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          leftIcon={<FilePlus2 size={16} />}
          onClick={handleCreateFromScratch}
          loading={createBase.isPending}
          disabled={createBase.isPending}
        >
          Criar base do zero
        </Button>
      </div>

      {isListVisible && (
        <Box display="flex" direction="column" gap={12}>
          <Typography variant="caption" className="text-gray-500">
            Selecione as bases que deseja aproveitar para este participante.
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
                onClick={handleCopySelectedBases}
                loading={createBase.isPending}
                disabled={createBase.isPending}
              >
                Criar base com a seleção
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
