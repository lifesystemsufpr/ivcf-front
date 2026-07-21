import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { FilterState, SortState } from "@/core/components/ui";
import { ParticipantsService } from "../services/participants.service";

interface UseListParticipantsOptions {
  page?: number;
  pageSize?: number;
  sort?: SortState;
  filters?: FilterState;
}

export function useListParticipants({
  page = 1,
  pageSize = 15,
  sort,
  filters,
}: UseListParticipantsOptions) {
  return useQuery({
    queryKey: ["participants", page, pageSize, sort, filters],
    queryFn: () =>
      ParticipantsService.getParticipants({
        page,
        pageSize,
        sortField: sort?.field ?? undefined,
        sortDirection: sort?.field ? sort.direction : undefined,
        filters,
      }),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });
}
