import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BaseLayout } from "../core/components/layout/BaseLayout";
import HomePage from "../features/dashboard/pages/HomePage";
import AuthLayout from "@/core/components/layout/AuthLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { clientRoutes } from "@/core/configs/client.routes";
import { PatientDetailPage, PatientListPage } from "@/features/participants";
import { AssessmentPage } from "@/features/assessment/pages/AssessmentPage";
import CreateAssessmentLayout from "@/features/assessment/features/create-flow/CreateAssessmentLayout";
import InstructionsScreen from "@/features/assessment/features/create-flow/screens/InstructionsScreen";
import QuizScreen from "@/features/assessment/features/create-flow/screens/QuizScreen";
import ResultScreen from "@/features/assessment/features/create-flow/screens/ResultScreen";
import { DashboardProvider } from "@/features/dashboard/contexts/DashboardContext";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPassword";
import ResetPasswordPage from "@/features/auth/pages/ResetPassword";

export function AppRoutes() {
  const basename = import.meta.env.VITE_BASE_PATH || "/ivcf";

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route
            path="/"
            element={
              <DashboardProvider>
                <HomePage />
              </DashboardProvider>
            }
          />
          <Route
            path={clientRoutes.PARTICIPANTS.LIST}
            element={<PatientListPage />}
          />
          <Route
            path={clientRoutes.PARTICIPANTS.DETAILS({ id: ":id" })}
            element={<PatientDetailPage />}
          />
          <Route path={clientRoutes.IVCF.LIST} element={<AssessmentPage />} />
          <Route element={<CreateAssessmentLayout />}>
            <Route
              path={clientRoutes.IVCF.INSTRUCTIONS}
              element={<InstructionsScreen />}
            />
            <Route path={clientRoutes.IVCF.TEST} element={<QuizScreen />} />
            <Route
              path={clientRoutes.IVCF.RESULT({ id: ":id" })}
              element={<ResultScreen />}
            />
          </Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path={clientRoutes.AUTH.LOGIN} element={<LoginPage />} />
          <Route path={clientRoutes.AUTH.REGISTER} element={<RegisterPage />} />
          <Route
            path={clientRoutes.AUTH.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
          <Route
            path={clientRoutes.AUTH.RESET_PASSWORD}
            element={<ResetPasswordPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
