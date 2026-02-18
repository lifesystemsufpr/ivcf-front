import { createContext, useContext, useState } from "react";
import type { Answer } from "@/features/assessment/types";

interface CreateAssessmentProviderValue {
  step: number;
  selectedParticipantId: string | null;
  answers: Answer[];
  currentQuestionIndex: number;
  quizScore: number | null;
}

export const CreateAssessmentContext = createContext<
  CreateAssessmentProviderValue | undefined
>(undefined);

export function CreateAssessmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [step, setStep] = useState(1);
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  return (
    <CreateAssessmentContext.Provider
      value={{
        step,
        selectedParticipantId,
        answers,
        currentQuestionIndex,
        quizScore,
      }}
    >
      {children}
    </CreateAssessmentContext.Provider>
  );
}

export function useCreateAssessmentContext() {
  const context = useContext(CreateAssessmentContext);
  if (!context) {
    throw new Error(
      "useCreateAssessmentContext must be used within a CreateAssessmentProvider",
    );
  }
  return context;
}
