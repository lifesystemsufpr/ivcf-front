import { http } from "@/core/services/client.service";
import type { QuestionnaireListItem } from "../types";
import { apiRoutes } from "@/core/configs/api.routes";
import type { SuccessResponse } from "@/core/types";

interface ListAssessmentsParams {
  pageSize?: number;
  page?: number;
}

export class AssessmentService {
  static async listAllAssessments({
    pageSize = 10,
    page = 1,
  }: ListAssessmentsParams): Promise<SuccessResponse<QuestionnaireListItem[]>> {
    return http.get(apiRoutes.ASSESSMENTS.LIST, {
      query: {
        pageSize,
        page,
      },
    });
  }
}
