export type FrailtyClassification =
  | "Robusto"
  | "Pré-frágil"
  | "Frágil"
  | "Todos";

export const frailtyClassificationList: FrailtyClassification[] = [
  "Robusto",
  "Pré-frágil",
  "Frágil",
  "Todos",
];

export type SystemRole = "HEALTH_PROFESSIONAL" | "PARTICIPANT";
