"use client";

import { useMemo, useState } from "react";
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

// Maximum raw score for each domain
const domainMaxScores: Record<DomainKey, number> = {
  age: 3,
  selfPerception: 1,
  functionalCapacity: 10,
  cognition: 4,
  mood: 4,
  mobility: 10,
  communication: 4,
  comorbidities: 4,
};

// Normalizes a raw score to a 0–10 scale based on the domain's max
function normalizeScore(raw: number, domainKey: DomainKey): number {
  const max = domainMaxScores[domainKey];
  if (!max) return 0;
  return parseFloat(((raw / max) * 10).toFixed(2));
}

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

// Extended point data stored alongside each chart point
type PointExtraData = {
  assessmentId: string;
  rawScore: number;
  maxScore: number;
};

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
        minWidth: 220,
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
      {slice.points.map((point) => {
        const extra = point.data as unknown as PointExtraData &
          Record<string, unknown>;
        const normalizedScore = Number(point.data.y).toFixed(1);
        const rawScore = extra.rawScore;
        const maxScore = extra.maxScore;

        return (
          <div
            key={point.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 0",
              borderBottom: "1px solid #f3f4f6",
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
            <span style={{ color: "#374151", flex: 1 }}>
              {String(point.seriesId)}
            </span>
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              <strong style={{ color: "#111827" }}>
                {normalizedScore} / 10
              </strong>
              <span style={{ fontSize: 11, color: "#6b7280" }}>
                {rawScore} de {maxScore} pts
              </span>
            </span>
          </div>
        );
      })}
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
  const [hiddenLabels, setHiddenLabels] = useState<Set<string>>(new Set());

  const toggleLabel = (label: string) => {
    setHiddenLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

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

  const visibleDomains = useMemo(
    () => activeDomains.filter((d) => !hiddenLabels.has(d.label)),
    [activeDomains, hiddenLabels],
  );

  const series = useMemo(() => {
    return visibleDomains.map((domain) => ({
      id: domain.label,
      color: colorsByLabel[domain.label],
      data: sortedAssessments.map((assessment) => {
        const rawScore = assessment.domains[domain.key] ?? 0;
        const maxScore = domainMaxScores[domain.key];
        return {
          x: formatDateLabel(assessment.date),
          // Y axis uses the normalized 0–10 value
          y: normalizeScore(rawScore, domain.key),
          // Extra data surfaced in the tooltip
          assessmentId: assessment.id,
          rawScore,
          maxScore,
        };
      }),
    }));
  }, [visibleDomains, sortedAssessments, colorsByLabel]);

  const hasData = series.some((s) => s.data.length > 0);

  return (
    <div className="w-full bg-gray-200 p-5 rounded-lg" style={{ height }}>
      {/* Toggle legend */}
      <div className="flex flex-wrap gap-2 mb-3">
        {activeDomains.map((domain) => {
          const isVisible = !hiddenLabels.has(domain.label);
          const color = colorsByLabel[domain.label];
          return (
            <button
              key={domain.key}
              onClick={() => toggleLabel(domain.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                borderRadius: 9999,
                border: `1.5px solid ${isVisible ? color : "#d1d5db"}`,
                backgroundColor: isVisible ? `${color}18` : "transparent",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                color: isVisible ? color : "#9ca3af",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isVisible ? color : "#d1d5db",
                  flexShrink: 0,
                  transition: "background-color 0.15s ease",
                }}
              />
              {domain.label}
            </button>
          );
        })}
      </div>

      {!hasData ? (
        <div
          className="flex items-center justify-center text-sm text-muted-foreground"
          style={{ height: height - 60 }}
        >
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
          margin={{ top: 10, right: 30, bottom: 50, left: 55 }}
          xScale={{ type: "point" }}
          // Fixed 0–10 scale on Y axis
          yScale={{ type: "linear", min: 0, max: 10, stacked: false }}
          yFormat=".1f"
          curve="monotoneX"
          enableGridX={false}
          enableGridY
          gridYValues={[0, 2, 4, 6, 8, 10]}
          lineWidth={2.5}
          enablePoints={false}
          enableArea
          areaOpacity={0.08}
          enableSlices="x"
          sliceTooltip={SliceTooltip}
          colors={({ id }) => colorsByLabel[id as string]}
          onClick={(item) => {
            if ("points" in item) return;
            const assessmentId = (item.data as unknown as PointExtraData)
              .assessmentId;
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
            tickValues: [0, 2, 4, 6, 8, 10],
            format: (v) => `${v}`,
          }}
        />
      )}
    </div>
  );
}
