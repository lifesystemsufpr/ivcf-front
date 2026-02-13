import type { ReactNode } from "react";
import { Typography } from "../ui";
import { ThemeToggle } from "../ThemeToggle";

export function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Typography variant="h4" className="text-primary font-bold">
            Meu Projeto <span className="text-accent">.</span>
          </Typography>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
