import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { BaseLayout } from "../core/components/layout/BaseLayout";
import AuthLayout from "@/core/components/layout/AuthLayout";
import { clientRoutes } from "@/core/configs/client.routes";
import { DashboardProvider } from "@/features/dashboard/contexts/DashboardContext";

const HomePage = lazy(() => import("../features/dashboard/pages/HomePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/ForgotPassword"),
);
const ResetPasswordPage = lazy(
  () => import("@/features/auth/pages/ResetPassword"),
);
const PatientListPage = lazy(() =>
  import("@/features/participants").then((module) => ({
    default: module.PatientListPage,
  })),
);
const PatientDetailPage = lazy(() =>
  import("@/features/participants").then((module) => ({
    default: module.PatientDetailPage,
  })),
);
const AssessmentPage = lazy(() =>
  import("@/features/assessment/pages/AssessmentPage").then((module) => ({
    default: module.AssessmentPage,
  })),
);
const CreateAssessmentLayout = lazy(
  () =>
    import("@/features/assessment/features/create-flow/CreateAssessmentLayout"),
);
const InstructionsScreen = lazy(
  () =>
    import("@/features/assessment/features/create-flow/screens/InstructionsScreen"),
);
const QuizScreen = lazy(
  () => import("@/features/assessment/features/create-flow/screens/QuizScreen"),
);
const ResultScreen = lazy(
  () =>
    import("@/features/assessment/features/create-flow/screens/ResultScreen"),
);

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center p-8">
    <span className="text-muted-foreground">Carregando...</span>
  </div>
);

export function AppRoutes() {
  const basePath = import.meta.env.VITE_BASE_PATH;

  return (
    <BrowserRouter basename={basePath}>
      <Suspense fallback={<PageLoader />}>
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
            <Route
              path={clientRoutes.AUTH.REGISTER}
              element={<RegisterPage />}
            />
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
      </Suspense>
    </BrowserRouter>
  );
}
