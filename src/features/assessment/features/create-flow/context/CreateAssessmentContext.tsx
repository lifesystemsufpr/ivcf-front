import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { IVCF_TOTAL_QUESTIONS } from "../questions";
export interface AssessmentAnswer {
  questionId: string;
  optionId: string;
  score: number;
}

export type AnswerMap = Record<string, AssessmentAnswer>;

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

const calculateIvcfScore = (answers: AnswerMap): number => {
  const values = Object.values(answers);

  const avdInstrumentalScore = Math.min(
    values
      .filter((a) => ["q3", "q4", "q5"].includes(a.questionId))
      .reduce((sum, a) => sum + a.score, 0),
    4,
  );

  const mobilityScore = Math.min(
    values
      .filter((a) =>
        ["q12", "q13", "q14", "q15", "q16", "q17"].includes(a.questionId),
      )
      .reduce((sum, a) => sum + a.score, 0),
    2,
  );

  const comorbidityScore = Math.min(
    values
      .filter((a) => a.questionId === "q20")
      .reduce((sum, a) => sum + a.score, 0),
    4,
  );

  const otherIds = [
    "q1",
    "q2",
    "q6",
    "q7",
    "q8",
    "q9",
    "q10",
    "q11",
    "q18",
    "q19",
  ];
  const othersScore = values
    .filter((a) => otherIds.includes(a.questionId))
    .reduce((sum, a) => sum + a.score, 0);

  return avdInstrumentalScore + mobilityScore + comorbidityScore + othersScore;
};

/**
 * Auxiliares de Storage
 */
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
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalScore = useMemo(
    () => calculateIvcfScore(state.answers),
    [state.answers],
  );

  const selectParticipant = useCallback((participantId: string) => {
    setState((prev) => ({ ...prev, participantId }));
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
      currentQuestion: Math.min(prev.currentQuestion + 1, IVCF_TOTAL_QUESTIONS),
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
      currentQuestion: Math.min(Math.max(question, 1), IVCF_TOTAL_QUESTIONS),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      totalScore,
      selectParticipant,
      updateAnswer,
      nextQuestion,
      previousQuestion,
      setCurrentQuestion,
      reset,
    }),
    [
      state,
      totalScore,
      selectParticipant,
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
