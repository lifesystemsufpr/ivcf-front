import type { AuthUser } from "@/features/auth/contexts/AuthContext";
import type { AnswerMap } from "../context/CreateAssessmentContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveAssessment } from "../services/saveAssessment";
import { clientRoutes } from "@/core/configs/client.routes";

export interface UseQuizFlowParams {
  participantId: string | null;
  questionnaireId: string | null;
  answers: AnswerMap;
  user: AuthUser | null;
  hasAllAnswers: boolean;
  reset: () => void;
}

export function useQuizFlow({
  participantId,
  questionnaireId,
  answers,
  user,
  hasAllAnswers,
  reset,
}: UseQuizFlowParams) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFinish = async () => {
    if (!participantId) return setErrorMessage("Selecione um participante.");
    if (!questionnaireId) return setErrorMessage("Erro no questionário.");
    if (!user?.id) return setErrorMessage("Usuário não autenticado.");
    if (!hasAllAnswers) return setErrorMessage("Responda tudo.");

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await saveAssessment({
        participantId,
        healthProfessionalId: user.id,
        questionnaireId,
        answers,
      });

      reset();
      queryClient.invalidateQueries({ queryKey: ["assessments"] });

      navigate(clientRoutes.IVCF.RESULT({ id: result.id }), {
        replace: true,
      });
    } catch {
      setErrorMessage("Erro ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errorMessage,
    setErrorMessage,
    handleFinish,
  };
}
