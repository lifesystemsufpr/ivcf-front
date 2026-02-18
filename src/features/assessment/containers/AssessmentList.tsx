import { Box } from "@/core/components/ui";
import AssesmentCard from "../components/AssesmentCard";
import { useAssessmentList } from "../contexts/AssessmentListContext";

export default function AssessmentList() {
  const { filteredAssessments } = useAssessmentList();

  return (
    <Box
      display="flex"
      direction="column"
      gap={8}
      my={4}
      className="h-[75vh] overflow-y-auto pr-2 scrollbar-thin 
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-slate-300
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
    >
      {filteredAssessments.map((assessment) => (
        <AssesmentCard key={assessment.id} assessment={assessment} />
      ))}
    </Box>
  );
}
