import { http } from "@/core/services/client.service";
import { apiRoutes } from "@/core/configs/api.routes";
import type {
  QuestionnaireStructure,
  SubmitQuestionnaireRequest,
  SubmitQuestionnaireResponse,
} from "../types/questionnaire.types";

export class QuestionnaireService {
  static async getIvcfStructure(): Promise<QuestionnaireStructure> {
    return http.get<QuestionnaireStructure>(apiRoutes.ASSESSMENTS.IVCF_STRUCTURE);
  }

  static async submitQuestionnaireResponse(
    data: SubmitQuestionnaireRequest,
  ): Promise<SubmitQuestionnaireResponse> {
    return http.post<SubmitQuestionnaireResponse>(
      apiRoutes.ASSESSMENTS.IVCF_RESPONSE(),
      data,
    );
  }
}
