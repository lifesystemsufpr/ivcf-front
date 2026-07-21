import { useMutation } from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";

export function useCheckParticipantEmail() {
  return useMutation({
    mutationFn: (email: string) =>
      ParticipantsService.checkEmailExists(email.trim()),
  });
}
