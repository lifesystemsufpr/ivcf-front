import { apiRoutes } from "@/core/configs/api.routes";
import { http } from "@/core/services/client.service";
import type {
  CreateShareRequestDto,
  ListShareRequestsQuery,
  ListShareRequestsResponse,
  ShareRequestItem,
} from "../types";

export type ShareRequestAction = "approve" | "reject" | "cancel";

const actionRoutes: Record<ShareRequestAction, (id: string) => string> = {
  approve: (id) => apiRoutes.SHARE_REQUESTS.APPROVE({ id }),
  reject: (id) => apiRoutes.SHARE_REQUESTS.REJECT({ id }),
  cancel: (id) => apiRoutes.SHARE_REQUESTS.CANCEL({ id }),
};

export class ShareRequestsService {
  static async getShareRequests({
    as,
    status,
    page,
    limit,
  }: ListShareRequestsQuery) {
    const resp = await http.get<ListShareRequestsResponse>(
      apiRoutes.SHARE_REQUESTS.LIST,
      { query: { as, status, page, limit } },
    );
    return resp;
  }

  static async createShareRequest(data: CreateShareRequestDto) {
    const resp = await http.post<ShareRequestItem>(
      apiRoutes.SHARE_REQUESTS.REQUEST_BASES,
      data,
    );
    return resp;
  }

  static async runAction(action: ShareRequestAction, id: string) {
    const resp = await http.patch<ShareRequestItem>(actionRoutes[action](id));
    return resp;
  }
}
