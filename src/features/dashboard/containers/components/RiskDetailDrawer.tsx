import { AlertCircle, Users } from "lucide-react";
import { Button, Drawer, Typography } from "@/core/components/ui";
import { riskColorMap } from "../../utils/transforms";
import { RiskDetailList } from "./RiskDetailList";
import { RiskDetailPagination } from "./RiskDetailPagination";
import type { DetailChartResponse } from "../../types";
import type { FrailtyClassification, MetaPagination } from "@/core/types";

type RiskDetailDrawerProps = {
  open: boolean;
  classification: FrailtyClassification | null;
  fallbackCount: number;
  items: DetailChartResponse[];
  meta?: MetaPagination;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onClose: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSelectParticipant: (participantId: string) => void;
};

function RiskDetailSkeleton() {
  return (
    <ul className="flex flex-col gap-2" aria-hidden>
      {Array.from({ length: 6 }).map((_, index) => (
        <li
          key={index}
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3"
        >
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function RiskDetailEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
      <Users className="h-8 w-8 text-muted-foreground" aria-hidden />
      <Typography variant="small">
        Nenhum paciente encontrado para esta classificação com os filtros
        atuais.
      </Typography>
    </div>
  );
}

function RiskDetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
      <Typography variant="small">
        Não foi possível carregar os pacientes. Tente novamente.
      </Typography>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}

export function RiskDetailDrawer({
  open,
  classification,
  fallbackCount,
  items,
  meta,
  isLoading,
  isFetching,
  isError,
  onRetry,
  onClose,
  onPageChange,
  onPageSizeChange,
  onSelectParticipant,
}: RiskDetailDrawerProps) {
  const total = meta?.total ?? fallbackCount;
  const dotColor = classification ? riskColorMap[classification] : undefined;

  const showSkeleton = isLoading && items.length === 0;
  const showEmpty = !isLoading && !isError && items.length === 0;
  const showList = !isError && items.length > 0;
  const showPagination = showList && !!meta && meta.total > 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      size="lg"
      title={
        classification ? `Classificação: ${classification}` : "Detalhamento"
      }
      description={
        classification
          ? `${total} paciente${total === 1 ? "" : "s"} nesta classificação`
          : undefined
      }
      footer={
        showPagination ? (
          <RiskDetailPagination
            meta={meta}
            disabled={isFetching}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        ) : undefined
      }
    >
      {dotColor && (
        <div className="mb-4 flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: dotColor }}
            aria-hidden
          />
          <Typography variant="caption" className="uppercase tracking-wide">
            Clique em um paciente para abrir o perfil em nova aba
          </Typography>
        </div>
      )}

      {isError ? (
        <RiskDetailError onRetry={onRetry} />
      ) : showSkeleton ? (
        <RiskDetailSkeleton />
      ) : showEmpty ? (
        <RiskDetailEmpty />
      ) : showList ? (
        <RiskDetailList
          items={items}
          isFetching={isFetching}
          onSelect={onSelectParticipant}
        />
      ) : null}
    </Drawer>
  );
}
