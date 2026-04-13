"use client";

import { useMemo, useState } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import type { IVCF_AssessmentWithDate, Daily_Assessment } from "../types";
import { nivoTheme } from "@/features/dashboard/utils/transforms";
import { Typography } from "@/core/components/ui/Typography";
import { DOMAIN_DEFINITIONS, IVCF_DOMAIN_MAX } from "@/core/consts/ivcf.consts";
import { Box } from "@/core/components/ui";

type WebChartProps = {
  assessments: IVCF_AssessmentWithDate[] | Daily_Assessment[];
  height?: number;
};

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

function isDaily(data: any): data is Daily_Assessment {
  return Array.isArray(data.assessments);
}

export function WebChart({ assessments, height = 420 }: WebChartProps) {
  // Transform to structured daily data with all assessments per day
  const dailyStructure = useMemo(() => {
    if (Array.isArray(assessments) && assessments.length === 0) {
      return [];
    }

    if (
      Array.isArray(assessments) &&
      assessments.length > 0 &&
      isDaily(assessments[0])
    ) {
      // Already Daily_Assessment array
      return (assessments as Daily_Assessment[]).map((daily) => ({
        date: daily.date,
        hasMultiple: daily.assessments.length > 1,
        assessments: daily.assessments.map((a, idx) => ({
          ...a,
          date: daily.date,
          indexInDay: idx,
        })),
      }));
    } else {
      // IVCF_AssessmentWithDate array - group by date
      const grouped = new Map<
        string,
        (IVCF_AssessmentWithDate & { indexInDay: number })[]
      >();

      (assessments as IVCF_AssessmentWithDate[]).forEach((a) => {
        if (!grouped.has(a.date)) {
          grouped.set(a.date, []);
        }
        const arr = grouped.get(a.date)!;
        arr.push({ ...a, indexInDay: arr.length });
      });

      return Array.from(grouped.entries())
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([date, assts]) => ({
          date,
          hasMultiple: assts.length > 1,
          assessments: assts,
        }));
    }
  }, [assessments]);

  // Get all assessment IDs in order (for flat iteration)
  const allAssessmentIds = useMemo(
    () =>
      dailyStructure.flatMap((day) =>
        day.assessments.map((a) => ({
          id: a.id,
          date: a.date,
          index: a.indexInDay,
        })),
      ),
    [dailyStructure],
  );

  // Initialize with the first assessment of the last day
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(
    allAssessmentIds.at(-1)?.id ?? "",
  );

  // Find the selected assessment
  const selectedAssessment = useMemo(
    () =>
      dailyStructure
        .flatMap((d) => d.assessments)
        .find((a) => a.id === selectedAssessmentId),
    [selectedAssessmentId, dailyStructure],
  );

  // Get assessments in the same day as selected
  const assessmentsInSelectedDay = useMemo(
    () =>
      selectedAssessment
        ? (dailyStructure.find((d) => d.date === selectedAssessment.date)
            ?.assessments ?? [])
        : [],
    [selectedAssessment, dailyStructure],
  );

  const radarData = useMemo(() => {
    if (!selectedAssessment) return [];

    return DOMAIN_DEFINITIONS.map((domain) => {
      const raw = selectedAssessment.domains[domain.key] ?? 0;
      const max = IVCF_DOMAIN_MAX[domain.key];
      const normalized = Number(((raw / max) * 100).toFixed(1));

      return {
        domain: domain.label,
        value: normalized,
        raw,
        max,
      };
    });
  }, [selectedAssessment]);

  const hasData = radarData.length > 0 && selectedAssessment;

  return (
    <div className="space-y-3">
      <Box display="flex" direction="row" align="center" gap={12}>
        {/* Day selector */}
        <div className="flex items-center gap-2 ">
          <Typography variant="small" className="text-muted-foreground">
            Data
          </Typography>

          <select
            value={selectedAssessment?.date ?? ""}
            onChange={(e) => {
              const date = e.target.value;
              const lastAssessmentInDay = dailyStructure
                .find((d) => d.date === date)
                ?.assessments?.at(-1);
              if (lastAssessmentInDay) {
                setSelectedAssessmentId(lastAssessmentInDay.id);
              }
            }}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
          >
            {dailyStructure.map((day) => {
              const dayLabel = formatDateLabel(day.date);
              const multiple = day.hasMultiple
                ? ` (${day.assessments.length})`
                : "";
              return (
                <option key={day.date} value={day.date}>
                  {dayLabel}
                  {multiple}
                </option>
              );
            })}
          </select>
        </div>

        {/* Assessment selector (only show if multiple on this day) */}
        {assessmentsInSelectedDay.length > 1 && (
          <div className="flex items-center gap-2">
            <Typography variant="small" className="text-muted-foreground">
              Avaliação
            </Typography>

            <select
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
            >
              {assessmentsInSelectedDay.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.indexInDay + 1} – Score {a.totalScore}/40
                </option>
              ))}
            </select>
          </div>
        )}
      </Box>

      {/* Radar chart */}
      <div style={{ height }}>
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados para exibir.
          </div>
        ) : (
          <ResponsiveRadar
            data={radarData}
            keys={["value"]}
            indexBy="domain"
            theme={nivoTheme}
            maxValue={100}
            margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
            curve="linearClosed"
            borderWidth={2}
            gridLevels={5}
            gridShape="circular"
            dotSize={8}
            dotBorderWidth={2}
            dotColor={{ theme: "background" }}
            dotBorderColor={{ from: "color" }}
            sliceTooltip={({ index }) => {
              const domain = radarData.find((d) => d.domain === index);
              if (!domain) return null;

              return (
                <div className="rounded-md border bg-background p-2 text-xs shadow-md w-30">
                  <div className="font-medium">{domain.domain}</div>
                  <div>
                    Pontuação: {domain.raw} / {domain.max}
                  </div>
                  <div className="text-muted-foreground">{domain.value}%</div>
                </div>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
