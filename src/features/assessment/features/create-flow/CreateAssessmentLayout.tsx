import { Outlet } from "react-router-dom";
import { CreateAssessmentProvider } from "./context/CreateAssessmentContext";

<CreateAssessmentProvider>
  <Outlet />
</CreateAssessmentProvider>;
