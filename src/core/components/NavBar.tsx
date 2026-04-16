import { useLocation, useNavigate } from "react-router-dom";
import { clientRoutes } from "../configs/client.routes";
import { Button, Separator, Typography } from "./ui";
import { Home, Users2, ClipboardList } from "lucide-react";
import { useMemo, useState, type ComponentType } from "react";
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
  const [hovered, setHovered] = useState(false);

  const activeRoute = location.pathname;

  const items = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        ...item,
        active: activeRoute === item.path,
      })),
    [activeRoute],
  );

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "fixed left-0 top-19 z-30 h-[calc(100vh-4.75rem)] border-r border-border bg-card/95 shadow-lg backdrop-blur-md transition-[width] duration-300 ease-out",
        hovered ? "w-64" : "w-16",
      )}
    >
      <div className="flex h-full flex-col px-2 py-4">
        <nav className="mt-4 flex flex-1 flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.path}
                variant={item.active ? "secondary" : "ghost"}
                size="icon"
                fullWidth={hovered}
                tooltip={!hovered ? item.label : undefined}
                aria-label={item.label}
                className={cn(
                  "transition-all duration-400",
                  hovered ? "justify-start px-5" : "justify-center px-0",
                )}
                onClick={() => {
                  router(item.path);
                }}
                leftIcon={<Icon size={18} />}
              >
                {hovered && (
                  <span
                    className={cn(
                      "overflow-hidden text-left transition-all duration-300",
                      hovered ? "max-w-40 opacity-100" : "max-w-0 opacity-0",
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
