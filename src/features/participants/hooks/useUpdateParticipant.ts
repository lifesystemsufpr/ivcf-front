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

interface UpdateParticipantPayload {
  id: string;
  data: ParticipantRequest;
}

export function useUpdateParticipant() {
  const queryClient = useQueryClient();
  const queryKey = ["participants"];

  return useMutation({
    mutationFn: ({ id, data }: UpdateParticipantPayload) =>
      ParticipantsService.updateParticipant(id, data),

    onMutate: async (newParticipant) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<InfiniteParticipantsData>(queryKey);

      queryClient.setQueryData<InfiniteParticipantsData>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          const newParticipantData: ParticipantRequest = newParticipant.data;

          const updatedMockParticipant: ParticipantResponse = {
            id: `temp-${Date.now()}`,
            fullName: newParticipantData.user.fullName,
            email: newParticipantData.user.email,
            phone: newParticipantData.user.phone,
            gender: newParticipantData.gender,
            active: newParticipantData.user.active,
            birthday: newParticipantData.birthday,
            weight: newParticipantData.weight,
            height: newParticipantData.height,
            zipCode: newParticipantData.zipCode,
            street: newParticipantData.street,
            number: newParticipantData.number,
            complement: newParticipantData.complement,
            neighborhood: newParticipantData.neighborhood,
            city: newParticipantData.city,
            state: newParticipantData.state,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            fullName_normalized: newParticipantData.user.fullName.toLowerCase(),
            role: "PARTICIPANT" as SystemRole,
            hasRelations: false,
          };

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return {
                ...page,
                data: page.data.map((participant) =>
                  participant.id === newParticipant.id
                    ? { ...participant, ...updatedMockParticipant }
                    : participant,
                ),
              };
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
