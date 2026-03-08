import { useQuery } from "@tanstack/react-query";
import { QuestionnaireService } from "../services/questionnaire.service";

export function useQuestionnaireStructure() {
  return useQuery({
    queryKey: ["questionnaire-structure", "ivcf-20"],
    queryFn: () => QuestionnaireService.getIvcfStructure(),
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
  });
}
