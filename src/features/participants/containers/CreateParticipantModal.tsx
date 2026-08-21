import { Modal } from "@/core/components/ui";
import { ParticipantEmailCheckStep } from "../components/ParticipantEmailCheckStep";
import { useCreateParticipantFlow } from "../hooks/useCreateParticipantFlow";
import ParticipantForm from "./ParticipantForm";

interface CreateParticipantModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateParticipantModal({
  open,
  onClose,
}: CreateParticipantModalProps) {
  const {
    email,
    setEmail,
    step,
    existingParticipantId,
    baseActive,
    hasBaseWithProfessional,
    formInitialValues,
    isCheckingEmail,
    verifyEmail,
    reset,
  } = useCreateParticipantFlow({ onCompleted: onClose });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Cadastrar participante"
      description="Preencha os dados para adicionar um novo participante."
      size="lg"
    >
      {step === "CHECK_EMAIL" ? (
        <ParticipantEmailCheckStep
          email={email}
          onEmailChange={setEmail}
          onVerifyEmail={verifyEmail}
          isCheckingEmail={isCheckingEmail}
          existingParticipantId={existingParticipantId}
          hasBaseWithProfessional={hasBaseWithProfessional}
          baseActive={baseActive}
          onSuccess={handleClose}
        />
      ) : (
        <ParticipantForm
          initialValues={formInitialValues}
          onCancel={handleClose}
        />
      )}
    </Modal>
  );
}
