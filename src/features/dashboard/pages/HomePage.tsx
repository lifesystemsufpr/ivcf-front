// dashboard/pages/HomePage.tsx
import { Typography } from "@/core/components/ui/Typography";
import { FilterToolbar } from "../components/FilterToolbar";
import { SummaryStats } from "../components/SummaryStats";
import { DomainHeatmap } from "../components/DomainHeatmap";
import { RiskPyramid } from "../components/RiskPyramid";
import { FragilityTrend } from "../components/FragilityTrend";
import { useFragilityData } from "../hooks/useFragilityData";
import { RiskAmountBar } from "../components/RiskAmountBar";

export default function HomePage() {
  const {
    summary,
    charts,
    loading,
    error,
    filters,
    setFilter,
    stratification,
    setStratification,
    trendBySex,
    setTrendBySex,
    metadata,
  } = useFragilityData();

  if (loading && !summary) {
    return <div className="p-10 text-center">Iniciando Dashboard...</div>;
  }
  if (error)
    return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!summary || !charts) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Typography variant="h1">Módulo clínico-analítico IVCF-20</Typography>
        <Typography variant="small">
          Estratificação populacional de fragilidade para priorização de
          cuidado.
        </Typography>
      </div>

      <FilterToolbar
        filters={filters}
        setFilter={setFilter}
        stratification={stratification}
        setStratification={setStratification}
        trendBySex={trendBySex}
        setTrendBySex={setTrendBySex}
        ageBounds={metadata.ageBounds}
      />

      <SummaryStats summary={summary} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RiskAmountBar data={charts.riskBar} />
        <RiskPyramid data={charts.riskPyramid} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DomainHeatmap data={charts.heatmap} stratification={stratification} />
        <FragilityTrend data={charts.trend} bySex={trendBySex} />
      </div>
    </div>
  );
}
