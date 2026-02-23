import type { FrailtyClassification } from "../types";

type DomainKey =
  | "age"
  | "selfPerception"
  | "functionalCapacity"
  | "cognition"
  | "mood"
  | "mobility"
  | "communication"
  | "comorbidities";

export const IVCF_DOMAIN_MAX: Record<DomainKey, number> = {
  age: 3,
  selfPerception: 1,
  functionalCapacity: 10,
  cognition: 4,
  mood: 4,
  mobility: 10,
  communication: 4,
  comorbidities: 4,
};

export const DOMAIN_DEFINITIONS: { key: DomainKey; label: string }[] = [
  { key: "age", label: "Idade" },
  { key: "selfPerception", label: "Autopercepção" },
  { key: "functionalCapacity", label: "Capacidade Funcional" },
  { key: "cognition", label: "Cognição" },
  { key: "mood", label: "Humor" },
  { key: "mobility", label: "Mobilidade" },
  { key: "communication", label: "Comunicação" },
  { key: "comorbidities", label: "Comorbidades" },
];

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
  Robusto: {
    bg: "bg-green-100",
    border: "border-green-500",
    text: "text-green-700",
  },
};
