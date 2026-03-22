import type { FrailtyClassification } from "@/core/types";

export type Sex = "M" | "F";

export interface ResponseCounts {
  sim: number;
  nao: number;
}

export interface DrilldownNode {
  id: string;
  label: string;
  counts: ResponseCounts;
  children?: DrilldownNode[];
}

export interface DomainDrilldownData {
  domains: DrilldownNode[];
}

export interface RiskBarDatum {
  category: FrailtyClassification;
  count: number;
  percentage?: number;
}

export interface HeatMapSerie {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

export interface RiskPyramidDatum {
  group: string;
  Robusto: number;
  "Pré-frágil": number;
  Frágil: number;
}
export interface ScatterSerieData {
  x: number;
  y: number;
  size: number;
  age: number;
  sex: string;
  riskLevel: string;
  date: string;
}
export interface ScatterSerie {
  id: string;
  color: string;
  data: ScatterSerieData[];
}

export interface SummaryStats {
  total: number;
  avgScore: number;
  avgAge: number;
  topAgeGroups: Array<{ label: string; value: number }>;
}

// O contrato final do BFF agora é 100% tipado
export interface FragilityDashboardResponse {
  summary: SummaryStats;
  charts: {
    riskBar: RiskBarDatum[];
    heatmap: HeatMapSerie[];
    riskPyramid: RiskPyramidDatum[];
    scatter: ScatterSerie[];
    trend: any[];
    domainDrilldown: DrilldownNode[];
  };
  metadata: {
    ageBounds: { min: number; max: number };
  };
}

export type AggregationDimension = "sex" | "ageGroup";

export type FragilityFilters = {
  sex?: Sex | "all";
  ageRange?: [number, number];
  period?: { start?: string; end?: string };
};
