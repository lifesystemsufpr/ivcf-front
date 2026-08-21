import { useMemo, useState } from "react";
import { clientRoutes } from "@/core/configs/client.routes";
import { RiskAmountBar } from "../components/RiskAmountBar";
import { useDashboard } from "../contexts/DashboardContext";
import { useDetailChart } from "../hooks/useDetailChart";
import type { DetailChartParams } from "../services/fragilityService";
import type { RiskBarDatum } from "../types";
import { RiskDetailDrawer } from "./components/RiskDetailDrawer";

const DEFAULT_PAGE_SIZE = 8;
const DEFAULT_ORDER_BY = "date";
const DEFAULT_ORDER_DIRECTION = "desc" as const;

// O endpoint de detalhamento exige start/end como ISO 8601 válidos. Quando não
// há filtro de período ativo, usamos um intervalo amplo para trazer todo o histórico.
const DEFAULT_START = "1900-01-01";
const DEFAULT_END = "2100-12-31";

type RiskAmountBarContainerProps = {
  data: RiskBarDatum[];
  total: number;
  isCompact?: boolean;
};

/**
 * Orquestra o gráfico de distribuição de risco e o detalhamento por barra.
 *
 * Ao clicar em uma barra (nível de vulnerabilidade), abre o Drawer listando
 * de forma paginada os pacientes representados por aquela classificação,
 * respeitando os filtros ativos do dashboard. Cada paciente abre seu perfil
 * em uma nova aba.
 */
export function RiskAmountBarContainer({
  data,
  total,
  isCompact,
}: RiskAmountBarContainerProps) {
  const { filters } = useDashboard();

  const [selected, setSelected] = useState<RiskBarDatum | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const isOpen = selected !== null;

  const params = useMemo<DetailChartParams>(
    () => ({
      classification: selected?.category ?? "",
      page,
      pageSize,
      orderBy: DEFAULT_ORDER_BY,
      orderDirection: DEFAULT_ORDER_DIRECTION,
      sex: filters.sex ?? "all",
      ageMin: filters.ageRange?.[0],
      ageMax: filters.ageRange?.[1],
      start: filters.period?.start || DEFAULT_START,
      end: filters.period?.end || DEFAULT_END,
    }),
    [selected, page, pageSize, filters],
  );

  const {
    data: detail,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDetailChart(params);

  const handleBarClick = (datum: RiskBarDatum) => {
    setPage(1);
    setSelected(datum);
  };

  const handleClose = () => setSelected(null);

  const handlePageSizeChange = (nextPageSize: number) => {
    setPage(1);
    setPageSize(nextPageSize);
  };

  const handleSelectParticipant = (participantId: string) => {
    window.open(
      clientRoutes.PARTICIPANTS.DETAILS({ id: participantId }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      <RiskAmountBar
        data={data}
        total={total}
        isCompact={isCompact}
        onBarClick={handleBarClick}
      />

      <RiskDetailDrawer
        open={isOpen}
        classification={selected?.category ?? null}
        fallbackCount={selected?.count ?? 0}
        items={detail?.data ?? []}
        meta={detail?.meta}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={refetch}
        onClose={handleClose}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onSelectParticipant={handleSelectParticipant}
      />
    </>
  );
}
