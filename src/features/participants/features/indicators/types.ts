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
  totalScore: number;
  riskLevel: FrailtyClassification;
  domains: IVCF_DomainScores;
}

/** Assessment with date attached (used when flattened from Daily_Assessment) */
export interface IVCF_AssessmentWithDate extends IVCF_Assessment {
  date: string;
}

export interface Daily_Assessment {
  date: string;
  hasMultipleAssessments: boolean;
  assessments: IVCF_Assessment[];
}

export interface ParticipantEvolutionData {
  participantId: string;
  participantName: string;
  dailyAssessments: Daily_Assessment[];
}
