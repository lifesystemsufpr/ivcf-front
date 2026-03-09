"use client";

import { useMemo } from "react";
import {
  ResponsiveLine,
  type SliceTooltipProps,
  type DefaultSeries,
} from "@nivo/line";
import type { IVCF_Assessment, IVCF_DomainScores } from "../types";
import { nivoTheme } from "@/features/dashboard/utils/transforms";

type DomainKey = keyof IVCF_DomainScores;

export type DomainDefinition = {
  key: DomainKey;
  label: string;
  color?: string;
};

type MultipleLineChartProps = {
  assessments: IVCF_Assessment[];
  domains?: DomainDefinition[];
  selectedDomainKeys?: DomainKey[];
  height?: number;
  onSelectAssessment?: (id: string) => void;
};

const defaultDomains: DomainDefinition[] = [
  { key: "age", label: "Idade" },
  { key: "selfPerception", label: "Autopercepção" },
  { key: "functionalCapacity", label: "AVDs" },
  { key: "cognition", label: "Cognição" },
  { key: "mood", label: "Humor" },
  { key: "mobility", label: "Mobilidade" },
  { key: "communication", label: "Comunicação" },
  { key: "comorbidities", label: "Comorbidades" },
];

const colorPalette = [
  "#3B82F6",
  "#8B5CF6",
  "#F97316",
  "#10B981",
  "#EF4444",
  "#14B8A6",
  "#6366F1",
  "#EAB308",
];

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function SliceTooltip({ slice }: SliceTooltipProps<DefaultSeries>) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "12px 16px",
        fontSize: 13,
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        minWidth: 200,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 11,
          color: "#374151",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 8,
        }}
      >
        {slice.points[0]?.data.xFormatted}
      </div>
      {slice.points.map((point) => (
        <div
          key={point.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "2px 0",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: point.seriesColor,
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#374151" }}>
            {String(point.seriesId)}:{" "}
            <strong>{String(point.data.yFormatted)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

export function MultipleLineChart({
  assessments,
  domains = defaultDomains,
  selectedDomainKeys,
  height = 420,
  onSelectAssessment,
}: MultipleLineChartProps) {
  const sortedAssessments = useMemo(
    () =>
      [...assessments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [assessments],
  );

  const colorsByLabel = useMemo(() => {
    const map: Record<string, string> = {};
    domains.forEach((domain, index) => {
      map[domain.label] =
        domain.color ?? colorPalette[index % colorPalette.length];
    });
    return map;
  }, [domains]);

  const activeDomains = useMemo(() => {
    if (!selectedDomainKeys) return domains;
    return domains.filter((d) => selectedDomainKeys.includes(d.key));
  }, [domains, selectedDomainKeys]);

  const series = useMemo(() => {
    return activeDomains.map((domain) => ({
      id: domain.label,
      color: colorsByLabel[domain.label],
      data: sortedAssessments.map((assessment) => ({
        x: formatDateLabel(assessment.date),
        y: assessment.domains[domain.key] ?? 0,
        assessmentId: assessment.id,
      })),
    }));
  }, [activeDomains, sortedAssessments, colorsByLabel]);

  const hasData = series.some((s) => s.data.length > 0);

  return (
    <div style={{ height }} className="w-full bg-gray-200 p-5 rounded-lg">
      {!hasData ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Sem dados para exibir.
        </div>
      ) : (
        <ResponsiveLine
          data={series}
          theme={{
            ...nivoTheme,
            background: "transparent",
            crosshair: {
              line: {
                stroke: "#94a3b8",
                strokeWidth: 1,
                strokeDasharray: "6 4",
              },
            },
          }}
          margin={{ top: 20, right: 30, bottom: 50, left: 55 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
          curve="monotoneX"
          enableGridX={false}
          enableGridY
          lineWidth={2.5}
          enablePoints={false}
          enableArea
          areaOpacity={0.08}
          enableSlices="x"
          sliceTooltip={SliceTooltip}
          colors={({ id }) => colorsByLabel[id as string]}
          onClick={(item) => {
            if ("points" in item) return;

            const assessmentId = item.data.assessmentId;

            if (assessmentId) {
              onSelectAssessment?.(assessmentId);
            }
          }}
          axisBottom={{
            tickRotation: 0,
            tickPadding: 10,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 12,
          }}
          legends={[
            {
              anchor: "top-left",
              direction: "row",
              translateY: -20,
              itemWidth: 120,
              itemHeight: 20,
              symbolSize: 10,
              symbolShape: "circle",
              itemTextColor: "#64748b",
            },
          ]}
        />
      )}
    </div>
  );
}
