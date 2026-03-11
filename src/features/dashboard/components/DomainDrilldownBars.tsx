import { useState, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { Button } from "@/core/components/ui/Button";
import { Typography } from "@/core/components/ui/Typography";
import { nivoTheme } from "../utils/transforms";
import type { DrilldownNode } from "../types";

type ViewLevel = {
  data: any[];
  title: string;
  parentId: string | null;
};

export function DomainDrilldownBars({
  fullData,
}: {
  fullData: DrilldownNode[];
}) {
  const [history, setHistory] = useState<ViewLevel[]>([
    { data: fullData, title: "Visão Geral por Domínio", parentId: null },
  ]);

  const currentView = history[history.length - 1];

  const chartData = useMemo(
    () =>
      currentView.data.map((node) => ({
        id: node.id,
        label: node.label,
        Sim: node.counts.sim,
        Não: node.counts.nao,
        children: node.children,
      })),
    [currentView],
  );

  const handleDrillDown = (bar: any) => {
    const selectedNode = currentView.data.find((n) => n.id === bar.data.id);
    if (selectedNode?.children) {
      setHistory((prev) => [
        ...prev,
        {
          data: selectedNode.children!,
          title: `Detalhes: ${selectedNode.label}`,
          parentId: selectedNode.id,
        },
      ]);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const dynamicPadding = chartData.length < 3 ? 0.8 : 0.3;
  return (
    <Card className="h-125">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Typography
            variant="caption"
            className="text-primary font-medium uppercase"
          >
            {currentView.title}
          </Typography>
        </div>
        {history.length > 1 && (
          <Button variant="outline" size="sm" onClick={handleBack}>
            ← Voltar
          </Button>
        )}
      </CardHeader>
      <CardContent className="h-100">
        <ResponsiveBar
          data={chartData}
          keys={["Sim", "Não"]}
          indexBy="label"
          margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
          valueScale={{ type: "linear" }}
          colors={{ scheme: "set2" }}
          theme={nivoTheme}
          padding={dynamicPadding}
          axisBottom={{
            tickRotation: -10,
            legend: "Categorias/Questões",
            legendPosition: "middle",
            legendOffset: 60,
          }}
          onClick={handleDrillDown}
          labelSkipHeight={12}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              translateX: 120,
              itemWidth: 100,
              itemHeight: 20,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
