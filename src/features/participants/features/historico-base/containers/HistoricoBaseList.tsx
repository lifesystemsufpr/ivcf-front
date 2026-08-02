import { Grid, Typography } from "@/core/components/ui";
import { useListHistoricoBases } from "../hooks/useListHistoricoBases";
import { HistoricoBaseCard } from "../components/HistoricoBaseCard";

interface HistoricoBaseListProps {
  participantId: string;
  selectable?: boolean;
  selectedBaseIds?: string[];
  onToggleBase?: (baseId: string) => void;
}

export function HistoricoBaseList({
  participantId,
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

  if (data.bases.length === 0) {
    return (
      <Typography variant="body" color="secondary">
        Nenhuma base encontrada para este participante.
      </Typography>
    );
  }

  return (
    <Grid container spacing={12} className="mt-4 w-full">
      {data.bases.map((base) => (
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
