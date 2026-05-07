import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Typography,
} from "@/core/components/ui";
import type {
  QuestionnaireQuestion,
  QuestionnaireOption,
} from "../types/questionnaire.types";
import { useAssessmentContext } from "../context/CreateAssessmentContext";

interface QuestionCardProps {
  question: QuestionnaireQuestion;
  selectedOptionId?: string;
  onSelect: (option: QuestionnaireOption) => void;
}

export function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
}: QuestionCardProps) {
  const [visible, setVisible] = useState(false);
  const { participantAge } = useAssessmentContext();
  const isAgeQuestion =
    question.statement.trim().toLowerCase() === "qual é a sua idade?";
  const NoOrYesQuestion = question.options.some((option) =>
    ["sim", "não"].includes(option.label.trim().toLowerCase()),
  );
  const displayOptions = NoOrYesQuestion
    ? [...question.options].reverse()
    : question.options;

  const getAgeOptionId = () => {
    const age = Number(participantAge);

    if (!Number.isFinite(age)) {
      return undefined;
    }

    if (age >= 85) {
      return question.options.find((option) => option.label.includes("85"))?.id;
    }

    if (age >= 75) {
      return question.options.find((option) => option.label.includes("75 a 84"))
        ?.id;
    }

    return question.options.find((option) => option.label.includes("60 a 74"))
      ?.id;
  };

  const ageOptionId = isAgeQuestion ? getAgeOptionId() : undefined;
  const isAgeQuestionLocked = isAgeQuestion && Boolean(ageOptionId);

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [question.id]);

  useEffect(() => {
    if (!isAgeQuestion || !ageOptionId || selectedOptionId === ageOptionId) {
      return;
    }

    const option = question.options.find((item) => item.id === ageOptionId);

    if (option) {
      onSelect(option);
    }
  }, [
    ageOptionId,
    isAgeQuestion,
    onSelect,
    question.options,
    selectedOptionId,
  ]);

  return (
    <Card
      padding="md"
      className={`w-full transition-all duration-300 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <CardHeader>
        <Typography variant="small" className="text-muted-foreground">
          Questão {question.order}
        </Typography>
        <CardTitle>{question.statement}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {displayOptions.map((option) => {
          const isActive = selectedOptionId === option.id;
          return (
            <Button
              key={option.id}
              variant={isActive ? "secondary" : "outline"}
              className="justify-start text-left"
              fullWidth
              disabled={isAgeQuestionLocked}
              onClick={() => {
                if (isAgeQuestionLocked) {
                  return;
                }

                onSelect(option);
              }}
            >
              <span className="font-medium">{option.label}</span>
              <Typography
                variant="caption"
                className={`ml-auto text-muted-foreground ${isActive ? "text-[hsl(var(--foreground))]" : ""}`}
              >
                Pontuação: {option.score}
              </Typography>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
