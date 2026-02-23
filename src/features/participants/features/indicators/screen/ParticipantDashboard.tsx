import { Box } from "@/core/components/ui";
import { MOCK_EVOLUTION_DATA } from "../mocks/participant.indicators.mock";
import { MultipleLineChart } from "../components/MultipleLineChart";
import { WebChart } from "../components/WebChart";
import LastIndicators from "../components/LastIndicators";
import { LinearScoreChart } from "../components/LinearScoreChart";
import { useCallback, useState } from "react";
import { AssessmentDetailModal } from "@/features/assessment/containers/AssessmentDetailModal";

export function ParticipantDashboard() {
  const EVOLUTION_DATA = MOCK_EVOLUTION_DATA;
  const lastAssessment =
    EVOLUTION_DATA.assessments[EVOLUTION_DATA.assessments.length - 1];

  const [selectedId, setSelectedId] = useState("");

  const handleSelectAssessment = useCallback((id: string) => {
    setSelectedId(id);
    console.log("Selected assessment ID:", id);
  }, []);

  return (
    <Box className="space-y-6">
      <LastIndicators lastIndicator={lastAssessment} />

      <LinearScoreChart
        assessments={EVOLUTION_DATA.assessments}
        onSelectAssessment={handleSelectAssessment}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MultipleLineChart
          assessments={EVOLUTION_DATA.assessments}
          onSelectAssessment={handleSelectAssessment}
        />
        <WebChart assessments={EVOLUTION_DATA.assessments} />
      </div>

      <AssessmentDetailModal
        assessmentId={selectedId}
        open={!!selectedId}
        onClose={() => setSelectedId("")}
      />
    </Box>
  );
}
