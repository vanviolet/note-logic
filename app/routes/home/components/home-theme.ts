import { useMemo } from "react";
import { useTheme } from "~/templates/components/theme-provider";
import { useIsClient } from "~/templates/hooks";

export function useIsDarkMode() {
  const isClient = useIsClient();
  const { theme } = useTheme();

  return useMemo(() => {
    if (!isClient) return false;
    if (theme === "dark") return true;
    if (theme === "light") return false;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, [isClient, theme]);
}
