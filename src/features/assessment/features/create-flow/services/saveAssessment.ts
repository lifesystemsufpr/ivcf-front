import type { AnswerMap } from "../context/CreateAssessmentContext";
import type { FrailtyClassification } from "@/features/assessment/types";
import { QuestionnaireService } from "./questionnaire.service";
import type { SubmitQuestionnaireRequest } from "../types/questionnaire.types";

export interface SaveAssessmentInput {
  participantId: string;
  healthProfessionalId: string;
  questionnaireId: string;
  answers: AnswerMap;
  healthcareUnitId?: string;
}

export interface SavedAssessment {
  id: string;
  participantId: string;
  totalScore: number;
  classification: FrailtyClassification;
  createdAt: string;
  answers: AnswerMap;
}

const RESULTS_KEY = "ivcf:results";

function computeClassification(score: number): FrailtyClassification {
  if (score >= 15) return "Frágil";
  if (score >= 7) return "Pré-frágil";
  return "Robusto";
}

function persistResult(result: SavedAssessment) {
  try {
    const stored = sessionStorage.getItem(RESULTS_KEY);
    const parsed: Record<string, SavedAssessment> = stored
      ? JSON.parse(stored)
      : {};
    parsed[result.id] = result;
    sessionStorage.setItem(RESULTS_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error("Failed to persist assessment result", error);
  }
}

export async function saveAssessment({
  participantId,
  healthProfessionalId,
  questionnaireId,
  answers,
  healthcareUnitId,
}: SaveAssessmentInput) {
  // Converte answers para o formato esperado pela API
  const apiAnswers = Object.values(answers).map((answer) => ({
    questionId: answer.questionId,
    selectedOptionId: answer.optionId,
    valueText: null,
  }));

  const requestPayload: SubmitQuestionnaireRequest = {
    participantId,
    healthProfessionalId,
    questionnaireId,
    healthcareUnitId,
    answers: apiAnswers,
  };

  console.log(requestPayload);

  // Envia para a API
  const response =
    await QuestionnaireService.submitQuestionnaireResponse(requestPayload);

  // Cria versão local para cache
  const totalScore = Object.values(answers).reduce(
    (sum, answer) => sum + answer.score,
    0,
  );

  const classification = computeClassification(totalScore);

  const payload: SavedAssessment = {
    id: response.id,
    participantId: response.participantId,
    totalScore: response.totalScore,
    classification: classification,
    createdAt: response.createdAt,
    answers,
  };

  persistResult(payload);

  return payload;
}

export function loadSavedAssessment(id: string): SavedAssessment | null {
  try {
    const stored = sessionStorage.getItem(RESULTS_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Record<string, SavedAssessment>;
    return parsed[id] ?? null;
  } catch (error) {
    console.error("Failed to load assessment", error);
    return null;
  }
}
