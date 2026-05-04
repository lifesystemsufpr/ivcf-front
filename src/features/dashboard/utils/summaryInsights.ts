import type { SummaryStats } from "../types";

type InsightLevel = "low" | "medium" | "high";

type InsightRule = {
  min?: number;
  max?: number;
  message: string;
  level: InsightLevel;
};

type InsightResult = {
  message: string;
  level: InsightLevel;
};

const pickInsight = (value: number, rules: InsightRule[]): InsightResult => {
  const matched = rules.find((rule) => {
    const meetsMin = rule.min === undefined || value >= rule.min;
    const meetsMax = rule.max === undefined || value < rule.max;
    return meetsMin && meetsMax;
  });

  return (
    matched ?? {
      message: "Sem observação para o valor atual.",
      level: "low",
    }
  );
};

export function getSummaryInsights(summary: SummaryStats) {
  const participantInsights = pickInsight(summary.totalParticipants ?? 0, [
    {
      max: 15,
      message:
        "Poucos participantes. Amplie a captação para fortalecer a análise.",
      level: "low",
    },
    {
      min: 15,
      max: 30,
      message:
        "Base em formação. Acompanhe crescimento para ganhar estabilidade.",
      level: "medium",
    },
    {
      min: 30,
      message:
        "Base consolidada para leitura de tendência com maior confiança.",
      level: "high",
    },
  ]);

  const evaluatedInsights = pickInsight(summary.totalEvaluated ?? 0, [
    {
      max: 10,
      message:
        "Cobertura de avaliação baixa. Priorize mais aplicações do protocolo.",
      level: "low",
    },
    {
      min: 10,
      max: 25,
      message:
        "Cobertura moderada. Há sinal, mas ainda com espaço para ampliar.",
      level: "medium",
    },
    {
      min: 25,
      message: "Cobertura robusta de avaliação no período selecionado.",
      level: "high",
    },
  ]);

  const avgScoreInsights = pickInsight(summary.avgScore ?? 0, [
    {
      max: 6,
      message: "Fragilidade média baixa no grupo avaliado.",
      level: "low",
    },
    {
      min: 6,
      max: 15,
      message:
        "Fragilidade média intermediária. Mantenha monitoramento continuo.",
      level: "medium",
    },
    {
      min: 15,
      message:
        "Fragilidade média elevada. Priorize planos de cuidado intensivo.",
      level: "high",
    },
  ]);

  const avgAgeInsights = pickInsight(summary.avgAge ?? 0, [
    {
      max: 70,
      message: "Perfil etário mais jovem dentro da população idosa.",
      level: "low",
    },
    {
      min: 70,
      max: 80,
      message:
        "Envelhecimento moderado, com demanda crescente por acompanhamento.",
      level: "medium",
    },
    {
      min: 80,
      message: "Perfil longevo, com maior risco de complexidade clinica.",
      level: "high",
    },
  ]);

  const topAgeGroupVolume = summary.topAgeGroups?.[0]?.value ?? 0;
  const ageGroupsInsights = pickInsight(topAgeGroupVolume, [
    {
      max: 10,
      message: "Distribuição etária pulverizada entre os grupos.",
      level: "low",
    },
    {
      min: 10,
      max: 25,
      message: "Concentração etária moderada no grupo predominante.",
      level: "medium",
    },
    {
      min: 25,
      message: "Alta concentração etária em poucos grupos prioritários.",
      level: "high",
    },
  ]);

  return {
    participants: participantInsights,
    evaluated: evaluatedInsights,
    avgScore: avgScoreInsights,
    avgAge: avgAgeInsights,
    ageGroups: ageGroupsInsights,
  };
}
