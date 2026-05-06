import { useEffect, useMemo } from "react";
import { flattenQuestions } from "../utils/questionnaireHelpers";
import type {
  QuestionnaireQuestion,
  QuestionnaireStructure,
} from "../types/questionnaire.types";
import type { AnswerMap } from "../context/CreateAssessmentContext";

export interface UseQuizLogicParams {
  questionnaireStructure: QuestionnaireStructure | undefined;
  answers: AnswerMap;
  updateAnswer: (params: {
    questionId: string;
    optionId: string;
    score: number;
  }) => void;
}

export function useQuizLogic({
  questionnaireStructure,
  answers,
  updateAnswer,
}: UseQuizLogicParams) {
  const questions = useMemo(() => {
    if (!questionnaireStructure) return [];
    return flattenQuestions(questionnaireStructure);
  }, [questionnaireStructure]);

  const question7 = questions.find((q) => q.order === 7);
  const question8 = questions.find((q) => q.order === 8);
  const question9 = questions.find((q) => q.order === 9);

  const isQuestion7Yes = useMemo(() => {
    if (!question7) return false;

    const optionId = answers[question7.id]?.optionId;
    const option = question7.options.find((o) => o.id === optionId);

    return option?.label.trim().toLowerCase() === "sim";
  }, [answers, question7]);

  const visibleQuestions = useMemo(() => {
    return questions.filter((q) => {
      if ([8, 9].includes(q.order)) {
        return isQuestion7Yes;
      }
      return true;
    });
  }, [questions, isQuestion7Yes]);

  const visibleQuestionIds = useMemo(
    () => new Set(visibleQuestions.map((item) => item.id)),
    [visibleQuestions],
  );

  const visibleAnswers = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(answers).filter(([questionId]) =>
          visibleQuestionIds.has(questionId),
        ),
      ),
    [answers, visibleQuestionIds],
  );

  const answeredCount = Object.keys(visibleAnswers).length;
  const hasAllAnswers =
    visibleQuestions.length > 0 && answeredCount === visibleQuestions.length;

  useEffect(() => {
    if (isQuestion7Yes) return;

    const normalize = (v: string) =>
      v
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const applyNo = (q: QuestionnaireQuestion | undefined) => {
      if (!q) return;

      const noOption = q.options.find((o) => normalize(o.label) === "nao");
      if (!noOption) return;

      if (answers[q.id]?.optionId === noOption.id) return;

      updateAnswer({
        questionId: q.id,
        optionId: noOption.id,
        score: noOption.score,
      });
    };

    applyNo(question8);
    applyNo(question9);
  }, [isQuestion7Yes, question8, question9, answers, updateAnswer]);

  return {
    questions,
    visibleQuestions,
    answeredCount,
    hasAllAnswers,
  };
}
