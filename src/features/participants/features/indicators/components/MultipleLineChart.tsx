"use client";

import { useMemo, useRef, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import type { IVCF_Assessment, IVCF_DomainScores } from "../types";
import {
  nivoTheme,
  exportElementAsPng,
  exportElementAsPdf,
} from "@/features/dashboard/utils/transforms";
import { Button } from "@/core/components/ui/Button";

type DomainKey = keyof IVCF_DomainScores;

export type DomainDefinition = {
  key: DomainKey;
  label: string;
  color?: string;
};

type MultipleLineChartProps = {
  assessments: IVCF_Assessment[];
  domains?: DomainDefinition[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  showExport?: boolean;
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
  "#2563eb",
  "#7c3aed",
  "#ea580c",
  "#16a34a",
  "#dc2626",
  "#0d9488",
  "#4f46e5",
  "#ca8a04",
];

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

export function MultipleLineChart({
  assessments,
  domains = defaultDomains,
  xLabel = "Data da avaliação",
  yLabel = "Pontuação por domínio",
  height = 420,
  showExport = false,
}: MultipleLineChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    domains.map((d) => d.label),
  );

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

  const series = useMemo(() => {
    return domains
      .filter((d) => selectedDomains.includes(d.label))
      .map((domain) => ({
        id: domain.label,
        color: colorsByLabel[domain.label],
        data: sortedAssessments.map((assessment) => ({
          x: formatDateLabel(assessment.date),
          y: assessment.domains[domain.key] ?? 0,
        })),
      }));
  }, [domains, sortedAssessments, selectedDomains, colorsByLabel]);

  const hasData = series.some((s) => s.data.length > 0);

  const toggleDomain = (label: string) => {
    setSelectedDomains((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const selectAll = () => {
    setSelectedDomains(domains.map((d) => d.label));
  };

  const clearAll = () => {
    setSelectedDomains([]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        {showExport && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                exportElementAsPng(containerRef.current, "ivcf-dominios")
              }
            >
              PNG
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                exportElementAsPdf(containerRef.current, "ivcf-dominios")
              }
            >
              PDF
            </Button>
          </div>
        )}
      </div>

      {/* Domain Selector */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
        <div className="flex gap-2">
          <Button size="lg" variant="outline" onClick={selectAll}>
            Selecionar todos
          </Button>
          <Button size="lg" variant="outline" onClick={clearAll}>
            Limpar
          </Button>
        </div>

        {domains.map((domain) => (
          <label
            key={domain.label}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              checked={selectedDomains.includes(domain.label)}
              onChange={() => toggleDomain(domain.label)}
            />
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: colorsByLabel[domain.label] }}
            />
            {domain.label}
          </label>
        ))}
      </div>

      {/* Chart */}
      <div ref={containerRef} style={{ height }} className="w-full">
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados para exibir.
          </div>
        ) : (
          <ResponsiveLine
            data={series}
            theme={nivoTheme}
            margin={{ top: 30, right: 30, bottom: 90, left: 70 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
            enableGridX={false}
            enableGridY
            lineWidth={3.5}
            enablePoints
            pointSize={9}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            enableArea
            areaOpacity={0.08}
            useMesh
            colors={({ id }) => colorsByLabel[id as string]}
            axisBottom={{
              tickRotation: -25,
              legend: xLabel,
              legendPosition: "middle",
              legendOffset: 60,
            }}
            axisLeft={{
              legend: yLabel,
              legendPosition: "middle",
              legendOffset: -55,
            }}
            tooltip={({ point }) => (
              <div className="rounded-md border bg-white p-3 shadow-md text-sm">
                <div
                  className="font-semibold"
                  style={{ color: point.seriesColor }}
                >
                  {point.seriesId}
                </div>
                <div>Data: {point.data.xFormatted}</div>
                <div>Score: {point.data.yFormatted}</div>
              </div>
            )}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                translateY: 55,
                itemWidth: 110,
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
