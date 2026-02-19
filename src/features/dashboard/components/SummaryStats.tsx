import { Box } from "@/core/components/ui/Box";
import { Card, CardContent } from "@/core/components/ui/Card";
import { Typography } from "@/core/components/ui/Typography";
import { riskColorMap } from "../utils/transforms";

type SummaryStatsProps = {
  total: number;
  robust: number;
  pre: number;
  fragile: number;
  avgScore: number;
  avgAge: number;
  topAgeGroups: { label: string; value: number }[];
};

export function SummaryStats({
  total,
  robust,
  pre,
  fragile,
  avgScore,
  avgAge,
  topAgeGroups,
}: SummaryStatsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption">Total na coorte</Typography>
          <Typography variant="h3">{total}</Typography>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption">Score médio</Typography>
          <Typography variant="h3">{avgScore}</Typography>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption">Idade média</Typography>
          <Typography variant="h3">{avgAge} anos</Typography>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption">Distribuição de risco</Typography>
          <Box className="mt-2 flex flex-wrap gap-2">
            <Badge color={riskColorMap.Robusto} label={`Robusto: ${robust}`} />
            <Badge
              color={riskColorMap["Pre-Fragil"]}
              label={`Pré-Frágil: ${pre}`}
            />
            <Badge color={riskColorMap.Fragil} label={`Frágil: ${fragile}`} />
          </Box>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Typography variant="caption">
            Faixas etárias predominantes
          </Typography>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {topAgeGroups.length === 0 && <li>N/A</li>}
            {topAgeGroups.map((group) => (
              <li key={group.label}>
                {group.label}: {group.value}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
