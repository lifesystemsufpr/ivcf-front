import type { FrailtyClassification } from "../types";

export function getColorbyClassification(
  classification: FrailtyClassification,
): string {
  switch (classification) {
    case "Frágil":
      // #FF5252
      return "bg-red-500 text-white";
    case "Pré-frágil":
      // #F5A623
      return "bg-yellow-500 text-white";
    case "Robusto":
      // #4CAF50
      return "bg-green-500 text-white";

    default:
      return "bg-gray-500 text-white";
  }
}
