import { useMemo } from "react";
import {
  Brain,
  Eye,
  Activity,
  Smile,
  Footprints,
  MessageCircle,
  Heart,
  Calendar,
  RotateCcw,
} from "lucide-react";
import type { IVCF_Assessment, IVCF_DomainScores } from "../types";
import type { DomainDefinition } from "./MultipleLineChart";
import { IVCF_DOMAIN_MAX } from "@/core/consts/ivcf.consts";
import { cn } from "@/core/utils";

type DomainKey = keyof IVCF_DomainScores;

const domainIcons: Record<
  DomainKey,
  React.ComponentType<{ className?: string }>
> = {
  age: Calendar,
  selfPerception: Eye,
  functionalCapacity: Activity,
  cognition: Brain,
  mood: Smile,
  mobility: Footprints,
  communication: MessageCircle,
  comorbidities: Heart,
};

type DomainFiltersSidebarProps = {
  assessments: IVCF_Assessment[];
  allDomains: DomainDefinition[];
  selectedDomainKeys: DomainKey[];
  onToggleDomain: (key: DomainKey) => void;
  onResetAll: () => void;
};

export function DomainFiltersSidebar({
  assessments,
  allDomains,
  selectedDomainKeys,
  onToggleDomain,
  onResetAll,
}: DomainFiltersSidebarProps) {
  const sortedAssessments = useMemo(
    () =>
      [...assessments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [assessments],
  );

  const latestAssessment = sortedAssessments[sortedAssessments.length - 1];

  return (
    <div className="w-56 shrink-0">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Filtros por Domínio
      </div>

      <div className="space-y-2">
        {allDomains.map((domain) => {
          const isSelected = selectedDomainKeys.includes(domain.key);
          const score = latestAssessment?.domains[domain.key] ?? 0;
          const max = IVCF_DOMAIN_MAX[domain.key];
          const percent = Math.round((score / max) * 100);
          const Icon = domainIcons[domain.key];
          const color = domain.color ?? "#64748b";

          return (
            <div
              key={domain.key}
              onClick={() => onToggleDomain(domain.key)}
              className={cn(
                "cursor-pointer rounded-xl p-3 transition-all border-2",
                isSelected
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-transparent bg-gray-50 hover:bg-gray-100",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isSelected ? "text-blue-600" : "text-gray-400",
                    )}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {domain.label}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-lg font-bold",
                    isSelected ? "text-blue-600" : "text-gray-500",
                  )}
                >
                  {percent}
                </span>
              </div>

              {/* Mini sparkline bars */}
              <div className="flex items-end gap-0.5">
                {sortedAssessments.map((assessment) => {
                  const val = assessment.domains[domain.key] ?? 0;
                  const ratio = max > 0 ? val / max : 0;
                  return (
                    <div
                      key={assessment.id}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${Math.max(4, ratio * 20)}px`,
                        backgroundColor: isSelected ? color : "#cbd5e1",
                        opacity: isSelected ? 0.3 + ratio * 0.7 : 0.4,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onResetAll}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" />
        Redefinir filtros
      </button>
    </div>
  );
}
