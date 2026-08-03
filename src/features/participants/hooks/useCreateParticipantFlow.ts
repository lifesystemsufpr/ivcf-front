import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/core/utils";
import type { Participant } from "../types";
import { useCheckParticipantEmail } from "./useCheckParticipantEmail";
import { useLinkParticipantToProfessional } from "./useLinkParticipantToProfessional";

export type CreateParticipantStep = "CHECK_EMAIL" | "FILL_FORM";

interface UseCreateParticipantFlowParams {
  onCompleted: () => void;
}

export function useCreateParticipantFlow({
  onCompleted,
}: UseCreateParticipantFlowParams) {
  const [email, setEmail] = useState("");
  const [checkedEmail, setCheckedEmail] = useState<string | null>(null);
  const [existingParticipantId, setExistingParticipantId] = useState<
    string | null
  >(null);
  const [hasBaseWithProfessional, setHasBaseWithProfessional] = useState(false);
  const [baseActive, setBaseActive] = useState(false);

  const checkEmail = useCheckParticipantEmail();
  const linkParticipant = useLinkParticipantToProfessional();

  const step: CreateParticipantStep =
    checkedEmail !== null && !existingParticipantId
      ? "FILL_FORM"
      : "CHECK_EMAIL";

  // ParticipantForm reseta seus campos sempre que a identidade de
  // initialValues muda, entao esse objeto precisa ser referencialmente estavel.
  const formInitialValues = useMemo<Partial<Participant> | undefined>(
    () => (checkedEmail === null ? undefined : { email: checkedEmail }),
    [checkedEmail],
  );

  const reset = () => {
    setEmail("");
    setCheckedEmail(null);
    setExistingParticipantId(null);
    checkEmail.reset();
    linkParticipant.reset();
  };

  const verifyEmail = () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      toast.error("Informe um e-mail para verificar.");
      return;
    }

    checkEmail.mutate(normalizedEmail, {
      onSuccess: (response) => {
        setCheckedEmail(normalizedEmail);
        setExistingParticipantId(response?.participantId ?? null);
        setHasBaseWithProfessional(response?.hasBaseWithProfessional ?? false);
        setBaseActive(response?.baseActive ?? false);
      },
      onError: (error) => {
        toast.error(
          getErrorMessage(error, "Erro ao verificar e-mail. Tente novamente."),
        );
      },
    });
  };

  const restartEmailCheck = () => {
    setCheckedEmail(null);
    setExistingParticipantId(null);
    checkEmail.reset();
  };

  const linkExistingParticipant = () => {
    if (!existingParticipantId) return;

    linkParticipant.mutate(
      { participantId: existingParticipantId },
      {
        onSuccess: () => {
          toast.success("Participante vinculado com sucesso.");
          reset();
          onCompleted();
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Erro ao vincular participante. Tente novamente.",
            ),
          );
        },
      },
    );
  };

  return {
    email,
    setEmail,
    step,
    existingParticipantId,
    hasBaseWithProfessional,
    baseActive,
    formInitialValues,
    isCheckingEmail: checkEmail.isPending,
    isLinkingParticipant: linkParticipant.isPending,
    verifyEmail,
    restartEmailCheck,
    linkExistingParticipant,
    reset,
  };
}
