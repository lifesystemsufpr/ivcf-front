import { Grid, Typography } from "@/core/components/ui";
import { useListHistoricoBases } from "../hooks/useListHistoricoBases";
import { HistoricoBaseCard } from "../components/HistoricoBaseCard";

/** "own" = bases do profissional logado, "others" = bases dos demais. */
type HistoricoBaseOwnership = "all" | "own" | "others";

interface HistoricoBaseListProps {
  participantId: string;
  ownership?: HistoricoBaseOwnership;
  emptyMessage?: string;
  selectable?: boolean;
  selectedBaseIds?: string[];
  onToggleBase?: (baseId: string) => void;
}

export function HistoricoBaseList({
  participantId,
  ownership = "all",
  emptyMessage = "Nenhuma base encontrada para este participante.",
  selectable,
  selectedBaseIds = [],
  onToggleBase,
}: HistoricoBaseListProps) {
  const { data, isLoading, error } = useListHistoricoBases(participantId);

  if (isLoading) {
    return (
      <Typography variant="body">Carregando histórico de bases...</Typography>
    );
  }

  if (error || !data) {
    return (
      <Typography variant="body" color="secondary">
        Erro ao carregar histórico de bases.
      </Typography>
    );
  }

  const bases = data.bases.filter((base) => {
    if (ownership === "own") return base.isCurrentUserOwner;
    if (ownership === "others") return !base.isCurrentUserOwner;
    return true;
  });

  if (bases.length === 0) {
    return (
      <Typography variant="body" color="secondary">
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <Grid container spacing={12} className="mt-4 w-full">
      {bases.map((base) => (
        <Grid item xs={12} sm={6} key={base.id}>
          <HistoricoBaseCard
            base={base}
            selectable={selectable}
            selected={selectedBaseIds.includes(base.id)}
            onClick={onToggleBase}
          />
        </Grid>
      ))}
    </Grid>
  );
}
