import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Sex } from "../types";
import type { FrailtyClassification } from "@/core/types";

export const riskColorMap: Record<FrailtyClassification, string> = {
  Robusto: "#22c55e",
  "Pré-frágil": "#fbbf24",
  "Em Risco de Fragilização": "#fbbf24",
  Frágil: "#f87171",
  Todos: "#6b7280",
};

export const sexColorMap: Record<Sex, string> = {
  M: "#38bdf8",
  F: "#a855f7",
};

export const ageBrackets = [
  { label: "<65", range: [0, 64] as [number, number] },
  { label: "65-74", range: [65, 74] as [number, number] },
  { label: "75-84", range: [75, 84] as [number, number] },
  { label: "85+", range: [85, 130] as [number, number] },
];

export const nivoTheme = {
  // Cor base herdada por textos que não têm regra específica
  textColor: "hsl(var(--foreground))",
  fontSize: 12,

  // ── Fundo dos elementos internos do gráfico ──────────────────────────────
  background: "transparent",

  labels: {
    text: {
      fontSize: 12,
      fontWeight: 600,
      fill: "#ffffff", // sempre branco — labels ficam sobre as barras
    },
  },

  // ── Eixos ────────────────────────────────────────────────────────────────
  axis: {
    domain: {
      line: {
        stroke: "hsl(var(--border))",
        strokeWidth: 1,
        strokeOpacity: 0.6,
      },
    },
    ticks: {
      line: {
        stroke: "hsl(var(--border))",
        strokeWidth: 1,
        strokeOpacity: 0.4,
      },
      text: {
        fontSize: 11,
        fontWeight: 400,
        fill: "hsl(var(--muted-foreground))",
        fontFamily: "inherit",
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fontWeight: 500,
        fill: "hsl(var(--foreground))",
        fontFamily: "inherit",
      },
    },
  },

  // ── Grid ─────────────────────────────────────────────────────────────────
  grid: {
    line: {
      stroke: "hsl(var(--border))",
      strokeWidth: 1,
      strokeOpacity: 0.5, // sutil nos dois modos
      strokeDasharray: "4 4", // pontilhado refinado
    },
  },

  // ── Legenda (opcional, usada em pie/line charts) ──────────────────────────
  legends: {
    title: {
      text: {
        fontSize: 11,
        fontWeight: 500,
        fill: "hsl(var(--muted-foreground))",
      },
    },
    text: {
      fontSize: 11,
      fontWeight: 400,
      fill: "hsl(var(--foreground))",
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: "hsl(var(--muted-foreground))",
      },
    },
  },

  // ── Anotações ─────────────────────────────────────────────────────────────
  annotations: {
    text: {
      fontSize: 12,
      fontWeight: 400,
      fill: "hsl(var(--foreground))",
      outlineWidth: 2,
      outlineColor: "hsl(var(--background))",
    },
    link: {
      stroke: "hsl(var(--muted-foreground))",
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: "hsl(var(--background))",
    },
    outline: {
      stroke: "hsl(var(--muted-foreground))",
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: "hsl(var(--background))",
    },
    symbol: {
      fill: "hsl(var(--muted-foreground))",
      outlineWidth: 2,
      outlineColor: "hsl(var(--background))",
    },
  },

  // ── Crosshair (line/scatter charts) ──────────────────────────────────────
  crosshair: {
    line: {
      stroke: "hsl(var(--foreground))",
      strokeWidth: 1,
      strokeOpacity: 0.2,
      strokeDasharray: "4 4",
    },
  },

  // ── Tooltip ───────────────────────────────────────────────────────────────
  tooltip: {
    wrapper: {},
    container: {
      background: "hsl(var(--card))",
      color: "hsl(var(--card-foreground))",
      fontSize: 12,
      fontFamily: "inherit",
      borderRadius: 8,
      border: "1px solid hsl(var(--border))",
      boxShadow:
        "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      padding: "8px 12px",
    },
    basic: {},
    chip: {
      width: 10,
      height: 10,
      borderRadius: 2,
    },
    table: {},
    tableCell: {
      padding: "3px 6px",
    },
    tableCellValue: {
      fontWeight: 600,
    },
  },
} as const;

export function getAgeGroup(age: number): string {
  const match = ageBrackets.find(
    ({ range }) => age >= range[0] && age <= range[1],
  );
  return match?.label ?? "N/A";
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

export function calcPercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(1));
}
