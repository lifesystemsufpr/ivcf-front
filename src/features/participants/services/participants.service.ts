import { apiRoutes } from "@/core/configs/api.routes";
import { http } from "@/core/services/client.service";
import type { ParticipantRequest, ParticipantResponse } from "../types";
import type { SuccessResponse } from "@/core/types";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export class ParticipantsService {
  static async createParticipant(data: ParticipantRequest) {
    return http.post(apiRoutes.PARTICIPANTS.LIST, data);
  }

  static async getParticipants(params?: PaginationParams) {
    const resp = await http.get<SuccessResponse<ParticipantResponse[]>>(
      apiRoutes.PARTICIPANTS.LIST,
      {
        query: {
          page: params?.page,
          pageSize: params?.pageSize,
        },
      },
    );
    return resp;
  }

  static async getParticipantById(id: string) {
    const resp = await http.get<ParticipantResponse>(
      `${apiRoutes.PARTICIPANTS.LIST}/${id}`,
    );
    return resp;
  }

  static async updateParticipant(id: string, data: ParticipantRequest) {
    const resp = await http.patch(`${apiRoutes.PARTICIPANTS.LIST}/${id}`, data);
    return resp;
  }

  static async deleteParticipant(id: string) {
    const resp = await http.delete(`${apiRoutes.PARTICIPANTS.LIST}/${id}`);
    return resp;
  }
}
