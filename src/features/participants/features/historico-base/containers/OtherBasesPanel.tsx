import { Box, Typography } from "@/core/components/ui";
import { useHistoricoBaseSelection } from "../hooks/useHistoricoBaseSelection";
import { SelectedBasesActions } from "../components/SelectedBasesActions";
import { HistoricoBaseList } from "./HistoricoBaseList";

interface OtherBasesPanelProps {
  participantId: string;
}

export function OtherBasesPanel({ participantId }: OtherBasesPanelProps) {
  const {
    selectedBaseIds,
    selectedCount,
    toggleBase,
    requestSelectedBases,
    isRequesting,
  } = useHistoricoBaseSelection({ participantId });

  return (
    <Box display="flex" direction="column" gap={12}>
      <Typography variant="small">
        Bases deste participante mantidas por outros profissionais. Selecione as
        que deseja solicitar acesso e acrescentar ao seu historico.
      </Typography>

      <HistoricoBaseList
        participantId={participantId}
        ownership="others"
        emptyMessage="Nenhum outro profissional possui base deste participante."
        selectable
        selectedBaseIds={selectedBaseIds}
        onToggleBase={toggleBase}
      />

      <SelectedBasesActions
        selectedCount={selectedCount}
        onRequest={requestSelectedBases}
        isRequesting={isRequesting}
      />
    </Box>
  );
}
