import { useIsDarkMode } from "./home-theme";

export function HomeBackgroundEffects() {
  const isDarkMode = useIsDarkMode();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {isDarkMode ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_70%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.06),transparent_70%)]" />
      )}
    </div>
  );
}
