import { apiRoutes } from "@/core/configs/api.routes";
import { http } from "@/core/services/client.service";
import type { ApiError } from "@/core/services/client.service";
import type {
  CheckEmailResponse,
  LinkParticipantRequest,
  ParticipantRequest,
  ParticipantResponse,
} from "../types";
import type { SuccessResponse } from "@/core/types";
import type { ParticipantEvolutionData } from "../features/indicators/types";
import type { FilterState } from "@/core/components/ui";
import type { SortDirection } from "@/core/components/ui/table/header/TableColumn";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: SortDirection;
  filters?: FilterState;
};

export class ParticipantsService {
  static async createParticipant(data: ParticipantRequest) {
    return http.post(apiRoutes.PARTICIPANTS.LIST, data);
  }

  static async getParticipants(params?: PaginationParams) {
    const filtersQuery = Object.fromEntries(
      Object.entries(params?.filters ?? {}).filter(([, value]) =>
        Boolean(value?.trim()),
      ),
    );

    const shortField =
      params?.sortField === "birthDate" ? "birthday" : params?.sortField;

    const resp = await http.get<SuccessResponse<ParticipantResponse[]>>(
      apiRoutes.PARTICIPANTS.LIST,
      {
        query: {
          page: params?.page,
          pageSize: params?.pageSize,
          sortField: shortField,
          sortDirection: params?.sortDirection,
          ...filtersQuery,
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

  static async getParticipantIndicators(
    id: string,
  ): Promise<ParticipantEvolutionData> {
    const resp = await http.get<ParticipantEvolutionData>(
      apiRoutes.PARTICIPANTS.INDICATORS({ id }),
    );
    return resp;
  }

  static async checkEmailExists(email: string) {
    try {
      const resp = await http.get<CheckEmailResponse>(
        apiRoutes.PARTICIPANTS.CHECK_EMAIL({ email }),
      );
      return resp;
    } catch (error) {
      if ((error as ApiError)?.status === 404) {
        return { participantId: null };
      }
      throw error;
    }
  }

  static async linkParticipantToProfessional({
    participantId,
  }: LinkParticipantRequest) {
    try {
      const resp = await http.post(apiRoutes.PROFESSIONALS.LINK_PARTICIPANT, {
        participantId,
      });
      return resp;
    } catch (error) {
      if ((error as ApiError)?.status === 404) {
        throw new Error("Participante não encontrado");
      }
      throw error;
    }
  }
}
