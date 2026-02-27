import { assessmentsListMock } from "@/features/assessment";

export const ParticipantsService = {
  async getParticipantsAssessments(participantId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return assessmentsListMock.filter(
      (assessment) => assessment.participantId === participantId,
    );
  },
};
