import { Box, IconButton } from "../ui";
import { ThemeToggle } from "../ThemeToggle";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";
import { useState } from "react";
import { Menu } from "lucide-react";

export function BaseLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-md">
        <Box
          display="flex"
          justify="space-between"
          align="center"
          className="container mx-auto p-4"
        >
          <IconButton
            icon={Menu}
            ariaLabel="Open navigation menu"
            onClick={() => setNavOpen(true)}
          />
          <ThemeToggle />
        </Box>
      </header>
      <main className="container mx-auto p-6">
        <Outlet />
      </main>

      <NavBar open={navOpen} onClose={() => setNavOpen(false)} />
    </div>
  );
}
