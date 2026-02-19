import { useRef } from "react";
import { ResponsiveBar } from "@nivo/bar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/Card";
import { Button } from "@/core/components/ui/Button";
import { Typography } from "@/core/components/ui/Typography";
import {
  riskColorMap,
  nivoTheme,
  exportElementAsPdf,
  exportElementAsPng,
} from "../utils/transforms";

const keys = ["Robusto", "Pre-Fragil", "Fragil"] as const;

type RiskPyramidProps = {
  data: {
    group: string;
    Robusto: number;
    "Pre-Fragil": number;
    Fragil: number;
  }[];
};

export function RiskPyramid({ data }: RiskPyramidProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Pirâmide de risco</CardTitle>
          <Typography variant="small">
            Percentual de Robusto → Pré-Frágil → Frágil em cada estrato.
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPng(chartRef.current, "piramide-risco")
            }
          >
            PNG
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPdf(chartRef.current, "piramide-risco")
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
            <ResponsiveBar
              data={data}
              keys={keys as unknown as string[]}
              indexBy="group"
              layout="horizontal"
              colors={({ id }) => riskColorMap[id as keyof typeof riskColorMap]}
              theme={nivoTheme}
              margin={{ top: 30, right: 30, bottom: 60, left: 120 }}
              padding={0.3}
              innerPadding={4}
              valueFormat=".1f"
              enableGridX
              axisBottom={{
                legend: "% na coorte",
                legendOffset: 50,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Estrato",
                legendOffset: -110,
                legendPosition: "middle",
              }}
              legends={[
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
              ]}
              labelSkipWidth={12}
              labelSkipHeight={12}
              tooltip={({ id, value, indexValue }) => (
                <div className="text-sm">
                  <strong>{indexValue}</strong>
                  <div>
                    {id}: {value}%
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
