import { useMemo, useState } from "react";
import { mockFragilityData } from "../mocks/mockPage";
import {
  applyFilters,
  buildComorbidityPoints,
  buildDomainHeatmap,
  buildRiskPyramid,
  buildTrendSeries,
  getAgeGroup,
} from "../utils/transforms";
import type {
  AggregationDimension,
  FragilityFilters,
  PatientFragility,
} from "../types";

export function useFragilityData() {
  const [filters, setFilters] = useState<FragilityFilters>({
    sex: "all",
  });
  const [stratification, setStratification] =
    useState<AggregationDimension>("sex");
  const [trendBySex, setTrendBySex] = useState(true);

  const filteredData = useMemo(
    () => applyFilters(mockFragilityData, filters),
    [filters],
  );

  const heatmap = useMemo(
    () => buildDomainHeatmap(filteredData, stratification),
    [filteredData, stratification],
  );

  const riskPyramid = useMemo(
    () => buildRiskPyramid(filteredData, stratification),
    [filteredData, stratification],
  );

  const scatter = useMemo(
    () => buildComorbidityPoints(filteredData),
    [filteredData],
  );

  const trend = useMemo(
    () => buildTrendSeries(filteredData, trendBySex),
    [filteredData, trendBySex],
  );

  const ageBounds = useMemo(() => {
    const ages = mockFragilityData.map((d) => d.age);
    return { min: Math.min(...ages), max: Math.max(...ages) };
  }, []);

  const cohortSummary = useMemo(() => {
    const total = filteredData.length;
    const robust = filteredData.filter((d) => d.riskLevel === "Robusto").length;
    const pre = filteredData.filter((d) => d.riskLevel === "Pre-Fragil").length;
    const fragile = filteredData.filter((d) => d.riskLevel === "Fragil").length;
    const avgScore =
      total === 0
        ? 0
        : Number(
            (
              filteredData.reduce((acc, d) => acc + d.totalScore, 0) / total
            ).toFixed(1),
          );

    const avgAge =
      total === 0
        ? 0
        : Number(
            (filteredData.reduce((acc, d) => acc + d.age, 0) / total).toFixed(
              1,
            ),
          );

    const topAgeGroups = Object.entries(
      filteredData.reduce<Record<string, number>>((acc, row) => {
        const group = getAgeGroup(row.age);
        acc[group] = (acc[group] || 0) + 1;
        return acc;
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([label, value]) => ({ label, value }));

    return {
      total,
      robust,
      pre,
      fragile,
      avgScore,
      avgAge,
      topAgeGroups,
    };
  }, [filteredData]);

  const setFilter = (
    key: keyof FragilityFilters,
    value: FragilityFilters[keyof FragilityFilters],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    data: mockFragilityData as PatientFragility[],
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
  };
}
