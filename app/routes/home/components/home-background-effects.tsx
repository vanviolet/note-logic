import { Particles } from "~/templates/components/custom/particle";
import { StarfieldBackground } from "~/templates/components/custom/starfield";
import { TopographyBackground } from "~/templates/components/custom/topography";
import { useIsDarkMode } from "./home-theme";

export function HomeBackgroundEffects() {
  const isDarkMode = useIsDarkMode();

  if (isDarkMode) {
    return (
      <>
        <StarfieldBackground
          className="pointer-events-none z-0"
          count={320}
          speed={0.3}
          starColor="#fc8096"
          twinkle
        />
        <Particles
          className="pointer-events-none z-1 bg-transparent opacity-35"
          color="#fc8096"
          quantity={40}
          staticity={70}
          ease={80}
          size={0.8}
        />
      </>
    );
  }

  return (
    <>
      <TopographyBackground
        className="pointer-events-none z-0"
        lineCount={18}
        lineColor="rgba(51, 65, 85, 0.12)"
        backgroundColor="#f8fafc"
        speed={0.6}
        strokeWidth={1}
      />
      <Particles
        className="pointer-events-none z-1 bg-transparent opacity-35"
        color="#475569"
        quantity={36}
        staticity={78}
        ease={80}
        size={0.85}
      />
    </>
  );
}
