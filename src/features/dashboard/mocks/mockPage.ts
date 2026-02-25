import { DOMAIN_DEFINITIONS } from "@/core/consts/ivcf.consts";
import type {
  AggregationDimension,
  FragilityDashboardResponse,
  FragilityFilters,
} from "../types";

export const getMockedData = (
  filters: FragilityFilters,
  stratification: AggregationDimension,
): FragilityDashboardResponse => {
  const isByAge = stratification === "ageGroup";

  const groups = isByAge
    ? ["<65", "65-74", "75-84", "85+"]
    : ["Masculino", "Feminino"];
  const total = filters.sex === "all" ? 142 : 71;
  const counts = {
    Robusto: Math.floor(total * 0.3),
    "Pré-frágil": Math.floor(total * 0.45),
    Frágil: Math.floor(total * 0.25),
  };

  return {
    summary: {
      total,
      avgScore: 14.8,
      avgAge: 76.4,
      topAgeGroups: [{ label: "75-84", value: 52 }],
    },

    charts: {
      riskBar: [
        {
          category: "Robusto",
          count: counts.Robusto,
          percentage: 30,
          color: "#22c55e",
        },
        {
          category: "Pré-frágil",
          count: counts["Pré-frágil"],
          percentage: 45,
          color: "#fbbf24",
        },
        {
          category: "Frágil",
          count: counts.Frágil,
          percentage: 25,
          color: "#f87171",
        },
      ],

      heatmap: DOMAIN_DEFINITIONS.map((domain) => ({
        id: domain.label,
        data: groups.map((group) => {
          const baseValue = domain.max * 0.3;

          const modifier = isByAge
            ? groups.indexOf(group) * 0.15 * domain.max
            : group === "Feminino"
              ? 0.1 * domain.max
              : 0;

          return {
            x: group,
            y: Number(Math.min(domain.max, baseValue + modifier).toFixed(2)),
          };
        }),
      })),

      riskPyramid: isByAge
        ? [
            { group: "<65", Robusto: 85, "Pre-Fragil": 12, Fragil: 3 },
            { group: "65-74", Robusto: 50, "Pre-Fragil": 35, Fragil: 15 },
            { group: "75-84", Robusto: 25, "Pre-Fragil": 45, Fragil: 30 },
            { group: "85+", Robusto: 10, "Pre-Fragil": 30, Fragil: 60 },
          ]
        : [
            { group: "Masculino", Robusto: 42, "Pre-Fragil": 38, Fragil: 20 },
            { group: "Feminino", Robusto: 32, "Pre-Fragil": 42, Fragil: 26 },
          ],

      scatter: [
        {
          id: "Masculino",
          color: "#38bdf8",
          data:
            filters.sex === "F"
              ? []
              : [
                  {
                    x: 2,
                    y: 8,
                    size: 12,
                    age: 68,
                    sex: "M",
                    riskLevel: "Robusto",
                    date: "2025-01-10",
                  },
                  {
                    x: 4,
                    y: 15,
                    size: 14,
                    age: 72,
                    sex: "M",
                    riskLevel: "Pre-Fragil",
                    date: "2025-01-15",
                  },
                ],
        },
        {
          id: "Feminino",
          color: "#a855f7",
          data:
            filters.sex === "M"
              ? []
              : [
                  {
                    x: 3,
                    y: 12,
                    size: 13,
                    age: 70,
                    sex: "F",
                    riskLevel: "Pre-Fragil",
                    date: "2025-01-12",
                  },
                  {
                    x: 6,
                    y: 24,
                    size: 18,
                    age: 85,
                    sex: "F",
                    riskLevel: "Fragil",
                    date: "2025-01-20",
                  },
                ],
        },
      ],

      trend: [
        {
          id: "Cohort",
          data: [
            { x: "2025-01-01", y: 13.2 },
            { x: "2025-01-15", y: 14.5 },
            { x: "2025-02-01", y: 14.8 },
          ],
        },
      ],
    },

    metadata: {
      ageBounds: { min: 60, max: 98 },
    },
  };
};
