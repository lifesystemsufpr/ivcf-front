"use client";

import { useMemo, useState } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import type { IVCF_Assessment } from "../types";
import { nivoTheme } from "@/features/dashboard/utils/transforms";
import { Typography } from "@/core/components/ui/Typography";
import { DOMAIN_DEFINITIONS, IVCF_DOMAIN_MAX } from "@/core/consts/ivcf.consts";

type WebChartProps = {
  assessments: IVCF_Assessment[];
  height?: number;
};

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

export function WebChart({ assessments, height = 420 }: WebChartProps) {
  const sortedAssessments = useMemo(
    () =>
      [...assessments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [assessments],
  );

  const [selectedId, setSelectedId] = useState(
    sortedAssessments.at(-1)?.id ?? "",
  );

  const selectedAssessment =
    sortedAssessments.find((a) => a.id === selectedId) ??
    sortedAssessments.at(-1);

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
      <div className="flex items-center gap-2">
        <Typography variant="small" className="text-muted-foreground">
          Avaliação
        </Typography>

        <select
          value={selectedAssessment?.id ?? ""}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          {sortedAssessments.map((assessment) => (
            <option key={assessment.id} value={assessment.id}>
              {formatDateLabel(assessment.date)} – Score {assessment.totalScore}
              /40
            </option>
          ))}
        </select>
      </div>

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
