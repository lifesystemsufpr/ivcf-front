import { Box, Dropdown, IconButton } from "../ui";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import { useEffect, useState } from "react";
import { User, Moon, Sun, LogOut, Menu } from "lucide-react";
import { useTheme } from "@/core/theme/ThemeContext";
import { clientRoutes } from "@/core/configs/client.routes";
import { AuthGuard } from "@/core/guards/AuthGuard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useScreenInfo } from "@/core/hooks/useScreenInfo";
import logo from "@/assets/logo.png";

export function BaseLayout() {
  const router = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isMobile } = useScreenInfo();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setMobileNavOpen(false);
    }
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    router(clientRoutes.AUTH.LOGIN);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-primary">
          <Box
            display="flex"
            justify="space-between"
            align="center"
            className="container mx-auto p-4 h-18.75"
          >
            <div className="flex items-center gap-2">
              {isMobile && (
                <IconButton
                  icon={Menu}
                  ariaLabel="Abrir menu de navegacao"
                  variant="ghost"
                  color="neutral"
                  onClick={() => setMobileNavOpen(true)}
                />
              )}

              <img
                src={logo}
                alt="IVCF-20 Logo"
                className="h-9 object-contain"
              />
            </div>

            <Dropdown
              trigger={({ open, toggle }) => (
                <IconButton
                  icon={User}
                  ariaLabel="Open profile menu"
                  onClick={toggle}
                  aria-expanded={open}
                />
              )}
              placement="bottom-end"
              open={openDropdown}
              onOpenChange={setOpenDropdown}
              items={[
                {
                  label: user?.name || "Bem vindo!",
                  disabled: true,
                  description: user?.email || "",
                },
                {
                  label: theme === "light" ? "Dark Mode" : "Light Mode",
                  Icon: theme === "light" ? Moon : Sun,
                  onSelect: () => {
                    toggleTheme();
                  },
                },
                {
                  label: "Logout",
                  Icon: LogOut,
                  onSelect: () => {
                    handleLogout();
                  },
                },
              ]}
            />
          </Box>
        </header>
        <main className={!isMobile ? "ml-16 p-2" : "p-4"}>
          <div
            className={!isMobile ? "container mx-auto" : "container mx-auto"}
          >
            <Outlet />
          </div>
        </main>

        <NavBar
          isMobile={isMobile}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
