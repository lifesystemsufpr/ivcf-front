import { useMemo, useRef } from "react";
import {
  ResponsiveScatterPlot,
  ResponsiveScatterPlotCanvas,
} from "@nivo/scatterplot";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/Card";
import { Button } from "@/core/components/ui/Button";
import { Typography } from "@/core/components/ui/Typography";
import {
  exportElementAsPdf,
  exportElementAsPng,
  nivoTheme,
} from "../utils/transforms";

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
};

export function ComorbidityScatter({ data }: ComorbidityScatterProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const useCanvas =
    data.reduce((acc, series) => acc + series.data.length, 0) > 5000;

  const ChartComponent = useMemo(
    () => (useCanvas ? ResponsiveScatterPlotCanvas : ResponsiveScatterPlot),
    [useCanvas],
  );

  const maxComorbidity = Math.max(
    5,
    ...data.flatMap((series) => series.data.map((d) => d.x)),
  );
  const maxScore = Math.max(
    20,
    ...data.flatMap((series) => series.data.map((d) => d.y)),
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Comorbidades × fragilidade</CardTitle>
          <Typography variant="small">
            Correlação entre número de doenças crônicas e score total (tamanho
            reflete idade).
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
        <div ref={chartRef} className="h-105">
          <ChartComponent
            data={data}
            theme={nivoTheme}
            colors={(series) =>
              data.find((d) => d.id === series.serieId)?.color ?? "#000000"
            }
            margin={{ top: 30, right: 40, bottom: 60, left: 70 }}
            blendMode="multiply"
            nodeSize={({ data }) => data.size}
            axisBottom={{
              legend: "Número de comorbidades crônicas",
              legendOffset: 42,
              legendPosition: "middle",
              tickSize: 6,
            }}
            axisLeft={{
              legend: "Score total IVCF-20",
              legendOffset: -56,
              legendPosition: "middle",
              tickSize: 6,
            }}
            xScale={{
              type: "linear",
              min: 0,
              max: maxComorbidity + 1,
              stacked: false,
            }}
            yScale={{ type: "linear", min: 0, max: maxScore + 5 }}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                translateX: 30,
                translateY: 0,
                itemWidth: 80,
                itemHeight: 18,
              },
            ]}
            tooltip={({ node }) => (
              <div className="text-sm">
                <div className="font-semibold">Sexo: {node.data.sex}</div>
                <div>Idade: {node.data.age} anos</div>
                <div>Comorbidades: {node.data.x}</div>
                <div>Score total: {node.data.y}</div>
                <div>Risco: {node.data.riskLevel}</div>
                <div>Data: {node.data.date}</div>
              </div>
            )}
            layers={["grid", "axes", "nodes", "mesh", "legends"]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
