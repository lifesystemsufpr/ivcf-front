import type { RiskLevel } from "@/features/dashboard/types";

export interface IVCF_DomainScores {
  age: number;
  selfPerception: number;
  functionalCapacity: number;
  cognition: number;
  mood: number;
  mobility: number;
  communication: number;
  comorbidities: number;
}

export interface IVCF_Assessment {
  id: string;
  date: string;
  totalScore: number;
  riskLevel: RiskLevel;
  domains: IVCF_DomainScores;
  rawResponses: Record<string, any>;
}

export interface PatientEvolutionData {
  patientId: string;
  patientName: string;
  assessments: IVCF_Assessment[];
}
