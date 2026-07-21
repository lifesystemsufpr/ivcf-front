import { useRef } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { Button } from "@/core/components/ui/Button";
import { Typography } from "@/core/components/ui/Typography";
import {
  exportElementAsPdf,
  exportElementAsPng,
  nivoTheme,
} from "../utils/transforms";

type FragilityTrendProps = {
  data: { id: string; data: { x: string; y: number }[] }[];
  bySex: boolean;
};

export function FragilityTrend({ data, bySex }: FragilityTrendProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <Typography
            variant="caption"
            className="text-primary font-medium uppercase mb-2"
          >
            Evolução temporal
          </Typography>
          <Typography variant="caption">
            {bySex
              ? "Média diária por sexo na coorte"
              : "Média diária da coorte (trajetória populacional)"}
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPng(chartRef.current, "tendencia-fragilidade")
            }
          >
            PNG
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPdf(chartRef.current, "tendencia-fragilidade")
            }
          >
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="h-95">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem dados para os filtros atuais.
            </div>
          ) : (
            <ResponsiveLine
              data={data}
              theme={nivoTheme}
              margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
              curve="monotoneX"
              colors={{ scheme: "set2" }}
              lineWidth={3}
              enablePoints
              pointSize={8}
              enableArea
              areaOpacity={0.08}
              axisBottom={{
                tickRotation: -25,
                legend: "Data (coorte)",
                legendOffset: 46,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Score médio IVCF-20",
                legendOffset: -46,
                legendPosition: "middle",
              }}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  translateX: 30,
                  translateY: 0,
                  itemWidth: 100,
                  itemHeight: 16,
                },
              ]}
              tooltip={({ point }) => (
                <div className="text-sm">
                  <div className="font-semibold">{point.seriesId}</div>
                  <div>Data: {point.data.xFormatted}</div>
                  <div>Score: {point.data.yFormatted}</div>
                </div>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
