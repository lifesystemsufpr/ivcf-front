import { useRef } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { Button } from "@/core/components/ui/Button";
import { Typography } from "@/core/components/ui/Typography";
import {
  exportElementAsPdf,
  exportElementAsPng,
  nivoTheme,
} from "../utils/transforms";
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
  isCompact?: boolean;
};

export function DomainHeatmap({
  data,
  stratification,
  isCompact = false,
}: DomainHeatmapProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const hasData = data.some((d) => d.data.length > 0);

  return (
    <Card className="h-full">
      <CardHeader
        className={`flex items-start justify-between gap-4 ${
          isCompact ? "flex-col" : "flex-row"
        }`}
      >
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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPng(chartRef.current, "heatmap-dominios")
            }
          >
            PNG
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPdf(chartRef.current, "heatmap-dominios")
            }
          >
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className={isCompact ? "h-80" : "h-105"}>
          {hasData ? (
            <ResponsiveHeatMap
              data={data}
              colors={heatmapColors}
              theme={nivoTheme}
              enableLabels={!isCompact}
              label={(cell) => cell.value?.toFixed(1) ?? ""}
              labelTextColor={(cell) => {
                return (cell.value ?? 0) > 2 ? "#ffffff" : "#333333";
              }}
              margin={
                isCompact
                  ? { top: 20, right: 20, bottom: 55, left: 70 }
                  : { top: 40, right: 80, bottom: 80, left: 120 }
              }
              valueFormat=".2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickRotation: isCompact ? -35 : -20,
                legend: dimensionLabel[stratification],
                legendOffset: isCompact ? 40 : 46,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Domínios",
                legendOffset: isCompact ? -56 : -90,
                legendPosition: "middle",
              }}
              legends={
                isCompact
                  ? []
                  : [
                      {
                        anchor: "bottom",
                        translateX: 0,
                        translateY: 50,
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
                    ]
              }
              emptyColor="#f5f5f5"
              inactiveOpacity={0.25}
              hoverTarget="cell"
              tooltip={({ cell }) => (
                <Box className="bg-background text-sm rounded p-3 w-40 shadow-md border">
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
