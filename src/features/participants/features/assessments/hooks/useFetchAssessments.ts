import type { Assessment } from "@/features/assessment";
import { ParticipantsService } from "@/features/participants/services/participants.service";
import { useEffect, useState } from "react";

export default function useFetchAssessments(participantId: string) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const actions = {
    async fetchAssessments() {
      setIsLoading(true);
      ParticipantsService.getParticipantsAssessments(participantId)
        .then((data) => {
          setAssessments(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setErrors(error.message);
          setIsLoading(false);
        });
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
