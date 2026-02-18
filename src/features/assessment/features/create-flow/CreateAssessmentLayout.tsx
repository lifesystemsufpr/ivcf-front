import { Outlet } from "react-router-dom";
import { ParticipantProvider } from "@/features/participants/context/ParticipantContext";
import { AssessmentProvider } from "./context/CreateAssessmentContext";

export default function CreateAssessmentLayout() {
  return (
    <ParticipantProvider>
      <AssessmentProvider>
        <Outlet />
      </AssessmentProvider>
    </ParticipantProvider>
  );
}
