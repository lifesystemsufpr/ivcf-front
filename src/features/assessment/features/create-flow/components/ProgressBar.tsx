import { Box, Typography } from "@/core/components/ui";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const safeTotal = total > 0 ? total : 1;
  const percentage = Math.min(Math.max((current / safeTotal) * 100, 0), 100);

  return (
    <Box className="w-full space-y-2">
      <Box className="flex items-center justify-between">
        <Typography variant="small">Questão {current} de {total}</Typography>
        <Typography variant="small">{Math.round(percentage)}%</Typography>
      </Box>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          role="progressbar"
        />
      </div>
    </Box>
  );
}
