import { Box } from "@/core/components/ui";
import { MOCK_EVOLUTION_DATA } from "../mocks/participant.indicators.mock";
import { MultipleLineChart } from "../components/MultipleLineChart";
import { WebChart } from "../components/WebChart";
import LastIndicators from "../components/LastIndicators";
import { LinearScoreChart } from "../components/LinearScoreChart";

export function ParticipantDashboard() {
  const EVOLUTION_DATA = MOCK_EVOLUTION_DATA;
  const lastAssessment =
    EVOLUTION_DATA.assessments[EVOLUTION_DATA.assessments.length - 1];

  return (
    <Box className="space-y-6">
      <LastIndicators lastIndicator={lastAssessment} />

      <LinearScoreChart assessments={EVOLUTION_DATA.assessments} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MultipleLineChart assessments={EVOLUTION_DATA.assessments} />
        <WebChart assessments={EVOLUTION_DATA.assessments} />
      </div>
    </Box>
  );
}
