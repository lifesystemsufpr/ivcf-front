import { Card, CardContent, Typography } from "@/core/components/ui";
import type { IVCF_Assessment } from "../types";
import { formatDateTime } from "@/core/utils";
import { classificationStyles } from "@/core/consts/ivcf.consts";

interface LastIndicatorsProps {
  lastIndicator: IVCF_Assessment;
}

export default function LastIndicators({ lastIndicator }: LastIndicatorsProps) {
  const riskLevelStyle =
    classificationStyles[lastIndicator.riskLevel] ||
    "bg-gray-200 text-gray-800";

  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-3">
      <Card className={`shadow-sm ${riskLevelStyle.border} border-2`}>
        <CardContent className="p-4">
          <Typography variant="caption">Grupo de risco</Typography>
          <Typography variant="h3" className={`${riskLevelStyle.text}`}>
            {lastIndicator.riskLevel}
          </Typography>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption">Ultima pontuação</Typography>
          <Typography variant="h3">{lastIndicator.totalScore}</Typography>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption">Última avaliação</Typography>
          <Typography variant="h3">
            {formatDateTime(lastIndicator.date)}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
