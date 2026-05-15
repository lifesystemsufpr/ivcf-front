// core/components/layout/AuthLayout.tsx
import { Outlet } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function AuthLayout() {
  return (
    <div className="flex lg:flex-row w-screen h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
      <div className="lg:w-1/2 w-full h-full flex items-center justify-center">
        <Outlet />
      </div>
      <div className="lg:w-1/2 w-full h-full bg-primary lg:grid items-center hidden">
        <div className="relative items-center justify-center  flex z-1">
          {/* <!-- ===== Common Grid Shape Start ===== --> */}
          <div className="flex flex-col items-center max-w-xs">
            <img width={331} height={48} src={logo} alt="Logo" />
            <p className="text-center text-gray-400 dark:text-white/60">
              IVCF-20 Digital: Inteligência para o cuidado da fragilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
