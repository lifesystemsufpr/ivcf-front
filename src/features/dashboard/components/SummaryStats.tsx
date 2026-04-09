import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  PieChart,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/core/components/ui/Card";
import { Typography } from "@/core/components/ui/Typography";
import type { SummaryStats } from "../types";
import { getSummaryInsights } from "../utils/summaryInsights";

type SummaryStatsProps = {
  summary: SummaryStats;
};

function StatCard({
  icon: Icon,
  label,
  value,
  insight,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  insight: string;
  highlight?: boolean;
}) {
  return (
    <Card
      className={`group relative overflow-hidden border transition-all duration-300 ${
        highlight
          ? "border-primary/20 bg-linear-to-br from-primary/8 via-card to-card shadow-sm"
          : "border-border/70 bg-card shadow-sm"
      } h-full hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${
          highlight ? "bg-primary/80" : "bg-muted"
        }`}
      />

      <CardContent className="flex h-full flex-col justify-between gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`rounded-lg p-2 ${
              highlight
                ? "bg-primary/15 text-primary"
                : "bg-muted/80 text-muted-foreground"
            }`}
          >
            <Icon size={18} />
          </div>

          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
              highlight
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <ArrowUpRight size={10} />
            Indicador
          </span>
        </div>

        <div className="flex flex-col flex-1 gap-3">
          <Typography
            variant="caption"
            className="text-muted-foreground/90 uppercase tracking-wide text-[10px]"
          >
            {label}
          </Typography>

          <Typography variant="h3" className="leading-tight text-xl">
            {value}
          </Typography>

          <Typography
            variant="small"
            className="line-clamp-2 text-xs leading-snug text-muted-foreground"
          >
            {insight}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryStats({ summary }: SummaryStatsProps) {
  const { totalParticipants, totalEvaluated, avgScore, avgAge, topAgeGroups } =
    summary;
  const insights = getSummaryInsights(summary);

  return (
    <section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 items-stretch">
        <StatCard
          icon={Users}
          label="Total de Participantes"
          value={totalParticipants ?? 0}
          insight={insights.participants.message}
        />

        <StatCard
          icon={UserCheck}
          label="Participantes Avaliados"
          value={totalEvaluated ?? 0}
          insight={insights.evaluated.message}
        />

        <StatCard
          icon={BarChart3}
          label="Score médio"
          value={avgScore ?? 0}
          insight={insights.avgScore.message}
        />

        <StatCard
          icon={Calendar}
          label="Idade média"
          value={`${avgAge ?? 0} anos`}
          insight={insights.avgAge.message}
        />

        <Card className="h-full border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg col-span-2 sm:col-span-1">
          <CardContent className="flex h-full flex-col gap-3 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-muted/80 p-2 text-muted-foreground">
                <PieChart size={18} />
              </div>

              <Typography
                variant="caption"
                className="text-muted-foreground uppercase tracking-wide text-[10px]"
              >
                Faixas etárias
              </Typography>
            </div>

            <ul className="flex flex-col gap-1.5">
              {topAgeGroups.length === 0 && (
                <li className="rounded-md border border-dashed border-border p-2">
                  <Typography variant="small" className="text-muted-foreground">
                    N/A
                  </Typography>
                </li>
              )}

              {topAgeGroups.slice(0, 3).map((group) => (
                <li
                  key={group.label}
                  className="flex items-center justify-between rounded-md border border-border/70 bg-muted/40 px-2 py-1.5"
                >
                  <Typography variant="small" className="font-medium text-xs">
                    {group.label}
                  </Typography>

                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {group.value}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
