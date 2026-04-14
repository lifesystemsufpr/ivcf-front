"use client";

import { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import type { IVCF_AssessmentWithDate, Daily_Assessment } from "../types";
import { prepareLinearScoreChartData } from "../utils/data-adapter";
import { nivoTheme } from "@/features/dashboard/utils/transforms";
import { Typography } from "@/core/components/ui/Typography";

type LinearScoreChartProps = {
  assessments: IVCF_AssessmentWithDate[] | Daily_Assessment[];
  height?: number;
  onSelectAssessment?: (id: string) => void;
};

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

function isDaily(data: any): data is Daily_Assessment {
  return Array.isArray(data.assessments);
}

export function LinearScoreChart({
  assessments,
  height = 420,
  onSelectAssessment,
}: LinearScoreChartProps) {
  // Prepare enhanced data with metadata about multiple assessments
  const enhancedData = useMemo(() => {
    if (
      Array.isArray(assessments) &&
      assessments.length > 0 &&
      isDaily(assessments[0])
    ) {
      // Input is Daily_Assessment array
      return prepareLinearScoreChartData(assessments as Daily_Assessment[]);
    } else {
      // Input is IVCF_AssessmentWithDate array - add default metadata
      return (assessments as IVCF_AssessmentWithDate[]).map((a) => ({
        ...a,
        isPrimaryAssessment: true,
        hasMultipleAssessmentsOnDay: false,
        assessmentIndexOnDay: 0,
      }));
    }
  }, [assessments]);

  const sorted = useMemo(
    () =>
      [...enhancedData].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [enhancedData],
  );

  // Split into primary (main line) and secondary (additional assessments) series
  const { primaryData, secondaryData } = useMemo(() => {
    const primary = sorted.filter((a) => a.isPrimaryAssessment);
    const secondary = sorted.filter((a) => !a.isPrimaryAssessment);

    return {
      primaryData: primary.map((a) => ({
        x: formatDateLabel(a.date),
        y: a.totalScore,
        riskLevel: a.riskLevel,
        rawDate: a.date,
        assessmentId: a.id,
        assessmentIndex: a.assessmentIndexOnDay,
      })),
      secondaryData: secondary.map((a) => ({
        x: formatDateLabel(a.date),
        y: a.totalScore,
        riskLevel: a.riskLevel,
        rawDate: a.date,
        assessmentId: a.id,
        assessmentIndex: a.assessmentIndexOnDay,
      })),
    };
  }, [sorted]);

  const lineData = useMemo(() => {
    const series: any[] = [
      {
        id: "IVCF Score Primário",
        data: primaryData,
      },
    ];

    // Only add secondary series if there are additional assessments
    if (secondaryData.length > 0) {
      series.push({
        id: "Avaliações Adicionais",
        data: secondaryData,
      });
    }

    return series;
  }, [primaryData, secondaryData]);

  const hasData = sorted.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <Typography variant="small" className="text-muted-foreground">
            Evolução do Score Total IVCF
          </Typography>
        </div>
      </div>

      <div style={{ height }}>
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados para exibir.
          </div>
        ) : (
          <ResponsiveLine
            data={lineData}
            theme={nivoTheme}
            margin={{ top: 50, right: 40, bottom: 60, left: 60 }}
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
            colors={(series) => {
              if (series.id === "IVCF Score Primário") return "#3B82F6";
              return "#93C5FD";
            }}
            lineWidth={secondaryData.length > 0 ? 2.5 : 3}
            enablePoints
            pointSize={8}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            enableArea={secondaryData.length === 0}
            areaOpacity={0.08}
            useMesh={true}
            onClick={(item) => {
              if ("points" in item) return;

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
                {point.seriesId === "Avaliações Adicionais" && (
                  <div className="text-blue-600 font-semibold mt-1">
                    Avaliação #{(point.data.assessmentIndex as number) + 1}
                  </div>
                )}
              </div>
            )}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                translateX: 0,
                translateY: -50,
                itemWidth: 150,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: "circle",
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
