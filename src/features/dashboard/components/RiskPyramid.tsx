import { useRef } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { Typography } from "@/core/components/ui/Typography";
import { riskColorMap, nivoTheme } from "../utils/transforms";
import { Box } from "@/core/components/ui";
import { normalizeToPercentage } from "../utils/normalize";

const keys = ["Robusto", "Pré-frágil", "Frágil"] as const;

export type RiskPyramidProps = {
  data: {
    group: string;
    Robusto: number;
    "Pré-frágil": number;
    Frágil: number;
  }[];
  isCompact?: boolean;
};

export function RiskPyramid({ data, isCompact = false }: RiskPyramidProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const normalizedData = normalizeToPercentage(data);

  return (
    <Card className="group relative h-full overflow-hidden border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/70" />

      <CardHeader
        className={`flex items-start justify-between gap-4 pb-3 pt-6 ${
          isCompact ? "flex-col" : "flex-row"
        }`}
      >
        <div>
          <Typography
            variant="caption"
            className="text-primary font-medium uppercase mb-2"
          >
            Risco por Idade
          </Typography>
          <Typography variant="caption">
            Percentual de Robusto → Pré-Frágil → Frágil em cada estrato.
          </Typography>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          ref={chartRef}
          className={`rounded-xl border border-border/60 bg-muted/20 p-2 ${
            isCompact ? "h-75" : "h-95"
          }`}
        >
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem dados para os filtros atuais.
            </div>
          ) : (
            <ResponsiveBar
              data={normalizedData}
              keys={keys as unknown as string[]}
              indexBy="group"
              layout="horizontal"
              colors={({ id }) => riskColorMap[id as keyof typeof riskColorMap]}
              theme={nivoTheme}
              margin={
                isCompact
                  ? { top: 20, right: 10, bottom: 45, left: 75 }
                  : { top: 30, right: 30, bottom: 60, left: 120 }
              }
              padding={0.3}
              innerPadding={4}
              valueFormat=".1f"
              enableGridX
              axisBottom={{
                legend: "% na amostra",
                legendOffset: isCompact ? 38 : 50,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Estrato",
                legendOffset: isCompact ? -64 : -110,
                legendPosition: "middle",
              }}
              legends={
                isCompact
                  ? []
                  : [
                      {
                        dataFrom: "keys",
                        anchor: "bottom",
                        direction: "row",
                        translateX: 0,
                        translateY: 40,
                        itemWidth: 100,
                        itemHeight: 14,
                        itemDirection: "left-to-right",
                      },
                    ]
              }
              labelSkipWidth={12}
              labelSkipHeight={12}
              tooltip={({ id, value, indexValue }) => (
                <Box
                  display="flex"
                  direction="column"
                  align="center"
                  p={5}
                  className="w-30 rounded-lg border border-border/60 bg-background shadow-md"
                >
                  <Typography color="secondary" variant="body">
                    {indexValue}
                  </Typography>
                  <Typography color="secondary" variant="small">
                    {id}: {value?.toFixed(2)}%
                  </Typography>
                </Box>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
