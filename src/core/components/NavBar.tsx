import { useLocation, useNavigate } from "react-router-dom";
import { clientRoutes } from "../configs/client.routes";
import { Home, Users2, ClipboardList } from "lucide-react";
import { useMemo, type ComponentType } from "react";
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
];

export default function NavBar() {
  const router = useNavigate();
  const location = useLocation();
  const activeRoute = location.pathname;

  const items = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({ ...item, active: activeRoute === item.path })),
    [activeRoute],
  );

  return (
    <aside className="group/nav fixed left-0 top-19 z-30 h-[calc(100vh-4.75rem)] w-16 hover:w-64 border-r border-border bg-card/95 shadow-lg backdrop-blur-md transition-[width] duration-300 ease-out">
      <div className="flex h-full flex-col px-2 py-4">
        <nav className="mt-4 flex flex-1 flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => router(item.path)}
                aria-label={item.label}
                title={item.label} // tooltip nativo quando colapsado
                className={cn(
                  // base
                  "inline-flex w-full items-center rounded-lg text-sm font-medium tracking-tight",
                  "h-10 select-none cursor-pointer",
                  "transition-all duration-150 ease-out active:scale-[0.97]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  // layout: colapsado → expandido via group-hover
                  "justify-center px-0",
                  "group-hover/nav:justify-start group-hover/nav:px-5",
                  // variante ativa vs ghost
                  item.active
                    ? "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover hover:shadow-md"
                    : "hover:bg-muted text-foreground",
                )}
              >
                {/* Ícone — sempre visível */}
                <span
                  className="shrink-0 inline-flex items-center"
                  aria-hidden="true"
                >
                  <Icon size={18} />
                </span>

                {/* Label — animada via CSS, sem state */}
                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap text-left",
                    "max-w-0 opacity-0 ml-0",
                    "group-hover/nav:max-w-40 group-hover/nav:opacity-100 group-hover/nav:ml-2",
                    "transition-all duration-300 ease-out",
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
  );
}
