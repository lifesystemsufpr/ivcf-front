// core/components/layout/AuthLayout.tsx
import { Outlet } from "react-router-dom";
import { Box } from "../ui";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Topo Azul com Logo */}
      <Box
        className="bg-primary h-64 flex flex-col items-center justify-center p-6 text-white"
        direction="column"
      >
        <img src="/logo-ivcf.png" alt="IVCF-20" className="h-20 mb-2" />
        <p className="text-sm font-light opacity-90">
          Avaliação Clínica e Funcional Simplificada
        </p>
      </Box>

      {/* Card de Login que "sobe" no azul */}
      <main className="flex-1 -mt-10 px-4">
        <div className="max-w-md mx-auto bg-white rounded-t-[2.5rem] shadow-xl p-8 min-h-[calc(100vh-16rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
