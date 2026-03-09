import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";
import type { ParticipantRequest, ParticipantResponse } from "../types";
import type { SuccessResponse, SystemRole } from "@/core/types";

type InfiniteParticipantsData = InfiniteData<
  SuccessResponse<ParticipantResponse[]>
>;

export function useCreateParticipant() {
  const queryClient = useQueryClient();
  const queryKey = ["participants"];

  return useMutation({
    mutationFn: (data: ParticipantRequest) =>
      ParticipantsService.createParticipant(data),

    onMutate: async (newParticipant) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<InfiniteParticipantsData>(queryKey);

      queryClient.setQueryData<InfiniteParticipantsData>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          const mockNewParticipant: ParticipantResponse = {
            id: `temp-${Date.now()}`,
            fullName: newParticipant.user.fullName,
            email: newParticipant.user.email,
            phone: newParticipant.user.phone,
            gender: newParticipant.user.gender,
            active: newParticipant.user.active,
            birthday: newParticipant.birthday,
            weight: newParticipant.weight,
            height: newParticipant.height,
            zipCode: newParticipant.zipCode,
            street: newParticipant.street,
            number: newParticipant.number,
            complement: newParticipant.complement,
            neighborhood: newParticipant.neighborhood,
            city: newParticipant.city,
            state: newParticipant.state,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            fullName_normalized: newParticipant.user.fullName.toLowerCase(),
            role: "PARTICIPANT" as SystemRole,
            hasRelations: false,
          };

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  data: [mockNewParticipant, ...page.data],
                };
              }
              return page;
            }),
          };
        },
      );

      return { previousData };
    },

    // @ts-ignore
    onError: (err, newParticipant, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
