import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";

interface UseListParticipantsOptions {
  page?: number;
  pageSize?: number;
}

export function useListParticipants({
  page = 1,
  pageSize = 15,
}: UseListParticipantsOptions) {
  return useQuery({
    queryKey: ["participants", page, pageSize],
    queryFn: () =>
      ParticipantsService.getParticipants({
        page,
        pageSize,
      }),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });
}
