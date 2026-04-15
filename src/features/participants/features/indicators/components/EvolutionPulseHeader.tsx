import { Download } from "lucide-react";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { cn } from "@/core/utils";
import { classificationStyles } from "@/core/consts/ivcf.consts";
import { exportElementAsPdf } from "@/features/dashboard/utils/transforms";
import type { FrailtyClassification } from "@/core/types";

type EvolutionPulseHeaderProps = {
  riskLevel: FrailtyClassification;
  participantId: string;
  totalScore: number;
  deltaAbsolute: number;
  deltaPercent: string;
  exportRef: React.RefObject<HTMLDivElement | null>;
};

export function EvolutionPulseHeader({
  riskLevel,
  participantId,
  totalScore,
  deltaAbsolute,
  deltaPercent,
  exportRef,
}: EvolutionPulseHeaderProps) {
  const riskStyle = classificationStyles[riskLevel];

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 bg-gray-200 p-5 rounded-lg">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Badge
            className={cn(
              riskStyle?.bg ?? "bg-gray-200",
              riskStyle?.text ?? "text-gray-500",
            )}
          >
            {riskLevel}
          </Badge>
          <span className="text-sm text-gray-500">ID: #{participantId}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Pulso de Evolução</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Pontuação Total
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {totalScore}
              <span className="text-lg font-normal text-gray-400">/40</span>
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                deltaAbsolute > 0
                  ? "text-red-500"
                  : deltaAbsolute < 0
                    ? "text-emerald-500"
                    : "text-gray-500",
              )}
            >
              {deltaAbsolute > 0 ? "↑" : deltaAbsolute < 0 ? "↓" : ""}
              {deltaPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
