import { DOMAIN_DEFINITIONS } from "@/core/consts/ivcf.consts";
import type {
  AggregationDimension,
  FragilityDashboardResponse,
  FragilityFilters,
} from "../types";
import { buildDrilldown } from "../utils/builder";

function classifyRisk(score: number) {
  if (score < 7) return "Robusto";
  if (score < 15) return "Pré-frágil";
  return "Frágil";
}

export const getMockedData = (
  filters: FragilityFilters,
  stratification: AggregationDimension,
): FragilityDashboardResponse => {
  const TOTAL = 100;

  // --------------------------
  // 1️⃣ GERAR COORTE SINTÉTICA
  // --------------------------

  const patients = Array.from({ length: TOTAL }).map((_, i) => {
    const age = 60 + Math.floor(Math.random() * 38); // 60–98

    // Score correlacionado com idade + ruído
    const baseScore = (age - 60) * 0.6;
    const noise = Math.random() * 6;
    const score = Math.min(40, Number((baseScore + noise).toFixed(1)));

    const sex = Math.random() > 0.5 ? "M" : "F";
    const riskLevel = classifyRisk(score);

    return {
      id: i,
      age,
      sex,
      score,
      riskLevel,
      date: `2025-01-${String((i % 28) + 1).padStart(2, "0")}`,
    };
  });

  // Aplicar filtro por sexo
  const filtered =
    filters.sex && filters.sex !== "all"
      ? patients.filter((p) => p.sex === filters.sex)
      : patients;

  const total = filtered.length;

  // --------------------------
  // 2️⃣ SUMMARY
  // --------------------------

  const avgScore = filtered.reduce((acc, p) => acc + p.score, 0) / total;

  const avgAge = filtered.reduce((acc, p) => acc + p.age, 0) / total;

  const ageGroups = {
    "60-74": 0,
    "75-84": 0,
    "85+": 0,
  };

  filtered.forEach((p) => {
    if (p.age <= 74) ageGroups["60-74"]++;
    else if (p.age <= 84) ageGroups["75-84"]++;
    else ageGroups["85+"]++;
  });

  // --------------------------
  // 3️⃣ RISK BAR
  // --------------------------

  const riskCounts = {
    Robusto: 0,
    "Pré-frágil": 0,
    Frágil: 0,
  };

  filtered.forEach((p) => {
    riskCounts[p.riskLevel as keyof typeof riskCounts]++;
  });

  // --------------------------
  // 4️⃣ SCATTER
  // --------------------------

  const scatter = ["M", "F"].map((sex) => ({
    id: sex === "M" ? "Masculino" : "Feminino",
    color: sex === "M" ? "#38bdf8" : "#a855f7",
    data: filtered
      .filter((p) => p.sex === sex)
      .map((p) => ({
        x: p.age,
        y: p.score,
        size: 8 + p.score * 0.3,
        age: p.age,
        sex: p.sex,
        riskLevel: p.riskLevel,
        date: p.date,
      })),
  }));

  // --------------------------
  // 5️⃣ HEATMAP (média por domínio)
  // --------------------------

  const groups =
    stratification === "ageGroup"
      ? ["60-74", "75-84", "85+"]
      : ["Masculino", "Feminino"];

  const heatmap = DOMAIN_DEFINITIONS.map((domain) => ({
    id: domain.label,
    data: groups.map((group) => {
      const groupPatients =
        stratification === "ageGroup"
          ? filtered.filter((p) =>
              group === "60-74"
                ? p.age <= 74
                : group === "75-84"
                  ? p.age <= 84 && p.age > 74
                  : p.age > 84,
            )
          : filtered.filter((p) =>
              group === "Masculino" ? p.sex === "M" : p.sex === "F",
            );

      const avg =
        groupPatients.reduce((acc, p) => acc + p.score, 0) /
        (groupPatients.length || 1);

      const domainScore = Math.min(
        domain.max,
        Number((avg * (domain.max / 40)).toFixed(2)),
      );

      return { x: group, y: domainScore };
    }),
  }));

  // --------------------------
  // 6️⃣ RISK PYRAMID
  // --------------------------

  const riskPyramid =
    stratification === "ageGroup"
      ? Object.keys(ageGroups).map((group) => {
          const groupPatients = filtered.filter((p) =>
            group === "60-74"
              ? p.age <= 74
              : group === "75-84"
                ? p.age <= 84 && p.age > 74
                : p.age > 84,
          );

          return {
            group,
            Robusto: groupPatients.filter((p) => p.riskLevel === "Robusto")
              .length,
            "Pré-frágil": groupPatients.filter(
              (p) => p.riskLevel === "Pré-frágil",
            ).length,
            Frágil: groupPatients.filter((p) => p.riskLevel === "Frágil")
              .length,
          };
        })
      : ["Masculino", "Feminino"].map((group) => {
          const groupPatients = filtered.filter((p) =>
            group === "Masculino" ? p.sex === "M" : p.sex === "F",
          );

          return {
            group,
            Robusto: groupPatients.filter((p) => p.riskLevel === "Robusto")
              .length,
            "Pré-frágil": groupPatients.filter(
              (p) => p.riskLevel === "Pré-frágil",
            ).length,
            Frágil: groupPatients.filter((p) => p.riskLevel === "Frágil")
              .length,
          };
        });

  // --------------------------
  // 7️⃣ TREND (evolução mensal média)
  // --------------------------

  const trend = [
    { x: "2025-01-01", y: Number((avgScore - 1.2).toFixed(1)) },
    { x: "2025-02-01", y: Number((avgScore - 0.5).toFixed(1)) },
    { x: "2025-03-01", y: Number(avgScore.toFixed(1)) },
  ];

  return {
    summary: {
      total,
      avgScore: Number(avgScore.toFixed(1)),
      avgAge: Number(avgAge.toFixed(1)),
      topAgeGroups: Object.entries(ageGroups).map(([label, value]) => ({
        label,
        value,
      })),
    },
    charts: {
      riskBar: [
        {
          category: "Robusto",
          count: riskCounts.Robusto,
          percentage: Number(((riskCounts.Robusto / total) * 100).toFixed(1)),
          color: "#22c55e",
        },
        {
          category: "Pré-frágil",
          count: riskCounts["Pré-frágil"],
          percentage: Number(
            ((riskCounts["Pré-frágil"] / total) * 100).toFixed(1),
          ),
          color: "#fbbf24",
        },
        {
          category: "Frágil",
          count: riskCounts.Frágil,
          percentage: Number(((riskCounts.Frágil / total) * 100).toFixed(1)),
          color: "#f87171",
        },
      ],
      heatmap,
      riskPyramid,
      scatter,
      trend: [{ id: "Cohort", data: trend }],
      domainDrilldown: buildDrilldown(total),
    },
    metadata: {
      ageBounds: { min: 60, max: 98 },
    },
  };
};
