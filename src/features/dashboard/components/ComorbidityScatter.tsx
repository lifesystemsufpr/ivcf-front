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

  const maxAge = Math.max(
    100,
    ...data.flatMap((series) => series.data.map((d) => d.x)),
  );

  const maxScore = Math.max(
    40,
    ...data.flatMap((series) => series.data.map((d) => d.y)),
  );

  // Pre-compute max size for proportional node scaling
  const allSizes = data.flatMap((series) => series.data.map((d) => d.size ?? 1));
  const maxSize = Math.max(1, ...allSizes);
  const minNodePx = 4;
  const maxNodePx = isCompact ? 28 : 40;


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
          <Typography variant="caption">
            Cada bolha representa um paciente. <strong>Tamanho proporcional ao volume de dados</strong>{" "}
            — cor indica sexo, texto no tooltip indica risco clínico.
          </Typography>
          {/* Sex + size legend */}
          {!isCompact && (
            <div className="flex flex-wrap gap-4 mt-2">
              {data.map((s) => (
                <span key={s.id} className="flex items-center gap-1 text-xs">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.id === "Masculino" ? "#38bdf8" : "#a855f7" }}
                  />
                  {s.id}
                </span>
              ))}
              <span className="flex items-center gap-3 text-xs text-muted-foreground ml-2">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/40" /> menor volume
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded-full bg-muted-foreground/40" /> maior volume
                </span>
              </span>
            </div>
          )}
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
            // Series represent sexo (Masculino/Feminino) — the colors callback
            // only receives serieId, so we color by sex here. Risk-level
            // encoding is done through node size (heatmap proportional volume).
            colors={({ serieId }: { serieId: string | number }) =>
              serieId === "Masculino" ? "#38bdf8" : "#a855f7"
            }
            margin={
              isCompact
                ? { top: 20, right: 20, bottom: 45, left: 50 }
                : { top: 30, right: 40, bottom: 60, left: 70 }
            }
            // blendMode gives the density/heatmap overlap effect
            blendMode="multiply"
            // Node size proportional to data.size (volume), scaled to a readable px range
            nodeSize={({ data: d }: { data: any }) => {
              const raw = (d as any).size ?? 1;
              const ratio = raw / maxSize;
              return minNodePx + ratio * (maxNodePx - minNodePx);
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
              max: maxAge + 2,
            }}
            yScale={{
              type: "linear",
              min: 0,
              max: maxScore + 5,
            }}
            // No built-in legend; we render our own color legend in the header
            legends={[]}
            tooltip={({ node }: { node: any }) => {
              const d = node.data as any;
              const risk: string = d.riskLevel ?? "";
              const riskColorMap: Record<string, string> = {
                Frágil: "#ef4444",
                "Pré-frágil": "#f59e0b",
                Robusto: "#22c55e",
              };
              const riskColor = riskColorMap[risk] ?? "#94a3b8";
              const volume = d.size ?? d.count ?? d.volume;
              return (
                <div className="bg-background border border-border/50 shadow-md p-3 rounded-lg text-sm min-w-[160px]">
                  <div className="font-semibold flex items-center gap-2 mb-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: riskColor }}
                    />
                    {risk || d.sex || "Paciente"}
                  </div>
                  <div className="space-y-0.5 text-muted-foreground">
                    <div>Sexo: <span className="text-foreground font-medium">{d.sex}</span></div>
                    <div>Idade: <span className="text-foreground font-medium">{d.x} anos</span></div>
                    <div>Score IVCF-20: <span className="text-foreground font-medium">{d.y}</span></div>
                    {d.date && <div>Data: <span className="text-foreground font-medium">{d.date}</span></div>}
                    {volume !== undefined && (
                      <div className="pt-1 border-t border-border/40 mt-1 font-medium text-primary">
                        Volume: {volume} registros
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
            layers={["grid", "axes", "nodes", "mesh", "legends"]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
