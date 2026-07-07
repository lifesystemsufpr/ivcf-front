import type { FrailtyClassification } from "@/features/assessment/types";

export interface QuestionnaireOption {
  id: string;
  label: string;
  score: number;
  order: number;
  questionId: string;
}

export interface QuestionnaireQuestion {
  id: string;
  statement: string;
  order: number;
  type: "MULTIPLE_CHOICE" | "TEXT" | "NUMBER";
  required: boolean;
  groupId: string | null;
  subGroupId: string | null;
  options: QuestionnaireOption[];
}

export interface QuestionnaireSubGroup {
  id: string;
  title: string;
  order: number;
  description: string | null;
  groupId: string;
  questions: QuestionnaireQuestion[];
}

export interface QuestionnaireGroup {
  id: string;
  title: string;
  order: number;
  description: string | null;
  questionnaireId: string;
  questions: QuestionnaireQuestion[];
  subGroups: QuestionnaireSubGroup[];
}

export interface QuestionnaireStructure {
  id: string;
  title: string;
  slug: string;
  description: string;
  active: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
  groups: QuestionnaireGroup[];
}

export interface SubmitQuestionnaireAnswer {
  questionId: string;
  selectedOptionId: string;
  valueText?: string | null;
}

export interface SubmitQuestionnaireRequest {
  participantId: string;
  healthProfessionalId: string;
  questionnaireId: string;
  healthcareUnitId?: string;
  answers: SubmitQuestionnaireAnswer[];
}

export interface SubmitQuestionnaireResponse {
  id: string;
  totalScore: number;
  classification: FrailtyClassification;
  date: string;
  participantId: string;
  questionnaireId: string;
  healthProfessionalId: string;
  createdAt: string;
  updatedAt: string;
}
