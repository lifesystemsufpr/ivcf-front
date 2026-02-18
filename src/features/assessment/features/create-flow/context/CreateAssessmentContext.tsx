import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { IVCF_TOTAL_QUESTIONS } from "../questions";

export type AnswerMap = Record<string, AssessmentAnswer>;

export interface AssessmentAnswer {
  questionId: string;
  optionId: string;
  score: number;
}

interface AssessmentState {
  participantId: string | null;
  answers: AnswerMap;
  currentQuestion: number;
}

interface AssessmentContextValue extends AssessmentState {
  totalScore: number;
  selectParticipant: (participantId: string) => void;
  updateAnswer: (answer: AssessmentAnswer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setCurrentQuestion: (question: number) => void;
  reset: () => void;
}

const STORAGE_KEY = "ivcf:create-state";

const defaultState: AssessmentState = {
  participantId: null,
  answers: {},
  currentQuestion: 1,
};

function loadInitialState(): AssessmentState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;

    const parsed = JSON.parse(stored) as AssessmentState;

    return {
      participantId: parsed.participantId ?? null,
      answers: parsed.answers ?? {},
      currentQuestion: parsed.currentQuestion ?? 1,
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
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to persist assessment state", error);
    }
  }, [state]);

  const totalScore = useMemo(() => {
    return Object.values(state.answers).reduce(
      (sum, answer) => sum + answer.score,
      0,
    );
  }, [state.answers]);

  const value = useMemo<AssessmentContextValue>(() => {
    const selectParticipant = (participantId: string) => {
      setState((prev) => ({ ...prev, participantId }));
    };

    const updateAnswer = (answer: AssessmentAnswer) => {
      setState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [answer.questionId]: answer,
        },
      }));
    };

    const nextQuestion = () => {
      setState((prev) => ({
        ...prev,
        currentQuestion: Math.min(
          prev.currentQuestion + 1,
          IVCF_TOTAL_QUESTIONS,
        ),
      }));
    };

    const previousQuestion = () => {
      setState((prev) => ({
        ...prev,
        currentQuestion: Math.max(prev.currentQuestion - 1, 1),
      }));
    };

    const setCurrentQuestion = (question: number) => {
      setState((prev) => ({
        ...prev,
        currentQuestion: Math.min(Math.max(question, 1), IVCF_TOTAL_QUESTIONS),
      }));
    };

    const reset = () => {
      setState(defaultState);
    };

    return {
      ...state,
      totalScore,
      selectParticipant,
      updateAnswer,
      nextQuestion,
      previousQuestion,
      setCurrentQuestion,
      reset,
    };
  }, [state, totalScore]);

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
