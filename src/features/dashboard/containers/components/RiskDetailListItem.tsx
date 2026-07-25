import { ExternalLink } from "lucide-react";
import { Avatar, Badge, Typography } from "@/core/components/ui";
import { formatDate } from "@/core/utils";
import { riskColorMap } from "../../utils/transforms";
import type { DetailChartResponse } from "../../types";
import type { FrailtyClassification } from "@/core/types";

type RiskDetailListItemProps = {
  participant: DetailChartResponse;
  onSelect: (participantId: string) => void;
};

export function RiskDetailListItem({
  participant,
  onSelect,
}: RiskDetailListItemProps) {
  const {
    participantId,
    participantName,
    age,
    healthProfessionalName,
    score,
    classification,
    date,
  } = participant;

  const dotColor = riskColorMap[classification as FrailtyClassification];

  return (
    <button
      type="button"
      onClick={() => onSelect(participantId)}
      className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card p-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      aria-label={`Abrir perfil de ${participantName} em nova aba`}
    >
      <Avatar name={participantName} size="sm" color="primary" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Typography
            variant="body"
            className="truncate font-medium text-foreground"
          >
            {participantName}
          </Typography>
          <ExternalLink
            size={14}
            className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        </div>

        <Typography variant="caption" className="truncate">
          {age} anos
          {healthProfessionalName ? ` • ${healthProfessionalName}` : ""}
        </Typography>

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1.5 border-border/70 font-normal"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: dotColor }}
              aria-hidden
            />
            {classification}
          </Badge>
          <Typography variant="caption" className="text-muted-foreground">
            Score {score}
          </Typography>
          {date ? (
            <Typography variant="caption" className="text-muted-foreground">
              {formatDate(date, true)}
            </Typography>
          ) : null}
        </div>
      </div>
    </button>
  );
}
