import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";
import type { ParticipantResponse } from "../types";
import type { SuccessResponse } from "@/core/types";

type InfiniteParticipantsData = InfiniteData<
  SuccessResponse<ParticipantResponse[]>
>;

export function useDeleteParticipant() {
  const queryClient = useQueryClient();
  const queryKey = ["participants"];

  return useMutation({
    mutationFn: (id: string) => ParticipantsService.deleteParticipant(id),

    onMutate: async (deletedParticipantId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<InfiniteParticipantsData>(queryKey);

      queryClient.setQueryData<InfiniteParticipantsData>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter(
                (participant) => participant.id !== deletedParticipantId,
              ),
            })),
          };
        },
      );

      return { previousData };
    },

    onError: (_err, _deletedParticipantId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
