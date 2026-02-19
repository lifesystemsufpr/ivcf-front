import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type {
  AggregationDimension,
  DomainKey,
  FragilityFilters,
  PatientFragility,
  RiskLevel,
  Sex,
} from "../types";

export const riskColorMap: Record<RiskLevel, string> = {
  Robusto: "#22c55e",
  "Pre-Fragil": "#fbbf24",
  Fragil: "#f87171",
};

export const sexColorMap: Record<Sex, string> = {
  M: "#38bdf8",
  F: "#a855f7",
};

export const domainLabels: Record<DomainKey, string> = {
  idade: "Idade",
  autopercepcao: "Autopercepção",
  avds: "AVDs",
  cognicao: "Cognição",
  humor: "Humor",
  mobilidade: "Mobilidade",
  comunicacao: "Comunicação",
  comorbidades: "Comorbidades",
};

export const ageBrackets = [
  { label: "<65", range: [0, 64] as [number, number] },
  { label: "65-74", range: [65, 74] as [number, number] },
  { label: "75-84", range: [75, 84] as [number, number] },
  { label: "85+", range: [85, 130] as [number, number] },
];

export const nivoTheme = {
  textColor: "hsl(var(--foreground))",
  axis: {
    ticks: {
      text: {
        fill: "hsl(var(--muted-foreground))",
      },
    },
    legend: {
      text: {
        fill: "hsl(var(--foreground))",
      },
    },
  },
  grid: {
    line: {
      stroke: "hsl(var(--muted))",
      strokeWidth: 1,
    },
  },
  tooltip: {
    container: {
      background: "hsl(var(--card))",
      color: "hsl(var(--foreground))",
      borderRadius: 8,
      boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
      border: "1px solid hsl(var(--border))",
    },
  },
};

export function getAgeGroup(age: number): string {
  const match = ageBrackets.find(
    ({ range }) => age >= range[0] && age <= range[1],
  );
  return match?.label ?? "N/A";
}

export function applyFilters(
  data: PatientFragility[],
  filters: FragilityFilters,
): PatientFragility[] {
  return data.filter((item) => {
    if (filters.sex && filters.sex !== "all" && item.sex !== filters.sex) {
      return false;
    }

    if (filters.ageRange) {
      const [min, max] = filters.ageRange;
      if (item.age < min || item.age > max) return false;
    }

    if (filters.period) {
      const ts = new Date(item.date).getTime();
      if (filters.period.start) {
        const startTs = new Date(filters.period.start).getTime();
        if (ts < startTs) return false;
      }
      if (filters.period.end) {
        const endTs = new Date(filters.period.end).getTime();
        if (ts > endTs) return false;
      }
    }

    return true;
  });
}

function getGroupingValue(
  row: PatientFragility,
  dimension: AggregationDimension,
): string {
  if (dimension === "sex") return row.sex === "M" ? "Masculino" : "Feminino";
  return getAgeGroup(row.age);
}

export function buildDomainHeatmap(
  data: PatientFragility[],
  dimension: AggregationDimension,
) {
  const aggregator: Record<
    DomainKey,
    Record<string, { sum: number; count: number }>
  > = {} as any;

  data.forEach((row) => {
    const group = getGroupingValue(row, dimension);
    (Object.keys(row.domains) as DomainKey[]).forEach((key) => {
      aggregator[key] = aggregator[key] ?? {};
      aggregator[key][group] = aggregator[key][group] ?? { sum: 0, count: 0 };
      aggregator[key][group].sum += row.domains[key];
      aggregator[key][group].count += 1;
    });
  });

  return (Object.keys(domainLabels) as DomainKey[]).map((domain) => {
    const groupMap = aggregator[domain] ?? {};
    return {
      id: domainLabels[domain],
      data: Object.entries(groupMap).map(([group, stats]) => ({
        x: group,
        y: Number((stats.sum / stats.count).toFixed(2)),
      })),
    };
  });
}

