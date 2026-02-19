import { Box } from "@/core/components/ui";
import NewAssessment from "../components/NewAssessment";
import { AssessmentListProvider } from "../contexts/AssessmentListContext";
import AssessmentList from "../containers/AssessmentList";
import ListFilters from "../containers/ListFilters";

export function AssessmentPage() {
  return (
    <AssessmentListProvider>
      <Box type="screen">
        <ListFilters />
        <AssessmentList />
        <Box className="self-end radius-full absolute bottom-4 right-4">
          <NewAssessment />
        </Box>
      </Box>
    </AssessmentListProvider>
  );
}
