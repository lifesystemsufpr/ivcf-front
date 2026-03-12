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

export const DOMAIN_DEFINITIONS: {
  key: DomainKey;
  label: string;
  max: number;
}[] = [
  { key: "age", label: "Idade", max: 3 },
  { key: "selfPerception", label: "Autopercepção", max: 1 },
  { key: "functionalCapacity", label: "Capacidade Funcional", max: 10 },
  { key: "cognition", label: "Cognição", max: 4 },
  { key: "mood", label: "Humor", max: 4 },
  { key: "mobility", label: "Mobilidade", max: 10 },
  { key: "communication", label: "Comunicação", max: 4 },
  { key: "comorbidities", label: "Comorbidades", max: 4 },
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
  Todos: {
    bg: "bg-gray-100",
    border: "border-gray-500",
    text: "text-gray-700",
  },
};
