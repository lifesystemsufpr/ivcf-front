import type { RiskPyramidProps } from "../components/RiskPyramid";

export function normalizeToPercentage(data: RiskPyramidProps["data"]) {
  return data.map((item) => {
    const total = item.Robusto + item["Pré-frágil"] + item.Frágil;

    if (total === 0) {
      return {
        ...item,
        Frágil: 0,
        "Pré-frágil": 0,
        Robusto: 0,
      };
    }

    return {
      group: item.group,
      Frágil: (item.Frágil / total) * 100,
      "Pré-frágil": (item["Pré-frágil"] / total) * 100,
      Robusto: (item.Robusto / total) * 100,
    };
  });
}
