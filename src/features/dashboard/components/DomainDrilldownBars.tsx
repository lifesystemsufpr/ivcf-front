import { useState, useMemo, useRef, useEffect } from "react";
import { Bar } from "@nivo/bar";
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

const BAR_WIDTH = 70;
const NUM_KEYS = 2;
const CHART_HEIGHT = 400;
const MARGIN = { top: 20, right: 140, bottom: 80, left: 60 };
const MIN_PADDING = 0.15;

export function DomainDrilldownBars({
  fullData,
}: {
  fullData: DrilldownNode[];
}) {
  const [history, setHistory] = useState<ViewLevel[]>([
    { data: fullData, title: "Visão Geral por Domínio", parentId: null },
  ]);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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

  const innerWidth = containerWidth - MARGIN.left - MARGIN.right;
  const numGroups = chartData.length;

  const idealPadding =
    numGroups > 0 && innerWidth > 0
      ? 1 - (BAR_WIDTH * NUM_KEYS * numGroups) / innerWidth
      : MIN_PADDING;

  const needsScroll = idealPadding < MIN_PADDING;

  const fixedGroupWidth = (BAR_WIDTH * NUM_KEYS) / (1 - MIN_PADDING);
  const scrollWidth = MARGIN.left + MARGIN.right + numGroups * fixedGroupWidth;

  const chartWidth = needsScroll ? scrollWidth : containerWidth;
  const padding = needsScroll
    ? MIN_PADDING
    : Math.max(idealPadding, MIN_PADDING);

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

      <CardContent className="h-100 overflow-x-auto overflow-y-hidden">
        <div ref={containerRef} className="w-full h-full">
          {containerWidth > 0 && (
            <div style={{ width: chartWidth, height: CHART_HEIGHT }}>
              <Bar
                width={chartWidth}
                height={CHART_HEIGHT}
                data={chartData}
                keys={["Sim", "Não"]}
                indexBy="label"
                margin={MARGIN}
                valueScale={{ type: "linear" }}
                colors={{ scheme: "set2" }}
                theme={nivoTheme}
                padding={padding}
                groupMode="grouped"
                axisBottom={{
                  tickRotation: -4,
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
