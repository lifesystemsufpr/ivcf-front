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

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [question.id]);

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
        {question.options.map((option) => {
          const isActive = selectedOptionId === option.id;
          return (
            <Button
              key={option.id}
              variant={isActive ? "secondary" : "outline"}
              className="justify-start text-left"
              fullWidth
              onClick={() => onSelect(option)}
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
