import { Alert, Box, Button, Input, Typography } from "@/core/components/ui";
import { HistoricoBaseSetup } from "../features/historico-base";

interface ParticipantEmailCheckStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onVerifyEmail: () => void;
  isCheckingEmail: boolean;
  existingParticipantId: string | null;
  onSuccess?: () => void;
}

export function ParticipantEmailCheckStep({
  email,
  onEmailChange,
  onVerifyEmail,
  isCheckingEmail,
  existingParticipantId,
  onSuccess,
}: ParticipantEmailCheckStepProps) {
  return (
    <Box display="flex" direction="column" gap={4}>
      <Typography variant="body">
        Antes de cadastrar, verifique se o participante já existe pelo e-mail.
      </Typography>

      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          onVerifyEmail();
        }}
      >
        <Input
          id="participant-check-email"
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          disabled={isCheckingEmail}
          required
        />
        <Button
          type="submit"
          loading={isCheckingEmail}
          disabled={isCheckingEmail}
        >
          Verificar e-mail
        </Button>
      </form>

      {existingParticipantId && (
        <Alert className="space-y-3 border-warning bg-warning/10 text-foreground">
          <Typography variant="body" className="font-semibold">
            Participante já cadastrado
          </Typography>

          <HistoricoBaseSetup
            participantId={existingParticipantId}
            onBaseCreated={onSuccess}
          />
        </Alert>
      )}
    </Box>
  );
}
