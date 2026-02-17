import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BaseLayout } from "../core/components/layout/BaseLayout";
import HomePage from "../features/dashboard/pages/HomePage";
import AuthLayout from "@/core/components/layout/AuthLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { clientRoutes } from "@/core/configs/client.routes";
import { PatientDetailPage, PatientListPage } from "@/features/participants";
import { AssessmentPage } from "@/features/assessment/pages/AssessmentPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path={clientRoutes.PARTICIPANTS.LIST}
            element={<PatientListPage />}
          />
          <Route
            path={clientRoutes.PARTICIPANTS.DETAILS({ id: ":id" })}
            element={<PatientDetailPage />}
          />
          <Route path={clientRoutes.IVCF.LIST} element={<AssessmentPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
