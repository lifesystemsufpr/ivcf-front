import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BaseLayout } from "../core/components/layout/BaseLayout";
import HomePage from "../features/dashboard/pages/HomePage";
import AuthLayout from "@/core/components/layout/AuthLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { clientRoutes } from "@/core/configs/client.routes";
import { PatientListPage } from "@/features/participants";

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
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
