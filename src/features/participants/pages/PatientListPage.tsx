import {
  Alert,
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  Separator,
  Typography,
} from "@/core/components/ui";
import ParticipantAutocomplete from "../components/ParticipantAutocomplete";
import ParticipantForm from "../components/ParticipantForm";
import { ParticipantProvider } from "../context/ParticipantContext";
import ParticipantList from "../containers/ParticipantsList";
import type { Participant, ParticipantRequest } from "../types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCreateParticipant } from "../hooks/useCreateParticipant";
import { useCheckParticipantEmail } from "../hooks/useCheckParticipantEmail";
import { useLinkParticipantToProfessional } from "../hooks/useLinkParticipantToProfessional";
import { Bounce, toast } from "react-toastify";

export function PatientListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [emailToCheck, setEmailToCheck] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [existingParticipantId, setExistingParticipantId] = useState<
    string | null
  >(null);
  const [createInitialValues, setCreateInitialValues] = useState<
    Partial<Participant> | undefined
  >(undefined);

  const createParticipant = useCreateParticipant();
  const checkParticipantEmail = useCheckParticipantEmail();
  const linkParticipantToProfessional = useLinkParticipantToProfessional();

  const shouldShowForm = emailChecked && !existingParticipantId;

  const resetCreateFlow = () => {
    setEmailToCheck("");
    setEmailChecked(false);
    setExistingParticipantId(null);
    setCreateInitialValues(undefined);
    checkParticipantEmail.reset();
    linkParticipantToProfessional.reset();
  };

  const handleOpenCreateModal = () => {
    resetCreateFlow();
    setIsCreateOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateOpen(false);
    resetCreateFlow();
  };

  const handleVerifyEmail = () => {
    const normalizedEmail = emailToCheck.trim();

    if (!normalizedEmail) {
      toast.error("Informe um e-mail para verificar.", {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    checkParticipantEmail.mutate(normalizedEmail, {
      onSuccess: (response) => {
        setEmailChecked(true);
        const participantId = response?.participantId ?? null;
        setExistingParticipantId(participantId);

        if (participantId) {
          return;
        }

        setCreateInitialValues({
          email: normalizedEmail,
        });
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao verificar e-mail. Tente novamente.";
        toast.error(message, {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      },
    });
  };

  const handleUseAnotherEmail = () => {
    setEmailChecked(false);
    setExistingParticipantId(null);
    setCreateInitialValues(undefined);
    checkParticipantEmail.reset();
  };

  const handleLinkExistingParticipant = () => {
    if (!existingParticipantId) return;

    linkParticipantToProfessional.mutate(
      { participantId: existingParticipantId },
      {
        onSuccess: () => {
          toast.success("Participante vinculado com sucesso.", {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          handleCloseCreateModal();
        },
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Erro ao vincular participante. Tente novamente.";
          toast.error(message, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        },
      },
    );
  };

  const handleCreateParticipant = (data: ParticipantRequest) => {
    createParticipant.mutate(data, {
      onSuccess: () => {
        handleCloseCreateModal();
      },
    });
  };

  return (
    <ParticipantProvider>
      <Box type="screen" className="flex flex-col">
        <Box
          display="flex"
          direction="row"
          justify="space-between"
          align="center"
        >
          <Typography variant="h1">Lista de Participantes</Typography>
        </Box>
        <Separator className="mt-3 mb-3" />
        <Box
          className="flex-1 overflow-y-auto pr-2 scrollbar-thin 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-slate-300
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
        >
          <ParticipantList />
        </Box>
        <Box className="self-end radius-full absolute bottom-10 right-10">
          <IconButton
            variant="accent"
            icon={Plus}
            ariaLabel="Adicionar participante"
            onClick={handleOpenCreateModal}
          />
        </Box>

        <Modal
          open={isCreateOpen}
          onClose={handleCloseCreateModal}
          title="Cadastrar participante"
          description="Preencha os dados para adicionar um novo participante."
          size="lg"
        >
          {!shouldShowForm && (
            <Box display="flex" direction="column" gap={4}>
              <Typography variant="body">
                Antes de cadastrar, verifique se o participante já existe pelo
                e-mail.
              </Typography>

              <form
                className="flex flex-col gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleVerifyEmail();
                }}
              >
                <Input
                  id="participant-check-email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={emailToCheck}
                  onChange={(event) => setEmailToCheck(event.target.value)}
                  disabled={checkParticipantEmail.isPending}
                  required
                />
                <Button
                  type="submit"
                  loading={checkParticipantEmail.isPending}
                  disabled={checkParticipantEmail.isPending}
                >
                  Verificar e-mail
                </Button>
              </form>

              {existingParticipantId && (
                <Alert className="space-y-3 border-warning bg-warning/10 text-foreground">
                  <Typography variant="body" className="font-semibold">
                    Participante já cadastrado
                  </Typography>
                  <Typography variant="caption">
                    Encontramos o participante com ID: {existingParticipantId}
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleLinkExistingParticipant}
                      loading={linkParticipantToProfessional.isPending}
                      disabled={linkParticipantToProfessional.isPending}
                    >
                      Vincular participante
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUseAnotherEmail}
                      disabled={linkParticipantToProfessional.isPending}
                    >
                      Usar outro e-mail
                    </Button>
                  </div>
                </Alert>
              )}

              {emailChecked && !existingParticipantId && (
                <Alert className="border-success bg-success/10 text-foreground">
                  E-mail disponível. Continue para o cadastro do participante.
                </Alert>
              )}
            </Box>
          )}

          {shouldShowForm && (
            <ParticipantForm
              initialValues={createInitialValues}
              onSubmit={handleCreateParticipant}
              onCancel={handleCloseCreateModal}
            />
          )}
        </Modal>
      </Box>
    </ParticipantProvider>
  );
}
