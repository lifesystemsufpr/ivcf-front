import { useMemo, useRef } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { Typography } from "@/core/components/ui/Typography";
import { nivoTheme } from "../utils/transforms";
import type { AggregationDimension } from "../types";
import { Box } from "@/core/components/ui";

const heatmapColors = {
  type: "sequential" as const,
  scheme: "yellow_orange_red" as const,
};

const dimensionLabel: Record<AggregationDimension, string> = {
  sex: "Sexo",
  ageGroup: "Faixa etária",
};

type DomainHeatmapProps = {
  data: { id: string; data: { x: string; y: number }[] }[];
  stratification: AggregationDimension;
};

export function DomainHeatmap({ data, stratification }: DomainHeatmapProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const hasData = data.some((d) => d.data.length > 0);
  const labelColorThreshold = useMemo(() => {
    const values = data.flatMap((serie) => serie.data.map((point) => point.y));
    if (!values.length) return 0;

    const min = Math.min(...values);
    const max = Math.max(...values);

    // Usa o ponto médio do intervalo atual para manter contraste consistente.
    return min + (max - min) / 2;
  }, [data]);

  return (
    <Card className="group relative h-full overflow-hidden border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/70" />

      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3 pt-6">
        <div>
          <Typography
            variant="caption"
            className="text-primary font-medium uppercase mb-2"
          >
            Heatmap por domínio
          </Typography>
          <Typography variant="caption">
            Médias de score por domínio estratificadas por{" "}
            {dimensionLabel[stratification]}.
          </Typography>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          ref={chartRef}
          className="h-105 rounded-xl border border-border/60 bg-muted/20 p-2"
        >
          {hasData ? (
            <ResponsiveHeatMap
              data={data}
              colors={heatmapColors}
              theme={nivoTheme}
              enableLabels={true}
              label={(cell) => cell.value?.toFixed(1) ?? ""}
              labelTextColor={(cell) => {
                return (cell.value ?? 0) > labelColorThreshold
                  ? "#ffffff"
                  : "#333333";
              }}
              margin={{ top: 40, right: 80, bottom: 100, left: 120 }}
              valueFormat=".2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickRotation: -20,
                legend: dimensionLabel[stratification],
                legendOffset: 30,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Domínios",
                tickRotation: 35,
                legendOffset: -90,
                legendPosition: "middle",
              }}
              legends={[
                {
                  anchor: "bottom",
                  translateX: 0,
                  translateY: 70,
                  length: 240,
                  thickness: 10,
                  direction: "row",
                  tickPosition: "after",
                  tickSize: 6,
                  tickSpacing: 4,
                  tickOverlap: false,
                  title: "Score médio →",
                  titleAlign: "start",
                  titleOffset: 4,
                },
              ]}
              emptyColor="#f5f5f5"
              inactiveOpacity={0.25}
              hoverTarget="cell"
              tooltip={({ cell }) => (
                <Box className="w-40 rounded-lg border border-border/60 bg-background p-3 text-sm shadow-md">
                  <div>
                    {/* Acessamos cell.data.x para pegar o valor real da string do eixo X */}
                    <strong>{dimensionLabel[stratification]}:</strong>{" "}
                    {cell.data.x}
                  </div>
                  <div>
                    <strong>Domínio:</strong> {cell.serieId}
                  </div>
                  <div>
                    <strong>Score médio:</strong> {cell.value?.toFixed(1)}
                  </div>
                </Box>
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem dados para os filtros atuais.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
