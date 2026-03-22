// dashboard/pages/HomePage.tsx
import { Typography } from "@/core/components/ui/Typography";
import { FilterToolbar } from "../components/FilterToolbar";
import { SummaryStats } from "../components/SummaryStats";
import { DomainHeatmap } from "../components/DomainHeatmap";
import { RiskPyramid } from "../components/RiskPyramid";
import { RiskAmountBar } from "../components/RiskAmountBar";
import { ComorbidityScatter } from "../components/ComorbidityScatter";
import { DomainDrilldownBars } from "../components/DomainDrilldownBars";
import { useDashboard } from "../contexts/DashboardContext";
import { useScreenInfo } from "@/core/hooks/useScreenInfo";

export default function HomePage() {
  const { isMobile, isShortHeight } = useScreenInfo();
  const {
    data,
    loading,
    error,
    filters,
    setFilter,
    stratification,
    setStratification,
    trendBySex,
    setTrendBySex,
  } = useDashboard();
  const isCompact = isMobile || isShortHeight;

  const { charts, metadata, summary } = data || {};

  if (loading && !summary) {
    return <div className="p-10 text-center">Iniciando Dashboard...</div>;
  }
  if (error)
    return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!summary || !charts) return null;

  return (
    <div className={isCompact ? "space-y-4" : "space-y-6"}>
      <div className="flex flex-col gap-2">
        <Typography variant="h1" className={isCompact ? "text-3xl" : ""}>
          Módulo clínico-analítico IVCF-20
        </Typography>
        <Typography variant="small">
          Estratificação populacional de fragilidade para priorização de
          cuidado.
        </Typography>
      </div>

      <div
        className={`sticky z-30 bg-background/95 backdrop-blur-sm py-2 -mx-2 px-2 ${
          isCompact ? "top-15" : "top-15"
        }`}
      >
        <FilterToolbar
          filters={filters}
          setFilter={setFilter}
          stratification={stratification}
          setStratification={setStratification}
          trendBySex={trendBySex}
          setTrendBySex={setTrendBySex}
          ageBounds={metadata?.ageBounds ?? { min: 0, max: 100 }}
        />
      </div>

      <SummaryStats summary={summary} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RiskAmountBar
          data={charts.riskBar}
          total={summary.total}
          isCompact={isCompact}
        />
        <RiskPyramid data={charts.riskPyramid} isCompact={isCompact} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DomainHeatmap data={charts.heatmap} stratification={stratification} />
        <ComorbidityScatter data={charts.scatter} isCompact={isCompact} />
      </div>

      <div className="grid gap-6 xl:grid-cols-1">
        <DomainDrilldownBars
          fullData={charts.domainDrilldown}
          isCompact={isCompact}
        />
      </div>
    </div>
  );
}
