import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Sex } from "../types";
import type { FrailtyClassification } from "@/core/types";

export const riskColorMap: Record<FrailtyClassification, string> = {
  Robusto: "#22c55e",
  "Pré-frágil": "#fbbf24",
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
  textColor: "hsl(var(--foreground))",
  labels: {
    text: {
      fontSize: 14,
      fontWeight: 700,
    },
  },
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
