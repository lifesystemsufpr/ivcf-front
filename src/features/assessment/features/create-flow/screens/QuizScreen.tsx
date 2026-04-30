import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Typography,
} from "@/core/components/ui";
import { clientRoutes } from "@/core/configs/client.routes";
import ParticipantAutocomplete from "@/features/participants/components/ParticipantAutocomplete";
import type { Participant } from "@/features/participants/types";
import { useAssessmentContext } from "../context/CreateAssessmentContext";
import { ProgressBar } from "../components/ProgressBar";
import { QuestionCard } from "../components/QuestionCard";
import { saveAssessment } from "../services/saveAssessment";
import { useQuestionnaireStructure } from "../hooks/useQuestionnaireStructure";
import { flattenQuestions } from "../utils/questionnaireHelpers";
import { useAuthContext } from "@/features/auth/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function QuizScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const {
    participantId,
    questionnaireId,
    answers,
    currentQuestion,
    totalQuestions,
    updateAnswer,
    nextQuestion,
    previousQuestion,
    selectParticipant,
    setQuestionnaireId,
    setTotalQuestions,
    setCurrentQuestion,
    reset,
  } = useAssessmentContext();

  const {
    data: questionnaireStructure,
    isLoading: isLoadingStructure,
    error: structureError,
  } = useQuestionnaireStructure();

  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const questions = useMemo(() => {
    if (!questionnaireStructure) return [];
    return flattenQuestions(questionnaireStructure);
  }, [questionnaireStructure]);

  const question7 = useMemo(
    () => questions.find((item) => item.order === 7),
    [questions],
  );
  const question8 = useMemo(
    () => questions.find((item) => item.order === 8),
    [questions],
  );
  const question9 = useMemo(
    () => questions.find((item) => item.order === 9),
    [questions],
  );

  const isQuestion7Yes = useMemo(() => {
    if (!question7) return false;

    const question7OptionId = answers[question7.id]?.optionId;
    if (!question7OptionId) return false;

    const question7Option = question7.options.find(
      (option) => option.id === question7OptionId,
    );
    if (!question7Option) return false;

    return question7Option.label.trim().toLowerCase() === "sim";
  }, [answers, question7]);

  const visibleQuestions = useMemo(
    () =>
      questions.filter((item) => {
        if (item.order === 8 || item.order === 9) {
          return isQuestion7Yes;
        }
        return true;
      }),
    [isQuestion7Yes, questions],
  );

  useEffect(() => {
    if (questionnaireStructure?.id) {
      setQuestionnaireId(questionnaireStructure.id);
      setTotalQuestions(visibleQuestions.length);
    }
  }, [
    questionnaireStructure,
    visibleQuestions.length,
    setQuestionnaireId,
    setTotalQuestions,
  ]);

  useEffect(() => {
    if (
      currentQuestion > visibleQuestions.length &&
      visibleQuestions.length > 0
    ) {
      setCurrentQuestion(visibleQuestions.length);
    }
  }, [currentQuestion, setCurrentQuestion, visibleQuestions.length]);

  useEffect(() => {
    if (selectedParticipant?.id) {
      selectParticipant(selectedParticipant.id, null);
    }
  }, [selectedParticipant, selectParticipant]);

  useEffect(() => {
    if (isQuestion7Yes) {
      return;
    }

    const normalize = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();

    const applyNoAnswer = (targetQuestion?: (typeof questions)[number]) => {
      if (!targetQuestion) {
        return;
      }

      const noOption = targetQuestion.options.find(
        (option) => normalize(option.label) === "nao",
      );

      if (!noOption) {
        return;
      }

      const currentOptionId = answers[targetQuestion.id]?.optionId;
      if (currentOptionId === noOption.id) {
        return;
      }

      updateAnswer({
        questionId: targetQuestion.id,
        optionId: noOption.id,
        score: noOption.score,
      });
    };

    applyNoAnswer(question8);
    applyNoAnswer(question9);
  }, [answers, isQuestion7Yes, question8, question9, updateAnswer]);

  const question = useMemo(() => {
    return visibleQuestions[currentQuestion - 1] ?? visibleQuestions[0];
  }, [visibleQuestions, currentQuestion]);

  const selectedOptionId = question
    ? answers[question.id]?.optionId
    : undefined;
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
  const isLastQuestion = currentQuestion === totalQuestions;

  const handleSelectOption = (optionId: string, score: number) => {
    if (!question) return;
    updateAnswer({
      questionId: question.id,
      optionId,
      score,
    });
  };

  const handleNext = async () => {
    if (!participantId) {
      setErrorMessage("Selecione um participante para continuar.");
      return;
    }

    if (isLastQuestion) {
      await handleFinish();
      return;
    }

    nextQuestion();
  };

  const handleFinish = async () => {
    if (!participantId) {
      setErrorMessage("Selecione um participante para finalizar.");
      return;
    }

    if (!questionnaireId) {
      setErrorMessage(
        "Erro ao identificar o questionário. Recarregue a página.",
      );
      return;
    }

    if (!user?.id) {
      setErrorMessage("Usuário não autenticado. Faça login novamente.");
      return;
    }

    if (!hasAllAnswers) {
      setErrorMessage("Responda todas as perguntas antes de finalizar.");
      return;
    }

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
      navigate(clientRoutes.IVCF.RESULT({ id: result.id }), { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível salvar a avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryButtonDisabled =
    !selectedOptionId ||
    isSubmitting ||
    !participantId ||
    (isLastQuestion && !hasAllAnswers);
  const previousDisabled = currentQuestion === 1 || isSubmitting;

  if (isLoadingStructure) {
    return (
      <Box className="h-[90vh] p-6 flex items-center justify-center">
        <Card className="w-full max-w-5xl" padding="lg">
          <CardContent className="p-6">
            <Typography variant="h3">Carregando questionário...</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (structureError || !questionnaireStructure || questions.length === 0) {
    return (
      <Box className="h-[90vh] p-6 flex items-center justify-center">
        <Card className="w-full max-w-5xl" padding="lg">
          <CardContent className="p-6">
            <Alert className="border-destructive bg-destructive/10 text-destructive">
              <Typography variant="h3">
                Erro ao carregar questionário
              </Typography>
              <Typography variant="small">
                Não foi possível carregar a estrutura do questionário. Tente
                recarregar a página.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="h-[90vh] p-6 flex items-center justify-center">
      <Card className="w-full max-w-5xl" padding="lg">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2">
          <div>
            <CardTitle>Questionário IVCF-20</CardTitle>
            <Typography variant="small" className="text-muted-foreground">
              Responda cada questão. Suas respostas são salvas automaticamente.
            </Typography>
          </div>
          <ProgressBar current={currentQuestion} total={totalQuestions} />
        </CardHeader>

        <CardContent className="space-y-6 p-2">
          {!participantId && (
            <Alert className="space-y-2 border-amber-300 bg-amber-50 text-amber-800">
              <Typography variant="small" className="font-medium">
                Nenhum participante selecionado
              </Typography>
              <Typography variant="small">
                Escolha um participante antes de continuar.
              </Typography>
              <ParticipantAutocomplete
                onChange={(value) => setSelectedParticipant(value)}
              />
            </Alert>
          )}

          {question && (
            <QuestionCard
              key={question.id}
              question={question}
              selectedOptionId={selectedOptionId}
              onSelect={(option) => handleSelectOption(option.id, option.score)}
            />
          )}

          {errorMessage && (
            <Alert className="border-destructive bg-destructive/10 text-destructive">
              <Typography variant="small" className="font-medium">
                {errorMessage}
              </Typography>
            </Alert>
          )}

          <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Typography variant="small" className="text-muted-foreground">
              {answeredCount}/{totalQuestions} respondidas
            </Typography>
            <Box className="flex gap-3">
              <Button
                variant="outline"
                disabled={previousDisabled}
                onClick={previousQuestion}
              >
                <Typography variant="small" color="accent">
                  Anterior
                </Typography>
              </Button>
              <Button
                onClick={handleNext}
                disabled={primaryButtonDisabled}
                loading={isSubmitting}
                variant={"secondary"}
              >
                {isLastQuestion ? "Finalizar e ver resultado" : "Próxima"}
              </Button>
            </Box>
          </Box>

          {!isLastQuestion && !selectedOptionId && (
            <Typography variant="caption" className="text-muted-foreground">
              Selecione uma opção para avançar.
            </Typography>
          )}
          {isLastQuestion && !hasAllAnswers && (
            <Typography variant="caption" className="text-destructive">
              Responda todas as perguntas antes de finalizar.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
