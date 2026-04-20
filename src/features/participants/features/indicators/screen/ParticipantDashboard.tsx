import { useCallback, useMemo, useRef, useState } from "react";
import {
  DomainTable,
  type DomainTableDomainDefinition,
} from "../components/DomainTable";
import { EvolutionPulseHeader } from "../components/EvolutionPulseHeader";
import { LinearScoreChart } from "../components/LinearScoreChart";
import { WebChart } from "../components/WebChart";
import { AssessmentDetailModal } from "@/features/assessment/containers/AssessmentDetailModal";
import type { Daily_Assessment, IVCF_DomainScores } from "../types";
import { useFetchIndicators } from "../hooks/useFetchIndicators";
import {
  getOnlyFirstAssessmentPerDay,
  getLatestAssessment,
  getFirstAssessment,
} from "../utils/data-adapter";

type DomainKey = keyof IVCF_DomainScores;

const ALL_DOMAINS: DomainTableDomainDefinition[] = [
  { key: "age", label: "Idade" },
  { key: "selfPerception", label: "Autopercepção" },
  { key: "functionalCapacity", label: "Atv. de Vida Diária" },
  { key: "cognition", label: "Cognição" },
  { key: "mood", label: "Humor" },
  { key: "mobility", label: "Mobilidade" },
  { key: "communication", label: "Comunicação" },
  { key: "comorbidities", label: "Comorbidades" },
];

const ALL_DOMAIN_KEYS: DomainKey[] = ALL_DOMAINS.map((d) => d.key);

export function ParticipantDashboard({
  participantId,
}: {
  participantId: string;
}) {
  const { data, isLoading, error } = useFetchIndicators(participantId);

  const dailyAssessments = useMemo<Daily_Assessment[]>(() => {
    if (isLoading || error || !data?.dailyAssessments) return [];
    return data.dailyAssessments;
  }, [data, isLoading, error]);

  const flatAssessments = useMemo(
    () => getOnlyFirstAssessmentPerDay(dailyAssessments),
    [dailyAssessments],
  );

  const firstAssessment = useMemo(
    () => getFirstAssessment(dailyAssessments),
    [dailyAssessments],
  );

  const lastAssessment = useMemo(
    () => getLatestAssessment(dailyAssessments),
    [dailyAssessments],
  );

  const [selectedId, setSelectedId] = useState("");
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleSelectAssessment = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  // Aggregate stats
  const aggregateScore = lastAssessment?.totalScore ?? 0;
  const deltaAbsolute = aggregateScore - (firstAssessment?.totalScore ?? 0);
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

  if (!flatAssessments.length) {
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
            assessments={dailyAssessments}
            height={320}
            onSelectAssessment={handleSelectAssessment}
          />
        </div>

        <div className="rounded-lg border bg-card p-5">
          <WebChart assessments={dailyAssessments} height={320} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
          <DomainTable
            assessments={flatAssessments}
            domains={ALL_DOMAINS}
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
