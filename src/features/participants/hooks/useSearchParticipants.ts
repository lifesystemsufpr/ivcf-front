import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ParticipantsService } from "../services/participants.service";
import { parseParticipantResponse } from "../utils";
import type { Participant } from "../types";

interface UseSearchParticipantsOptions {
  searchTerm?: string;
  debounceMs?: number;
}

export function useSearchParticipants({
  searchTerm = "",
}: UseSearchParticipantsOptions = {}) {
  const { data, isLoading } = useQuery({
    queryKey: ["participants-search", searchTerm],
    queryFn: async () => {
      const resp = await ParticipantsService.getParticipants({
        pageSize: 50,
        filters: searchTerm ? { fullName: searchTerm } : undefined,
      });
      return resp;
    },
    staleTime: 1000 * 60 * 5,
    enabled: searchTerm.length > 0 || !searchTerm,
  });

  const participants: Participant[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => parseParticipantResponse(item));
  }, [data]);

  return {
    participants,
    isLoading,
  };
}
