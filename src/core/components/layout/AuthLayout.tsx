// core/components/layout/AuthLayout.tsx
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen overflow-hidden dark:bg-gray-900">
      {/* MOBILE */}
      <div className="flex flex-1 flex-col h-full">
        {/* HEADER MOBILE */}
        <div className="lg:hidden flex flex-col items-center pt-8  px-4 shrink-0">
          <img width={110} height={14} src="/logo_new.png" alt="Logo" />
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto flex flex-1 items-start justify-center px-5">
          <Outlet />
        </div>

        <div className="mt-auto py-4 text-center text-xs text-gray-400 dark:text-white/40 shrink-0 border-t border-gray-100 dark:border-white/5">
          Desenvolvido por Life Systems
        </div>
      </div>

      <div className="hidden lg:grid lg:w-1/2 h-full bg-primary items-center">
        <div className="relative flex items-center justify-center z-10">
          <div className="flex flex-col items-center max-w-xs">
            <img width={331} height={48} src="/logo.png" alt="Logo" />
            <p className="mt-3 text-center text-gray-400 dark:text-white/60">
              IVCF-20 Digital: Inteligência para o cuidado da fragilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
