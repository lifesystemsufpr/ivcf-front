import type { Assessment } from "@/features/assessment";
import { useEffect, useState } from "react";

export default function useFetchAssessments(participantId: string) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const actions = {
    async fetchAssessments() {
      setIsLoading(true);
      setAssessments([]);
      setErrors(null);
    },
  };

  useEffect(() => {
    actions.fetchAssessments();
  }, [participantId]);

  return {
    assessments,
    errors,
    isLoading,
    ...actions,
  };
}
