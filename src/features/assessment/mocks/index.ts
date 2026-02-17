import { participantsMock } from "@/features/participants/mocks";
import type { Assessment, AssessmentResponse, FrailtyClassification } from "../types";

function getClassification(score: number): FrailtyClassification {
  if (score >= 15) return "Frágil";
  if (score >= 7) return "Pré-frágil";
  return "Robusto";
}

export const assessmentsMock: AssessmentResponse[] = participantsMock.map(
  (participant, index) => {
    const baseScore = [3, 8, 16, 5, 12, 18, 9, 2, 14, 20][index];
    const classification = getClassification(baseScore);

    return {
      id: `assessment-${index + 1}`,
      totalScore: baseScore,
      classification,
      date: new Date(2026, 1, index + 1).toISOString(),
      participantId: participant.id,
      participantName: participant.fullName,
      questionnaireId: "questionnaire-mock-id",
      createdAt: new Date(2026, 1, index + 1).toISOString(),
      updatedAt: new Date(2026, 1, index + 1).toISOString(),
      answers: [
        {
          id: `answer-${index + 1}-1`,
          questionnaireResponseId: `assessment-${index + 1}`,
          questionId: "question-1",
          selectedOptionId: "option-1",
          valueText: null,
          question: {
            id: "question-1",
            statement: "Qual é a sua idade?",
            order: 1,
            type: "MULTIPLE_CHOICE",
            required: true,
            groupId: null,
            subGroupId: null,
          },
          selectedOption: {
            id: "option-1",
            label: "75 a 84 anos",
            score: 1,
            order: 1,
            questionId: "question-1",
          },
        },
        {
          id: `answer-${index + 1}-2`,
          questionnaireResponseId: `assessment-${index + 1}`,
          questionId: "question-2",
          selectedOptionId: "option-2",
          valueText: null,
          question: {
            id: "question-2",
            statement:
              "Você tem dificuldade para caminhar capaz de impedir a realização de alguma atividade do cotidiano?",
            order: 2,
            type: "MULTIPLE_CHOICE",
            required: true,
            groupId: null,
            subGroupId: null,
          },
          selectedOption: {
            id: "option-2",
            label: index % 2 === 0 ? "Não" : "Sim",
            score: index % 2 === 0 ? 0 : 2,
            order: 1,
            questionId: "question-2",
          },
        },
      ],
    };
  }
);

const scores = [3, 8, 16, 5, 12, 18, 9, 2, 14, 20];

export const assessmentsListMock: Assessment[] = participantsMock.map(
  (participant, index) => {
    const totalScore = scores[index];
    const classification = getClassification(totalScore);

    return {
      id: `assessment-${index + 1}`,
      date: new Date(2026, 1, index + 1).toISOString(),
      totalScore,
      classification,
      participantId: participant.id,
      participantName: participant.fullName,
      participantCpf: participant.cpf,
    };
  }
);
