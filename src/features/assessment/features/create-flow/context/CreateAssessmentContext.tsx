import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

export interface AssessmentAnswer {
  questionId: string;
  optionId: string;
  score: number;
}

export type AnswerMap = Record<string, AssessmentAnswer>;

interface AssessmentState {
  participantId: string | null;
  participantAge: number | null;
  questionnaireId: string | null;
  answers: AnswerMap;
  currentQuestion: number;
  totalQuestions: number;
}

interface AssessmentContextValue extends AssessmentState {
  selectParticipant: (
    participantId: string,
    participantAge: number | null,
  ) => void;
  setQuestionnaireId: (questionnaireId: string) => void;
  setTotalQuestions: (total: number) => void;
  updateAnswer: (answer: AssessmentAnswer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setCurrentQuestion: (question: number) => void;
  reset: () => void;
}

const STORAGE_KEY = "ivcf:create-state";

const defaultState: AssessmentState = {
  participantId: null,
  questionnaireId: null,
  answers: {},
  currentQuestion: 1,
  totalQuestions: 20,
  participantAge: null,
};

function loadInitialState(): AssessmentState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;

    const parsed = JSON.parse(stored) as AssessmentState;
    return {
      participantId: parsed.participantId ?? null,
      participantAge: parsed.participantAge ?? null,
      questionnaireId: parsed.questionnaireId ?? null,
      answers: parsed.answers ?? {},
      currentQuestion: parsed.currentQuestion ?? 1,
      totalQuestions: parsed.totalQuestions ?? 20,
    };
  } catch (error) {
    console.error("Failed to restore assessment state", error);
    return defaultState;
  }
}

export const AssessmentContext = createContext<
  AssessmentContextValue | undefined
>(undefined);

export function AssessmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AssessmentState>(() => loadInitialState());

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const selectParticipant = useCallback(
    (participantId: string, participantAge: number | null) => {
      setState((prev) => ({ ...prev, participantId, participantAge }));
    },
    [],
  );

  const setQuestionnaireId = useCallback((questionnaireId: string) => {
    setState((prev) => ({ ...prev, questionnaireId }));
  }, []);

  const setTotalQuestions = useCallback((total: number) => {
    setState((prev) => ({ ...prev, totalQuestions: total }));
  }, []);

  const updateAnswer = useCallback((answer: AssessmentAnswer) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [answer.questionId]: answer,
      },
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentQuestion: Math.min(prev.currentQuestion + 1, prev.totalQuestions),
    }));
  }, []);

  const previousQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentQuestion: Math.max(prev.currentQuestion - 1, 1),
    }));
  }, []);

  const setCurrentQuestion = useCallback((question: number) => {
    setState((prev) => ({
      ...prev,
      currentQuestion: Math.min(Math.max(question, 1), prev.totalQuestions),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      selectParticipant,
      setQuestionnaireId,
      setTotalQuestions,
      updateAnswer,
      nextQuestion,
      previousQuestion,
      setCurrentQuestion,
      reset,
    }),
    [
      state,
      selectParticipant,
      setQuestionnaireId,
      setTotalQuestions,
      updateAnswer,
      nextQuestion,
      previousQuestion,
      setCurrentQuestion,
      reset,
    ],
  );

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentContext() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error(
      "useAssessmentContext must be used within an AssessmentProvider",
    );
  }
  return context;
}
