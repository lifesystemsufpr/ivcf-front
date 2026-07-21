import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveScatterPlot,
  ResponsiveScatterPlotCanvas,
} from "@nivo/scatterplot";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/core/components/ui/Card";
import { IconButton } from "@/core/components/ui/IconButton";
import { Typography } from "@/core/components/ui/Typography";
import { useTheme } from "@/core/theme/ThemeContext";
import { nivoTheme } from "../utils/transforms";
import { Box } from "@/core/components/ui";
import type { ScatterSerie } from "../types";
import { clientRoutes } from "@/core/configs/client.routes";

type ComorbidityScatterProps = {
  data: ScatterSerie[];
  isCompact?: boolean;
};

type Domain = {
  x: [number, number];
  y: [number, number];
};

const MIN_X_RANGE = 5;
const MIN_Y_RANGE = 5;
const ZOOM_IN_FACTOR = 0.8;
const ZOOM_OUT_FACTOR = 1.25;
const PAN_THRESHOLD_PX = 3;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function zoomAxis(
  [min, max]: [number, number],
  [fullMin, fullMax]: [number, number],
  factor: number,
  focusFraction: number,
  minRange: number,
): [number, number] {
  const range = max - min;
  const newRange = clamp(range * factor, minRange, fullMax - fullMin);
  const focusValue = min + focusFraction * range;
  const newMin = clamp(
    focusValue - focusFraction * newRange,
    fullMin,
    fullMax - newRange,
  );
  return [newMin, newMin + newRange];
}

function panAxis(
  [min, max]: [number, number],
  [fullMin, fullMax]: [number, number],
  delta: number,
): [number, number] {
  const range = max - min;
  const newMin = clamp(min + delta, fullMin, fullMax - range);
  return [newMin, newMin + range];
}

