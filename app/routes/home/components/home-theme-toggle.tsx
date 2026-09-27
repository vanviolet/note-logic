import { Moon, Sun } from "lucide-react";
import { useTheme } from "~/templates/components/theme-provider";
import { Button } from "~/templates/components/ui/button";
import { useIsClient } from "~/templates/hooks";

function resolveDarkMode(theme: "dark" | "light" | "system") {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function HomeThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  const isDarkMode = isClient ? resolveDarkMode(theme) : false;

  const toggleTheme = () => {
    const next = isDarkMode ? "light" : "dark";
    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }
    document.startViewTransition(() => {
      setTheme(next);
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isDarkMode ? "Aktifkan light mode" : "Aktifkan dark mode"}
      onClick={toggleTheme}
    >
      {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
