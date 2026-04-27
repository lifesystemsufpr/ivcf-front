import { useMemo, useRef } from "react";
import {
  ResponsiveScatterPlot,
  ResponsiveScatterPlotCanvas,
} from "@nivo/scatterplot";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { Button } from "@/core/components/ui/Button";
import { Typography } from "@/core/components/ui/Typography";
import {
  exportElementAsPdf,
  exportElementAsPng,
  nivoTheme,
} from "../utils/transforms";
import { Box } from "@/core/components/ui";

type ComorbidityScatterProps = {
  data: {
    id: string;
    color: string;
    data: {
      x: number;
      y: number;
      size: number;
      age: number;
      sex: string;
      riskLevel: string;
      date: string;
    }[];
  }[];
  isCompact?: boolean;
};

export function ComorbidityScatter({
  data,
  isCompact = false,
}: ComorbidityScatterProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const useCanvas =
    data.reduce((acc, series) => acc + series.data.length, 0) > 5000;

  const ChartComponent = useMemo(
    () => (useCanvas ? ResponsiveScatterPlotCanvas : ResponsiveScatterPlot),
    [useCanvas],
  );

  const maxAge = 100;

  const maxScore = Math.max(
    40,
    ...data.flatMap((series) => series.data.map((d) => d.y)),
  );

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
            Idade × fragilidade
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPng(chartRef.current, "comorbidades-scatter")
            }
          >
            PNG
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPdf(chartRef.current, "comorbidades-scatter")
            }
          >
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className={isCompact ? "h-80" : "h-105"}>
          <ChartComponent
            data={data}
            theme={nivoTheme}
            colors={(series) =>
              series.serieId === "Masculino" ? "#38bdf8" : "#a855f7"
            }
            margin={
              isCompact
                ? { top: 20, right: 20, bottom: 45, left: 50 }
                : { top: 30, right: 40, bottom: 60, left: 70 }
            }
            blendMode="multiply"
            nodeSize={({ data }) => {
              if (data.size) return data.size;
              const sizeMap: Record<string, number> = {
                Frágil: 16,
                "Pré-frágil": 10,
                Robusto: 6,
              };
              return sizeMap[data.riskLevel] ?? 10;
            }}
            axisBottom={{
              legend: "Idade (anos)",
              legendOffset: isCompact ? 32 : 42,
              legendPosition: "middle",
              tickSize: 6,
            }}
            axisLeft={{
              legend: "Score total IVCF-20",
              legendOffset: isCompact ? -44 : -56,
              legendPosition: "middle",
              tickSize: 6,
            }}
            xScale={{
              type: "linear",
              min: 60,
              max: maxAge,
            }}
            yScale={{
              type: "linear",
              min: 0,
              max: maxScore + 5,
            }}
            legends={
              isCompact
                ? []
                : [
                    {
                      anchor: "bottom-right",
                      direction: "column",
                      translateX: 30,
                      translateY: 0,
                      itemWidth: 80,
                      itemHeight: 18,
                    },
                  ]
            }
            tooltip={({ node }) => (
              <Box
                display="flex"
                direction="column"
                align="center"
                p={5}
                className="bg-background rounded w-35 border"
              >
                <div className="font-semibold">Sexo: {node.data.sex}</div>
                <div>Idade: {node.data.x} anos</div>
                <div>Score total: {node.data.y}</div>
                <div>Risco: {node.data.riskLevel}</div>
              </Box>
            )}
            layers={["grid", "axes", "nodes", "mesh", "legends"]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
