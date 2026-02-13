import { useTheme } from "../theme/ThemeContext";
import { Button } from "./ui";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme}>
      {theme === "light" ? "🌙 Escuro" : "☀️ Claro"}
    </Button>
  );
}
