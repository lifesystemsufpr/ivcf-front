"use client";

import { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import type { IVCF_Assessment } from "../types";
import { nivoTheme } from "@/features/dashboard/utils/transforms";
import { Typography } from "@/core/components/ui/Typography";

type LinearScoreChartProps = {
  assessments: IVCF_Assessment[];
  height?: number;
  onSelectAssessment?: (id: string) => void;
};

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

export function LinearScoreChart({
  assessments,
  height = 420,
  onSelectAssessment,
}: LinearScoreChartProps) {
  const sorted = useMemo(
    () =>
      [...assessments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [assessments],
  );

  const lineData = useMemo(() => {
    return [
      {
        id: "IVCF Score",
        data: sorted.map((a) => ({
          x: formatDateLabel(a.date),
          y: a.totalScore,
          riskLevel: a.riskLevel,
          rawDate: a.date,
          assessmentId: a.id,
        })),
      },
    ];
  }, [sorted]);

  const hasData = sorted.length > 0;

  return (
    <div className="space-y-3">
      <Typography variant="small" className="text-muted-foreground">
        Evolução do Score Total IVCF
      </Typography>

      <div style={{ height }}>
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados para exibir.
          </div>
        ) : (
          <ResponsiveLine
            data={lineData}
            theme={nivoTheme}
            margin={{ top: 40, right: 40, bottom: 60, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: 40,
              stacked: false,
              reverse: false,
            }}
            axisBottom={{
              tickRotation: -30,
              legend: "Data da Avaliação",
              legendOffset: 50,
              legendPosition: "middle",
            }}
            axisLeft={{
              legend: "Score IVCF (0–40)",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={8}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            enableArea={true}
            areaOpacity={0.08}
            useMesh={true}
            onClick={(item) => {
              if ("points" in item) return;

              // Agora TS sabe que é Point
              const assessmentId = item.data.assessmentId;

              if (assessmentId) {
                onSelectAssessment?.(assessmentId);
              }
            }}
            tooltip={({ point }) => (
              <div className="rounded-md border bg-background p-2 text-xs shadow-md">
                <div className="font-medium">
                  {formatDateLabel(point.data.rawDate as string)}
                </div>
                <div>
                  Score: <strong>{point.data.y}</strong> / 40
                </div>
                <div className="text-muted-foreground">
                  Classificação: {point.data.riskLevel}
                </div>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
