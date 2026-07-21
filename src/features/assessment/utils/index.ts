import type { FrailtyClassification } from "../types";

export const classificationStyles: Record<
  FrailtyClassification,
  { bg: string; border: string; text: string }
> = {
  Frágil: {
    bg: "bg-red-100",
    border: "border-red-500",
    text: "text-red-700",
  },
  "Pré-frágil": {
    bg: "bg-yellow-100",
    border: "border-yellow-500",
    text: "text-yellow-700",
  },
  "Em Risco de Fragilização": {
    bg: "bg-yellow-100",
    border: "border-yellow-500",
    text: "text-yellow-700",
  },
  Robusto: {
    bg: "bg-green-100",
    border: "border-green-500",
    text: "text-green-700",
  },
};

type LooseFrailtyClassification = FrailtyClassification | "Pré-Fragil";

export function getStylesByClassification(
  classification: LooseFrailtyClassification,
) {
  const normalizedClassification: FrailtyClassification =
    classification === "Pré-Fragil" ? "Pré-frágil" : classification;

  return (
    classificationStyles[normalizedClassification] ?? {
      bg: "bg-gray-100",
      border: "border-gray-500",
      text: "text-gray-700",
    }
  );
}
