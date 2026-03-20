import type { RiskPyramidProps } from "../components/RiskPyramid";

export function normalizeToPercentage(data: RiskPyramidProps["data"]) {
  return data.map((item) => {
    const total = item.Robusto + item["Pré-frágil"] + item.Frágil;

    if (total === 0) {
      return {
        ...item,
        Robusto: 0,
        "Pré-frágil": 0,
        Frágil: 0,
      };
    }

    return {
      group: item.group,
      Robusto: (item.Robusto / total) * 100,
      "Pré-frágil": (item["Pré-frágil"] / total) * 100,
      Frágil: (item.Frágil / total) * 100,
    };
  });
}
