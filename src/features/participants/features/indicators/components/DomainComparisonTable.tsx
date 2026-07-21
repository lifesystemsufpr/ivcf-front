import { useMemo } from "react";
import type { IVCF_AssessmentWithDate, IVCF_DomainScores } from "../types";
import type { DomainDefinition } from "./MultipleLineChart";
import { IVCF_DOMAIN_MAX } from "@/core/consts/ivcf.consts";
import { cn } from "@/core/utils";

type DomainKey = keyof IVCF_DomainScores;

type DomainComparisonTableProps = {
  assessments: IVCF_AssessmentWithDate[];
  allDomains: DomainDefinition[];
  selectedDomainKeys: DomainKey[];
};

function getStatus(delta: number) {
  const abs = Math.abs(delta);
  if (abs >= 50)
    return {
      label: "Alta variação",
      className: "bg-orange-100 text-orange-700",
    };
  if (abs >= 25)
    return {
      label: "Significativo",
      className: "bg-emerald-100 text-emerald-700",
    };
  return { label: "Estável", className: "bg-gray-100 text-gray-600" };
}

export function DomainComparisonTable({
  assessments,
  allDomains,
  selectedDomainKeys,
}: DomainComparisonTableProps) {
  const sorted = useMemo(
    () =>
      [...assessments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [assessments],
  );

  const baseline = sorted[0];
  const followUp = sorted[sorted.length - 1];

  const activeDomains = useMemo(
    () => allDomains.filter((d) => selectedDomainKeys.includes(d.key)),
    [allDomains, selectedDomainKeys],
  );

  if (!baseline || !followUp || baseline.id === followUp.id) return null;

  return (
    <div className="bg-gray-200 p-5 rounded-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Matriz de Comparação por Domínio
      </h3>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Domínio funcional
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Baseline (1ª)
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Follow-up (última)
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Delta
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {activeDomains.map((domain, idx) => {
              const max = IVCF_DOMAIN_MAX[domain.key];
              const baseVal = baseline.domains[domain.key] ?? 0;
              const followVal = followUp.domains[domain.key] ?? 0;
              const basePercent = Math.round((baseVal / max) * 100);
              const followPercent = Math.round((followVal / max) * 100);
              const delta = followPercent - basePercent;
              const status = getStatus(delta);

              return (
                <tr
                  key={domain.key}
                  className={cn(
                    "border-b border-gray-100",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                  )}
                >
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {domain.label}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{basePercent}/100</td>
                  <td className="py-4 px-4 text-gray-600">
                    {followPercent}/100
                  </td>
                  <td
                    className={cn(
                      "py-4 px-4 font-semibold",
                      delta > 0
                        ? "text-red-600"
                        : delta < 0
                          ? "text-emerald-600"
                          : "text-gray-500",
                    )}
                  >
                    {delta > 0 ? "+" : ""}
                    {delta}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