export function ComorbidityScatter({
  data,
  isCompact = false,
}: ComorbidityScatterProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const interactionRef = useRef<HTMLDivElement | null>(null);
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

  const fullDomain: Domain = {
    x: [60, maxAge],
    y: [0, maxScore + 5],
  };

  // null = visão completa; um Domain = janela ampliada
  const [view, setView] = useState<Domain | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startView: Domain;
    active: boolean;
  } | null>(null);

  const domain = view ?? fullDomain;

  const margin = isCompact
    ? { top: 20, right: 20, bottom: 45, left: 50 }
    : { top: 30, right: 40, bottom: 60, left: 70 };

  const applyZoom = (factor: number, fx = 0.5, fy = 0.5) => {
    setView((prev) => {
      const current = prev ?? fullDomain;
      const nextX = zoomAxis(current.x, fullDomain.x, factor, fx, MIN_X_RANGE);
      const nextY = zoomAxis(current.y, fullDomain.y, factor, fy, MIN_Y_RANGE);
      const isFull =
        nextX[1] - nextX[0] >= fullDomain.x[1] - fullDomain.x[0] &&
        nextY[1] - nextY[0] >= fullDomain.y[1] - fullDomain.y[0];
      return isFull ? null : { x: nextX, y: nextY };
    });
  };

  // O wheel precisa de um listener nativo não-passivo para poder
  // bloquear o scroll da página enquanto dá zoom no gráfico.
  const wheelHandlerRef = useRef<(e: WheelEvent) => void>(() => {});
  useEffect(() => {
    wheelHandlerRef.current = (e: WheelEvent) => {
      const el = interactionRef.current;
      if (!el) return;
      const zoomingOut = e.deltaY > 0;
      if (view === null && zoomingOut) return;
      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const plotWidth = rect.width - margin.left - margin.right;
      const plotHeight = rect.height - margin.top - margin.bottom;
      if (plotWidth <= 0 || plotHeight <= 0) return;

      const fx = clamp((e.clientX - rect.left - margin.left) / plotWidth, 0, 1);
      const fy = clamp(
        1 - (e.clientY - rect.top - margin.top) / plotHeight,
        0,
        1,
      );
      applyZoom(zoomingOut ? ZOOM_OUT_FACTOR : ZOOM_IN_FACTOR, fx, fy);
    };
  });

  useEffect(() => {
    const el = interactionRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => wheelHandlerRef.current(e);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!view) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    panRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startView: view,
      active: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pan = panRef.current;
    const el = interactionRef.current;
    if (!pan || !el || e.pointerId !== pan.pointerId) return;

    const dx = e.clientX - pan.startX;
    const dy = e.clientY - pan.startY;

    // Só vira arraste depois de um pequeno deslocamento, para não
    // engolir o clique/tap nos pontos do gráfico.
    if (!pan.active) {
      if (Math.hypot(dx, dy) < PAN_THRESHOLD_PX) return;
      pan.active = true;
      el.setPointerCapture(pan.pointerId);
      setIsPanning(true);
    }

    const rect = el.getBoundingClientRect();
    const plotWidth = rect.width - margin.left - margin.right;
    const plotHeight = rect.height - margin.top - margin.bottom;
    if (plotWidth <= 0 || plotHeight <= 0) return;

    const rangeX = pan.startView.x[1] - pan.startView.x[0];
    const rangeY = pan.startView.y[1] - pan.startView.y[0];
    setView({
      x: panAxis(pan.startView.x, fullDomain.x, (-dx / plotWidth) * rangeX),
      y: panAxis(pan.startView.y, fullDomain.y, (dy / plotHeight) * rangeY),
    });
  };

  const endPan = (e: React.PointerEvent<HTMLDivElement>) => {
    const pan = panRef.current;
    if (!pan || e.pointerId !== pan.pointerId) return;
    if (pan.active) {
      interactionRef.current?.releasePointerCapture(pan.pointerId);
      setIsPanning(false);
    }
    panRef.current = null;
  };

  // Pontos fora da janela visível vazariam sobre eixos e margens,
  // então só entregamos ao nivo o que está dentro do domínio atual.
  const visibleData = useMemo(() => {
    if (!view) return data;
    const [x0, x1] = view.x;
    const [y0, y1] = view.y;
    return data.map((series) => ({
      ...series,
      data: series.data.filter(
        (d) => d.x >= x0 && d.x <= x1 && d.y >= y0 && d.y <= y1,
      ),
    }));
  }, [data, view]);

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
          <Typography variant="caption" className="block text-muted-foreground">
            Use o scroll para aproximar e arraste para navegar
          </Typography>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          ref={chartRef}
          className={`relative rounded-xl border border-border/60 bg-muted/20 p-2 ${
            isCompact ? "h-80" : "h-105"
          }`}
        >
          <div className="absolute right-3 top-3 z-10 flex gap-1">
            <IconButton
              icon={ZoomIn}
              ariaLabel="Aproximar"
              size="sm"
              variant="outline"
              color="neutral"
              shape="rounded"
              className="h-7 w-7 bg-background/80 backdrop-blur-sm"
              iconSize={14}
              onClick={() => applyZoom(ZOOM_IN_FACTOR)}
            />
            <IconButton
              icon={ZoomOut}
              ariaLabel="Afastar"
              size="sm"
              variant="outline"
              color="neutral"
              shape="rounded"
              className="h-7 w-7 bg-background/80 backdrop-blur-sm"
              iconSize={14}
              disabled={!view}
              onClick={() => applyZoom(ZOOM_OUT_FACTOR)}
            />
            <IconButton
              icon={RotateCcw}
              ariaLabel="Redefinir zoom"
              size="sm"
              variant="outline"
              color="neutral"
              shape="rounded"
              className="h-7 w-7 bg-background/80 backdrop-blur-sm"
              iconSize={14}
              disabled={!view}
              onClick={() => setView(null)}
            />
          </div>
          <div
            ref={interactionRef}
            className={`h-full w-full select-none [&_circle]:cursor-pointer ${
              isPanning
                ? "cursor-grabbing"
                : view
                  ? "cursor-grab [&_circle]:cursor-pointer"
                  : ""
            }`}
            style={{ touchAction: view ? "none" : "auto" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endPan}
            onPointerCancel={endPan}
            onDoubleClick={() => setView(null)}
          >
            <ChartComponent
              data={visibleData}
              theme={nivoTheme}
              colors={(series) => {
                const sexLabel = String(series.serieId).toLowerCase();
                const isMale = sexLabel.startsWith("m");
                return isMale ? sexPalette.male : sexPalette.female;
              }}
              margin={margin}
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
                min: domain.x[0],
                max: domain.x[1],
              }}
              yScale={{
                type: "linear",
                min: domain.y[0],
                max: domain.y[1],
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
              onClick={(node, e) => {
                e.preventDefault();
                console.log("Clicked node:", node.data);
                if (node.data.participantId) {
                  window.open(
                    clientRoutes.PARTICIPANTS.DETAILS({
                      id: node.data.participantId,
                    }),
                    "_blank",
                  );
                }
              }}
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
              layers={["grid", "axes", "nodes", "legends"]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
