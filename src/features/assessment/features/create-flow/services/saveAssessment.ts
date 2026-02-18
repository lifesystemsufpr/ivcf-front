import type { AnswerMap } from "../context/CreateAssessmentContext";
import type { FrailtyClassification } from "@/features/assessment/types";

export interface SaveAssessmentInput {
  participantId: string;
  answers: AnswerMap;
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
    const parsed: Record<string, SavedAssessment> = stored ? JSON.parse(stored) : {};
    parsed[result.id] = result;
    sessionStorage.setItem(RESULTS_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error("Failed to persist assessment result", error);
  }
}

export async function saveAssessment({ participantId, answers }: SaveAssessmentInput) {
  const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0);
  const id = crypto.randomUUID ? crypto.randomUUID() : `assessment-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const classification = computeClassification(totalScore);

  const payload: SavedAssessment = {
    id,
    participantId,
    totalScore,
    classification,
    createdAt,
    answers,
  };

  // Simula latência de rede mínima para manter a experiência realista.
  await new Promise((resolve) => setTimeout(resolve, 400));
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
