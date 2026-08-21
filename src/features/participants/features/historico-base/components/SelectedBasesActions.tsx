import { Box, Button, Typography } from "@/core/components/ui";

interface SelectedBasesActionsProps {
  selectedCount: number;
  onRequest: () => void;
  isRequesting: boolean;
  disabled?: boolean;
}

export function SelectedBasesActions({
  selectedCount,
  onRequest,
  isRequesting,
  disabled,
}: SelectedBasesActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <Box
      display="flex"
      direction="row"
      justify="space-between"
      align="center"
      gap={12}
      className="flex-wrap"
    >
      <Typography variant="caption" className="text-gray-500">
        {selectedCount === 1
          ? "1 base selecionada"
          : `${selectedCount} bases selecionadas`}
      </Typography>

      <Button
        type="button"
        onClick={onRequest}
        loading={isRequesting}
        disabled={disabled ?? isRequesting}
      >
        Solicitar acesso à seleção
      </Button>
    </Box>
  );
}
