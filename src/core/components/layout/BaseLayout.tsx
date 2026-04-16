import { Box, Dropdown, IconButton } from "../ui";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import { useState } from "react";
import { User, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/core/theme/ThemeContext";
import { clientRoutes } from "@/core/configs/client.routes";
import { AuthGuard } from "@/core/guards/AuthGuard";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function BaseLayout() {
  const router = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [openDropdown, setOpenDropdown] = useState(false);

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
            <img
              src="/logo.png"
              alt="IVCF-20 Logo"
              className="h-9 object-contain"
            />

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
        <main className="container mx-auto p-2">
          <Outlet />
        </main>

        <NavBar />
      </div>
    </AuthGuard>
  );
}
