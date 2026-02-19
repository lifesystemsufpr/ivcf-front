import { Typography } from "@/core/components/ui/Typography";
import { FilterToolbar } from "../components/FilterToolbar";
import { SummaryStats } from "../components/SummaryStats";
import { DomainHeatmap } from "../components/DomainHeatmap";
import { RiskPyramid } from "../components/RiskPyramid";
import { ComorbidityScatter } from "../components/ComorbidityScatter";
import { FragilityTrend } from "../components/FragilityTrend";
import { useFragilityData } from "../hooks/useFragilityData";

export default function HomePage() {
  const {
    filteredData,
    filters,
    setFilter,
    stratification,
    setStratification,
    trendBySex,
    setTrendBySex,
    heatmap,
    riskPyramid,
    scatter,
    trend,
    ageBounds,
    cohortSummary,
  } = useFragilityData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Typography variant="h1">Módulo clínico-analítico IVCF-20</Typography>
        <Typography variant="small">
          Estratificação populacional de fragilidade para priorização de
          cuidado, acompanhamento longitudinal e planejamento de intervenção.
        </Typography>
      </div>

      <FilterToolbar
        filters={filters}
        setFilter={setFilter}
        stratification={stratification}
        setStratification={setStratification}
        trendBySex={trendBySex}
        setTrendBySex={setTrendBySex}
        ageBounds={ageBounds}
        filteredData={filteredData}
      />

      <SummaryStats {...cohortSummary} />

      <div className="grid gap-6 xl:grid-cols-2">
        <DomainHeatmap data={heatmap} stratification={stratification} />
        <RiskPyramid data={riskPyramid} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ComorbidityScatter data={scatter} />
        <FragilityTrend data={trend} bySex={trendBySex} />
      </div>
    </div>
  );
}
