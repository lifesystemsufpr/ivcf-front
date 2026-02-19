import { Box, Dropdown, IconButton } from "../ui";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import { useState } from "react";
import { Menu, User, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/core/theme/ThemeContext";
import { clientRoutes } from "@/core/configs/client.routes";

export function BaseLayout() {
  const router = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-md">
        <Box
          display="flex"
          justify="space-between"
          align="center"
          className="container mx-auto p-4 h-18.75"
        >
          <IconButton
            icon={Menu}
            ariaLabel="Open navigation menu"
            onClick={() => setNavOpen(true)}
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
                label: "Profile",
                Icon: User,
                onSelect: () => {
                  console.log("Go to profile");
                },
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
                  router(clientRoutes.AUTH.LOGIN);
                },
              },
            ]}
          />
        </Box>
      </header>
      <main className="container mx-auto p-2">
        <Outlet />
      </main>

      <NavBar open={navOpen} onClose={() => setNavOpen(false)} />
    </div>
  );
}
