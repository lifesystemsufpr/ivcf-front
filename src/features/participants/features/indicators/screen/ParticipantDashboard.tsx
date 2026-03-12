import { useCallback, useMemo, useRef, useState } from "react";
import {
  MultipleLineChart,
  type DomainDefinition,
} from "../components/MultipleLineChart";
import { DomainComparisonTable } from "../components/DomainComparisonTable";
import { EvolutionPulseHeader } from "../components/EvolutionPulseHeader";
import { LinearScoreChart } from "../components/LinearScoreChart";
import { WebChart } from "../components/WebChart";
import { AssessmentDetailModal } from "@/features/assessment/containers/AssessmentDetailModal";
import type { IVCF_DomainScores } from "../types";
import { useFetchIndicators } from "../hooks/useFetchIndicators";

type DomainKey = keyof IVCF_DomainScores;

const ALL_DOMAINS: DomainDefinition[] = [
  { key: "age", label: "Idade", color: "#3B82F6" },
  { key: "selfPerception", label: "Autopercepção", color: "#8B5CF6" },
  { key: "functionalCapacity", label: "Cap. Funcional", color: "#F97316" },
  { key: "cognition", label: "Cognição", color: "#10B981" },
  { key: "mood", label: "Humor", color: "#EF4444" },
  { key: "mobility", label: "Mobilidade", color: "#14B8A6" },
  { key: "communication", label: "Comunicação", color: "#6366F1" },
  { key: "comorbidities", label: "Comorbidades", color: "#EAB308" },
];

const ALL_DOMAIN_KEYS: DomainKey[] = ALL_DOMAINS.map((d) => d.key);

export function ParticipantDashboard({
  participantId,
}: {
  participantId: string;
}) {
  const { data, isLoading, error } = useFetchIndicators(participantId);

  const assessments = useMemo(() => {
    if (isLoading || error || !data?.assessments) return [];
    return data.assessments;
  }, [data, isLoading, error]);

  const firstAssessment = assessments.length > 0 ? assessments[0] : null;
  const lastAssessment =
    assessments.length > 0 ? assessments[assessments.length - 1] : null;

  const [selectedId, setSelectedId] = useState("");
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleSelectAssessment = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  // Aggregate stats
  const aggregateScore = lastAssessment.totalScore;
  const deltaAbsolute = aggregateScore - firstAssessment.totalScore;
  const deltaPercent =
    firstAssessment && firstAssessment.totalScore > 0
      ? ((Math.abs(deltaAbsolute) / firstAssessment.totalScore) * 100).toFixed(
          1,
        )
      : "0";

  if (isLoading) {
    return <div className="p-6">Carregando indicadores...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Erro ao carregar indicadores do participante.
      </div>
    );
  }

  if (!assessments.length) {
    return (
      <div className="p-6 text-muted-foreground">
        Nenhuma avaliação encontrada para este participante.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <EvolutionPulseHeader
        riskLevel={lastAssessment?.riskLevel ?? "Todos"}
        participantId={participantId}
        totalScore={aggregateScore}
        deltaAbsolute={deltaAbsolute}
        deltaPercent={deltaPercent}
        exportRef={contentRef}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-5">
          <LinearScoreChart
            assessments={assessments}
            height={320}
            onSelectAssessment={handleSelectAssessment}
          />
        </div>

        <div className="rounded-lg border bg-card p-5">
          <WebChart assessments={assessments} height={320} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
          <MultipleLineChart
            assessments={assessments}
            domains={ALL_DOMAINS}
            selectedDomainKeys={ALL_DOMAIN_KEYS}
            height={380}
            onSelectAssessment={handleSelectAssessment}
          />

          <DomainComparisonTable
            assessments={assessments}
            allDomains={ALL_DOMAINS}
            selectedDomainKeys={ALL_DOMAIN_KEYS}
          />
        </div>

        <AssessmentDetailModal
          assessmentId={selectedId}
          open={!!selectedId}
          onClose={() => setSelectedId("")}
        />
      </div>
    </div>
  );
}
