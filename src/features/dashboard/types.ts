export type Sex = "M" | "F";

export type RiskLevel = "Robusto" | "Pre-Fragil" | "Fragil";

export type PatientFragility = {
  patientId: string;
  date: string; // ISO date
  age: number;
  sex: Sex;
  totalScore: number;
  riskLevel: RiskLevel;
  domains: {
    idade: number;
    autopercepcao: number;
    avds: number;
    cognicao: number;
    humor: number;
    mobilidade: number;
    comunicacao: number;
    comorbidades: number;
  };
  chronicDiseasesCount: number;
};

export type DomainKey = keyof PatientFragility["domains"];

export type FragilityFilters = {
  sex?: Sex | "all";
  ageRange?: [number, number];
  period?: { start?: string; end?: string };
};

export type AggregationDimension = "sex" | "ageGroup";
