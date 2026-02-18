import { participantsMock } from "@/features/participants/mocks";
import type {
  Assessment,
  AssessmentResponse,
  Answer,
  FrailtyClassification,
  SelectedOption,
} from "../types";
import { ivcfQuestions } from "../features/create-flow/questions";

/**
 * Helper: Classificação baseada no score oficial do IVCF-20
 */
function getClassification(score: number): FrailtyClassification {
  if (score >= 15) return "Frágil";
  if (score >= 7) return "Pré-frágil";
  return "Robusto";
}

const scores = [3, 8, 16, 5, 12, 18, 9, 2, 14, 20];

export const assessmentsListMock: Assessment[] = participantsMock.map(
  (participant, index) => {
    const totalScore = scores[index] || 0;
    return {
      id: `assessment-${index + 1}`,
      date: new Date(2026, 1, index + 1).toISOString(),
      totalScore,
      classification: getClassification(totalScore),
      participantId: participant.id,
      participantName: participant.fullName,
      participantCpf: participant.cpf,
    };
  },
);

/**
 * Helper: Gera um array de 20 respostas simuladas que totalizam um score específico.
 * Nota: Esta lógica simplifica a distribuição de pontos para o mock.
 */
function generateMockAnswers(
  assessmentId: string,
  targetScore: number,
): Answer[] {
  let currentPoints = 0;

  return ivcfQuestions.map((q) => {
    const selectedOptionIndex =
      targetScore > currentPoints && q.options.length > 1 ? 1 : 0;
    const opt = q.options[selectedOptionIndex];
    currentPoints += opt.score;

    const selectedOption: SelectedOption = {
      id: opt.id,
      label: opt.label,
      score: opt.score,
      order: selectedOptionIndex + 1,
      questionId: q.id,
    };

    return {
      id: `ans-${assessmentId}-${q.id}`,
      questionnaireResponseId: assessmentId,
      questionId: q.id,
      selectedOptionId: opt.id,
      valueText: null,
      selectedOption,
      question: {
        id: q.id,
        statement: q.statement,
        order: q.order,
        type: "MULTIPLE_CHOICE",
        required: q.required,
        groupId: q.groupId ?? null,
        subGroupId: q.subGroupId ?? null,
      },
    };
  });
}

/**
 * 2. Mock Detalhado (Para a tela de resultado/detalhes)
 * Este objeto contém o histórico completo com todas as 20 respostas de cada avaliação.
 */
export const detailedAssessmentsMock: AssessmentResponse[] =
  assessmentsListMock.map((base) => ({
    id: base.id,
    totalScore: base.totalScore,
    classification: base.classification,
    date: base.date,
    participantId: base.participantId,
    participantName: base.participantName,
    questionnaireId: "ivcf-20-v1",
    createdAt: base.date,
    updatedAt: base.date,
    answers: generateMockAnswers(base.id, base.totalScore),
  }));
