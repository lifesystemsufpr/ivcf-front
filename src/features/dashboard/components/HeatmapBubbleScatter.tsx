import { useCallback, useMemo, useRef, useState } from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";

import { Box } from "@/core/components/ui";
import { Button } from "@/core/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { Typography } from "@/core/components/ui/Typography";
import {
  exportElementAsPdf,
  exportElementAsPng,
  nivoTheme,
} from "../utils/transforms";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScatterSerieData {
  x: number;
  y: number;
  size: number;
  age: number;
  sex: string;
  riskLevel: string;
  date: string;
}

export interface ScatterSerie {
  id: string;
  color: string;
  data: ScatterSerieData[];
}

type HeatmapBubbleScatterProps = {
  data: ScatterSerie[];
  isCompact?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const AGE_BIN_SIZE = 10;
const SCORE_BIN_SIZE = 10;
const MIN_BUBBLE_RADIUS = 8;
const MAX_BUBBLE_RADIUS = 36;

/**
 * Professional sequential blue scale for analytics
 * light (1 test) -> dark (max tests)
 */
const FILL_SCALE = [
  "#E0F7FA", // Ciano ultra claro
  "#B2EBF2", // Ciano claro
  "#80DEEA", // Ciano
  "#4DD0E1", // Ciano médio
  "#26C6DA", // Ciano forte
  "#00ACC1", // Ciano escuro
  "#0097A7", // Ciano profundo
] as const;

const STROKE_SCALE = [
  "#B2EBF2",
  "#80DEEA",
  "#4DD0E1",
  "#26C6DA",
  "#00ACC1",
  "#0097A7",
  "#00838F", // Ciano borda mais escura
] as const;

// ─── Internal types ───────────────────────────────────────────────────────────

interface HeatCell {
  ageBinStart: number;
  ageBinEnd: number;
  ageBinCenter: number;
  scoreBinStart: number;
  scoreBinEnd: number;
  scoreBinCenter: number;
  count: number;
  riskLevels: string[];
}

interface TooltipState {
  cell: HeatCell;
  x: number;
  y: number;
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

function buildHeatCells(series: ScatterSerie[]): HeatCell[] {
  const cellMap: Record<string, HeatCell> = {};

  series.forEach((serie) => {
    serie.data.forEach((d) => {
      const ageBinStart = Math.floor(d.age / AGE_BIN_SIZE) * AGE_BIN_SIZE;
      const scoreBinStart = Math.floor(d.y / SCORE_BIN_SIZE) * SCORE_BIN_SIZE;
      const key = `${ageBinStart}_${scoreBinStart}`;

      if (!cellMap[key]) {
        cellMap[key] = {
          ageBinStart,
          ageBinEnd: ageBinStart + AGE_BIN_SIZE - 1,
          ageBinCenter: ageBinStart + AGE_BIN_SIZE / 2,
          scoreBinStart,
          scoreBinEnd: scoreBinStart + SCORE_BIN_SIZE - 1,
          scoreBinCenter: scoreBinStart + SCORE_BIN_SIZE / 2,
          count: 0,
          riskLevels: [],
        };
      }

      cellMap[key].count += 1;

      if (!cellMap[key].riskLevels.includes(d.riskLevel)) {
        cellMap[key].riskLevels.push(d.riskLevel);
      }
    });
  });

  return Object.values(cellMap);
}

function scaleIndex(count: number, maxCount: number, steps: number): number {
  if (maxCount <= 1) return 0;
  return Math.round(((count - 1) / (maxCount - 1)) * (steps - 1));
}

function getBubbleRadius(count: number, maxCount: number): number {
  if (maxCount <= 1) return MIN_BUBBLE_RADIUS;
  return (
    MIN_BUBBLE_RADIUS +
    ((count - 1) / (maxCount - 1)) * (MAX_BUBBLE_RADIUS - MIN_BUBBLE_RADIUS)
  );
}

function getBubbleFill(count: number, maxCount: number): string {
  return FILL_SCALE[scaleIndex(count, maxCount, FILL_SCALE.length)];
}

function getBubbleStroke(count: number, maxCount: number): string {
  return STROKE_SCALE[scaleIndex(count, maxCount, STROKE_SCALE.length)];
}

/**
 * Computes a contrasting text color (dark/light) based on the bubble fill color depth.
 */
function getBubbleTextColor(count: number, maxCount: number): string {
  const index = scaleIndex(count, maxCount, FILL_SCALE.length);
  // As cores 0-3 são claras, usa texto escuro. Cores 4-6 são escuras, usa texto claro.
  return index < 4 ? "#042C53" : "#FFFFFF";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeatmapBubbleScatter({
  data,
  isCompact = false,
}: HeatmapBubbleScatterProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // ── Derived values ──────────────────────────────────────────────────────────

  const cells = useMemo(() => buildHeatCells(data), [data]);

  const maxCount = useMemo(
    () => Math.max(1, ...cells.map((c) => c.count)),
    [cells],
  );

  const maxAge = useMemo(
    () => Math.max(100, ...data.flatMap((s) => s.data.map((d) => d.age))),
    [data],
  );

  const maxScore = useMemo(
    () => Math.max(40, ...data.flatMap((s) => s.data.map((d) => d.y))),
    [data],
  );

  /**
   * Nivo needs at least one real data point to compute scales.
   * We pass the cell centers as invisible nodes (nodeSize=0) and
   * render the actual bubbles via a custom layer.
   */
  const nivoData = useMemo(
    () => [
      {
        id: "cells",
        data: cells.map((c) => ({
          x: c.ageBinCenter,
          y: c.scoreBinCenter,
        })),
      },
    ],
    [cells],
  );

  // ── Custom bubble layer ─────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bubblesLayer = useCallback(
    ({ xScale, yScale }: any) => (
      <g>
        {cells.map((cell) => {
          const cx = xScale(cell.ageBinCenter) as number;
          const cy = yScale(cell.scoreBinCenter) as number;
          const r = getBubbleRadius(cell.count, maxCount);
          const fill = getBubbleFill(cell.count, maxCount);
          const stroke = getBubbleStroke(cell.count, maxCount);
          const textColor = getBubbleTextColor(cell.count, maxCount);

          return (
            <g
              key={`${cell.ageBinCenter}_${cell.scoreBinCenter}`}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) =>
                setTooltip({ cell, x: e.clientX, y: e.clientY })
              }
              onMouseMove={(e) =>
                setTooltip({ cell, x: e.clientX, y: e.clientY })
              }
              onMouseLeave={() => setTooltip(null)}
            >
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={1.5}
                opacity={0.92} // Increased opacity for better color definition
              />

              {/* Count label — visible when bubble is large enough, with dynamic contrast */}
              {r >= 13 && (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10}
                  fontWeight={600}
                  fill={textColor} // Contrasting color
                  pointerEvents="none"
                >
                  {cell.count}
                </text>
              )}
            </g>
          );
        })}
      </g>
    ),
    [cells, maxCount],
  );

  // ── Render ──────────────────────────────────────────────────────────────────

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
            className="mb-2 font-medium uppercase text-primary"
          >
            Densidade de testes × fragilidade
          </Typography>
          <Typography variant="caption">
            Concentração de avaliações por faixa etária e score IVCF-20. Bolhas
            maiores indicam maior volume de testes.
          </Typography>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPng(chartRef.current, "heatmap-fragilidade")
            }
          >
            PNG
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              exportElementAsPdf(chartRef.current, "heatmap-fragilidade")
            }
          >
            PDF
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          ref={chartRef}
          className={`rounded-xl border border-border/60 bg-muted/20 p-2 ${
            isCompact ? "h-80" : "h-105"
          }`}
        >
          <ResponsiveScatterPlot
            data={nivoData}
            theme={nivoTheme}
            colors={["transparent"]}
            nodeSize={0}
            blendMode="normal"
            margin={
              isCompact
                ? { top: 20, right: 20, bottom: 45, left: 50 }
                : { top: 30, right: 40, bottom: 60, left: 70 }
            }
            xScale={{
              type: "linear",
              min: 60,
              max: maxAge + 5,
            }}
            yScale={{
              type: "linear",
              min: 0,
              max: maxScore + 5,
            }}
            axisBottom={{
              legend: "Faixa etária (anos)",
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
            /**
             * Suppress Nivo's built-in tooltip — our tooltip is handled
             * via mouse events directly on the SVG <g> elements.
             */
            tooltip={() => null}
            isInteractive={false}
            layers={["grid", "axes", bubblesLayer]}
          />
        </div>
      </CardContent>

      {/* Floating dynamic tooltip */}
      {tooltip && (
        <Box
          display="flex"
          direction="column"
          p={4}
          className="pointer-events-none fixed z-50 w-44 rounded-lg border border-border/60 bg-background/95 shadow-lg backdrop-blur-sm"
          style={{
            left: tooltip.x - 180,
            top: tooltip.y - 180,
          }}
        >
          <div className="mb-1 text-sm font-semibold">
            {tooltip.cell.ageBinStart}–{tooltip.cell.ageBinEnd} anos
          </div>
          <div className="text-xs text-muted-foreground">
            Score: {tooltip.cell.scoreBinStart}–{tooltip.cell.scoreBinEnd}
          </div>
          <div className="mt-1 text-xs font-medium">
            {tooltip.cell.count} {tooltip.cell.count === 1 ? "teste" : "testes"}
          </div>
          <div className="text-xs text-muted-foreground">
            Risco: {tooltip.cell.riskLevels.join(", ")}
          </div>
        </Box>
      )}
    </Card>
  );
}
