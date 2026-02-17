import { Box } from "@/core/components/ui";
import { assessmentsListMock } from "../mocks";
import AssesmentCard from "../components/AssesmentCard";
import NewAssessment from "../components/NewAssessment";

export function AssessmentPage() {
  const assessments = assessmentsListMock;

  return (
    <Box>
      <Box
        display="flex"
        direction="column"
        gap={8}
        my={4}
        className="h-[80vh] overflow-y-auto pr-2 scrollbar-thin 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-slate-300
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
      >
        {assessments.map((assessment) => (
          <AssesmentCard key={assessment.id} assessment={assessment} />
        ))}
      </Box>{" "}
      <Box className="self-end radius-full absolute bottom-4 right-4">
        <NewAssessment />
      </Box>
    </Box>
  );
}
