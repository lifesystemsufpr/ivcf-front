import type { FrailtyClassification } from "@/core/types";
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
  riskLevel: FrailtyClassification;
  domains: IVCF_DomainScores;
  rawResponses: Record<string, any>;
}

export interface ParticipantEvolutionData {
  participantId: string;
  participantName: string;
  assessments: IVCF_Assessment[];
}
