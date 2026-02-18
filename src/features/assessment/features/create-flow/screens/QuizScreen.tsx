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
import { IVCF_TOTAL_QUESTIONS, ivcfQuestions } from "../questions";
import { saveAssessment } from "../services/saveAssessment";

export default function QuizScreen() {
  const navigate = useNavigate();
  const {
    participantId,
    answers,
    currentQuestion,
    updateAnswer,
    nextQuestion,
    previousQuestion,
    selectParticipant,
    reset,
  } = useAssessmentContext();

  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedParticipant?.id) {
      selectParticipant(selectedParticipant.id);
    }
  }, [selectedParticipant, selectParticipant]);

  const question = useMemo(() => {
    return (
      ivcfQuestions.find((item) => item.order === currentQuestion) ??
      ivcfQuestions[0]
    );
  }, [currentQuestion]);

  const selectedOptionId = question
    ? answers[question.id]?.optionId
    : undefined;
  const answeredCount = Object.keys(answers).length;
  const hasAllAnswers = answeredCount === IVCF_TOTAL_QUESTIONS;
  const isLastQuestion = currentQuestion === IVCF_TOTAL_QUESTIONS;

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

    if (!hasAllAnswers) {
      setErrorMessage("Responda todas as perguntas antes de finalizar.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await saveAssessment({ participantId, answers });
      reset();
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

  return (
    <Box className="min-h-screen bg-muted/30 p-6 flex items-center justify-center">
      <Card className="w-full max-w-5xl" padding="lg">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Questionário IVCF-20</CardTitle>
            <Typography variant="small" className="text-muted-foreground">
              Responda cada questão. Suas respostas são salvas automaticamente.
            </Typography>
          </div>
          <ProgressBar current={currentQuestion} total={IVCF_TOTAL_QUESTIONS} />
        </CardHeader>

        <CardContent className="space-y-6">
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
              {answeredCount}/{IVCF_TOTAL_QUESTIONS} respondidas
            </Typography>
            <Box className="flex gap-3">
              <Button
                variant="outline"
                disabled={previousDisabled}
                onClick={previousQuestion}
              >
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={primaryButtonDisabled}
                loading={isSubmitting}
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