export function buildRiskPyramid(
  data: PatientFragility[],
  dimension: AggregationDimension,
) {
  const groups: Record<
    string,
    { total: number; risk: Record<RiskLevel, number> }
  > = {};

  data.forEach((row) => {
    const group = getGroupingValue(row, dimension);
    if (!groups[group]) {
      groups[group] = {
        total: 0,
        risk: {
          Robusto: 0,
          "Pre-Fragil": 0,
          Fragil: 0,
        },
      };
    }
    groups[group].total += 1;
    groups[group].risk[row.riskLevel] += 1;
  });

  return Object.entries(groups).map(([group, stats]) => ({
    group,
    Robusto: Number(((stats.risk.Robusto / stats.total) * 100).toFixed(1)),
    "Pre-Fragil": Number(
      ((stats.risk["Pre-Fragil"] / stats.total) * 100).toFixed(1),
    ),
    Fragil: Number(((stats.risk.Fragil / stats.total) * 100).toFixed(1)),
  }));
}

export function buildComorbidityPoints(data: PatientFragility[]) {
  const series: Record<Sex, { id: string; color: string; data: any[] }> = {
    M: { id: "Masculino", color: sexColorMap.M, data: [] },
    F: { id: "Feminino", color: sexColorMap.F, data: [] },
  };

  data.forEach((row) => {
    series[row.sex].data.push({
      x: row.chronicDiseasesCount,
      y: row.totalScore,
      size: Math.max(6, Math.min(18, row.age / 5)),
      age: row.age,
      sex: row.sex,
      riskLevel: row.riskLevel,
      date: row.date,
    });
  });

  return Object.values(series);
}

export function buildTrendSeries(data: PatientFragility[], bySex = false) {
  const groups: Record<
    string,
    Record<string, { sum: number; count: number }>
  > = {};

  const normalizeDate = (date: string) =>
    new Date(date).toISOString().slice(0, 10);

  data.forEach((row) => {
    const groupId = bySex
      ? row.sex === "M"
        ? "Masculino"
        : "Feminino"
      : "Cohort";
    const day = normalizeDate(row.date);
    groups[groupId] = groups[groupId] ?? {};
    groups[groupId][day] = groups[groupId][day] ?? { sum: 0, count: 0 };
    groups[groupId][day].sum += row.totalScore;
    groups[groupId][day].count += 1;
  });

  return Object.entries(groups).map(([groupId, dates]) => ({
    id: groupId,
    data: Object.entries(dates)
      .map(([day, stats]) => ({
        x: day,
        y: Number((stats.sum / stats.count).toFixed(2)),
      }))
      .sort((a, b) => (a.x > b.x ? 1 : -1)),
  }));
}

export function exportCsv(rows: PatientFragility[], fileName: string) {
  const header = [
    "patientId",
    "date",
    "age",
    "sex",
    "totalScore",
    "riskLevel",
    "chronicDiseasesCount",
    ...Object.keys(domainLabels),
  ];

  const csvRows = rows.map((row) => [
    row.patientId,
    row.date,
    row.age,
    row.sex,
    row.totalScore,
    row.riskLevel,
    row.chronicDiseasesCount,
    ...(Object.keys(domainLabels) as DomainKey[]).map(
      (key) => row.domains[key],
    ),
  ]);

  const csv = [header, ...csvRows]
    .map((r) =>
      r
        .map((cell) => {
          const value = String(cell ?? "");
          if (value.includes(",") || value.includes("\n")) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportElementAsPng(
  element: HTMLElement | null,
  fileName: string,
) {
  if (!element) return;
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
  });
  const link = document.createElement("a");
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function exportElementAsPdf(
  element: HTMLElement | null,
  fileName: string,
) {
  if (!element) return;
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
  });
  const imgData = canvas.toDataURL("image/png");
  const orientation = canvas.width > canvas.height ? "landscape" : "portrait";

  const pdf = new jsPDF({
    orientation,
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${fileName}.pdf`);
}
