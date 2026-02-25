import { Card, CardContent } from "@/core/components/ui/Card";
import { Typography } from "@/core/components/ui/Typography";
import type { SummaryStats } from "../types";

type SummaryStatsProps = {
  summary: SummaryStats;
};

export function SummaryStats({ summary }: SummaryStatsProps) {
  const { total, avgScore, avgAge, topAgeGroups } = summary;

  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption">Total na coorte</Typography>
          <Typography variant="h3">{total}</Typography>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption" color="primary">
            Score médio
          </Typography>
          <Typography variant="h3">{avgScore}</Typography>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption" color="primary">
            Idade média
          </Typography>
          <Typography variant="h3">{avgAge} anos</Typography>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption" color="primary">
            Faixas etárias predominantes
          </Typography>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {topAgeGroups.length === 0 && <li>N/A</li>}
            {topAgeGroups.map((group) => (
              <li key={group.label}>
                <Typography variant="small" className="font-medium">
                  {group.label}: {group.value}
                </Typography>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
