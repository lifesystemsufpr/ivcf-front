import type { Assessment, QuestionnaireListItem } from "../types";

export function mapperDomainToUI(data: QuestionnaireListItem): Assessment {
  return {
    id: data.id,
    date: data.date,
    totalScore: data.totalScore,
    classification: data.classification,
    participantId: data.participantId,
    participantName: data.participantName,
  };
}
