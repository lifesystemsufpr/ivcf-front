import type {
  QuestionnaireStructure,
  QuestionnaireQuestion,
} from "../types/questionnaire.types";

/**
 * Extrai todas as questões da estrutura do questionário em uma lista flat ordenada.
 */
export function flattenQuestions(
  structure: QuestionnaireStructure,
): QuestionnaireQuestion[] {
  const allQuestions: QuestionnaireQuestion[] = [];

  structure.groups.forEach((group) => {
    // Adiciona questões diretas do grupo
    allQuestions.push(...group.questions);

    // Adiciona questões dos subgrupos
    group.subGroups.forEach((subGroup) => {
      allQuestions.push(...subGroup.questions);
    });
  });

  // Ordena por order
  return allQuestions.sort((a, b) => a.order - b.order);
}

/**
 * Encontra uma questão específica por order number.
 */
export function findQuestionByOrder(
  questions: QuestionnaireQuestion[],
  order: number,
): QuestionnaireQuestion | undefined {
  return questions.find((q) => q.order === order);
}
