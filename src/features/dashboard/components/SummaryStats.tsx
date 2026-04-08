import { Users, UserCheck, BarChart3, Calendar, PieChart } from "lucide-react";

import { Card, CardContent } from "@/core/components/ui/Card";
import { Typography } from "@/core/components/ui/Typography";
import type { SummaryStats } from "../types";

type SummaryStatsProps = {
  summary: SummaryStats;
};

function StatCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        <div
          className={`p-3 rounded-xl ${
            highlight
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon size={22} />
        </div>

        <div className="flex flex-col">
          <Typography variant="caption" className="text-muted-foreground">
            {label}
          </Typography>
          <Typography variant="h3" className="leading-tight">
            {value}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryStats({ summary }: SummaryStatsProps) {
  const { totalParticipants, totalEvaluated, avgScore, avgAge, topAgeGroups } =
    summary;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Participantes */}
      <StatCard
        icon={Users}
        label="Total de Participantes"
        value={totalParticipants ?? 0}
      />

      {/* Avaliados */}
      <StatCard
        icon={UserCheck}
        label="Participantes Avaliados"
        value={totalEvaluated ?? 0}
      />

      {/* Score */}
      <StatCard
        icon={BarChart3}
        label="Score médio"
        value={avgScore ?? 0}
        highlight
      />

      {/* Idade */}
      <StatCard
        icon={Calendar}
        label="Idade média"
        value={`${avgAge ?? 0} anos`}
        highlight
      />

      {/* Faixa etária */}
      <Card className="shadow-sm sm:col-span-2 xl:col-span-4">
        <CardContent className="p-4 flex gap-4">
          <div className="p-3 rounded-xl bg-muted text-muted-foreground h-fit">
            <PieChart size={22} />
          </div>

          <div className="flex-1">
            <Typography variant="caption" className="text-muted-foreground">
              Faixas etárias predominantes
            </Typography>

            <ul className="mt-2 space-y-1">
              {topAgeGroups.length === 0 && (
                <Typography variant="small">N/A</Typography>
              )}

              {topAgeGroups.map((group) => (
                <li key={group.label}>
                  <Typography variant="small" className="font-medium">
                    {group.label}: {group.value}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
