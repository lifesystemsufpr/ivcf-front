import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ShareRequestsService } from "../services/share-requests.service";
import type { ListShareRequestsQuery } from "../types";

export function useListShareRequests({
  as,
  status,
  page = 1,
  limit = 10,
}: ListShareRequestsQuery) {
  return useQuery({
    queryKey: ["share-requests", as, status, page, limit],
    queryFn: () =>
      ShareRequestsService.getShareRequests({ as, status, page, limit }),
    placeholderData: keepPreviousData,
  });
}
