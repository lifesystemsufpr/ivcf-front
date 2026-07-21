import { useMemo, useRef } from "react";
import {
  ResponsiveScatterPlot,
  ResponsiveScatterPlotCanvas,
} from "@nivo/scatterplot";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { Typography } from "@/core/components/ui/Typography";
import { useTheme } from "@/core/theme/ThemeContext";
import { nivoTheme } from "../utils/transforms";
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
  const { theme } = useTheme();
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

  const sexPalette =
    theme === "dark"
      ? {
          male: "#60a5fa",
          female: "#f59e0b",
        }
      : {
          male: "#2563eb",
          female: "#ea580c",
        };

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
            Idade × fragilidade
          </Typography>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          ref={chartRef}
          className={`rounded-xl border border-border/60 bg-muted/20 p-2 ${
            isCompact ? "h-80" : "h-105"
          }`}
        >
          <ChartComponent
            data={data}
            theme={nivoTheme}
            colors={(series) => {
              const sexLabel = String(series.serieId).toLowerCase();
              const isMale = sexLabel.startsWith("m");
              return isMale ? sexPalette.male : sexPalette.female;
            }}
            margin={
              isCompact
                ? { top: 20, right: 20, bottom: 45, left: 50 }
                : { top: 30, right: 40, bottom: 60, left: 70 }
            }
            blendMode="multiply"
            nodeSize={isCompact ? 8 : 10}
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
                className="w-35 rounded-lg border border-border/60 bg-background shadow-md"
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
