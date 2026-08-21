import { useLocation, useNavigate } from "react-router-dom";
import { clientRoutes } from "../configs/client.routes";
import { Home, Users2, ClipboardList, Share2 } from "lucide-react";
import { startTransition, useMemo, type ComponentType } from "react";
import { cn } from "../utils";

type NavItem = {
  label: string;
  path: string;
  icon: ComponentType<{ size?: number }>;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/", icon: Home },
  {
    label: "Participantes",
    path: clientRoutes.PARTICIPANTS.LIST,
    icon: Users2,
  },
  { label: "Avaliações", path: clientRoutes.IVCF.LIST, icon: ClipboardList },
  {
    label: "Solicitações",
    path: clientRoutes.SHARE_REQUESTS.LIST,
    icon: Share2,
  },
];

type NavBarProps = {
  isMobile?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function NavBar({
  isMobile = false,
  mobileOpen = false,
  onMobileClose,
}: NavBarProps) {
  const router = useNavigate();
  const location = useLocation();
  const activeRoute = location.pathname;

  const items = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({ ...item, active: activeRoute === item.path })),
    [activeRoute],
  );

  const handleNavigate = (path: string) => {
    if (isMobile) {
      onMobileClose?.(); // fecha o drawer imediatamente (alta prioridade)
    }
    startTransition(() => {
      router(path); // navegação como atualização de baixa prioridade
    });
  };

  return (
    <>
      {isMobile && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onMobileClose}
          className={cn(
            "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200",
            mobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0",
          )}
        />
      )}

      <aside
        className={cn(
          "border-r border-border bg-card/95 shadow-lg backdrop-blur-md",
          isMobile
            ? "fixed left-0 top-0 z-50 h-screen w-64 transition-transform duration-300 ease-out"
            : "group/nav fixed left-0 top-19 z-30 h-[calc(100vh-4.75rem)] w-16 transition-[width] duration-300 ease-out hover:w-64",
          isMobile && (mobileOpen ? "translate-x-0" : "-translate-x-full"),
        )}
      >
        <div
          className={cn("flex h-full flex-col px-2 py-4", isMobile && "pt-20")}
        >
          <nav className="mt-4 flex flex-1 flex-col gap-2">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  aria-label={item.label}
                  title={!isMobile ? item.label : undefined}
                  className={cn(
                    "inline-flex w-full items-center rounded-lg text-sm font-medium tracking-tight",
                    "h-10 select-none cursor-pointer",
                    "transition-all duration-150 ease-out active:scale-[0.97]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isMobile
                      ? "justify-start px-5"
                      : "justify-center px-0 group-hover/nav:justify-start group-hover/nav:px-5",
                    item.active
                      ? "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover hover:shadow-md"
                      : "hover:bg-muted text-foreground",
                  )}
                >
                  <span
                    className="shrink-0 inline-flex items-center"
                    aria-hidden="true"
                  >
                    <Icon size={18} />
                  </span>

                  <span
                    className={cn(
                      "overflow-hidden whitespace-nowrap text-left transition-all duration-300 ease-out",
                      isMobile
                        ? "ml-2 max-w-40 opacity-100"
                        : "ml-0 max-w-0 opacity-0 group-hover/nav:ml-2 group-hover/nav:max-w-40 group-hover/nav:opacity-100",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
