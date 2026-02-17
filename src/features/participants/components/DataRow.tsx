import { Box, Typography } from "@/core/components/ui";

export default function DataRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Box display="flex" direction="column" gap={0.5}>
      <Typography
        variant="caption"
        className="font-medium text-muted-foreground"
      >
        {label}
      </Typography>
      <Typography variant="body" className="text-foreground">
        {value}
      </Typography>
    </Box>
  );
}
