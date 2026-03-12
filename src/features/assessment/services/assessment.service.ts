import { http } from "@/core/services/client.service";
import type { AssessmentResponse, QuestionnaireListItem } from "../types";
import { apiRoutes } from "@/core/configs/api.routes";
import type { SuccessResponse } from "@/core/types";

interface ListAssessmentsParams {
  pageSize?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
  participantName?: string;
}

export class AssessmentService {
  static async listAllAssessments({
    pageSize = 10,
    page = 1,
    startDate,
    endDate,
    participantName,
  }: ListAssessmentsParams): Promise<SuccessResponse<QuestionnaireListItem[]>> {
    return http.get(apiRoutes.ASSESSMENTS.LIST, {
      query: {
        pageSize,
        page,
        startDate,
        endDate,
        participantName,
      },
    });
  }

  static async getAssessmentResponse(
    assessmentId: string,
  ): Promise<AssessmentResponse> {
    return http.get<AssessmentResponse>(
      apiRoutes.ASSESSMENTS.RESPONSE(assessmentId),
    );
  }

  static async fetchIVCFAssessments(): Promise<
    SuccessResponse<QuestionnaireListItem[]>
  > {
    return http.get(apiRoutes.ASSESSMENTS.IVCF_STRUCTURE);
  }

  static async getParticipantResponses(
    participanteId: string,
  ): Promise<AssessmentResponse[]> {
    return http.get<AssessmentResponse[]>(
      apiRoutes.ASSESSMENTS.BY_PARTICIPANT(participanteId),
    );
  }
}
