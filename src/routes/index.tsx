import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BaseLayout } from "../core/components/layout/BaseLayout";
import HomePage from "../features/dashboard/pages/HomePage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  );
}
