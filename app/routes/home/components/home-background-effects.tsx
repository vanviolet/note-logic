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
          count={90}
          speed={0.25}
          starColor="#fc8096"
          twinkle
        />
        <Particles
          className="pointer-events-none z-1 bg-transparent opacity-30"
          color="#fc8096"
          quantity={20}
          staticity={70}
          ease={80}
          size={0.7}
        />
      </>
    );
  }

  return (
    <>
      <TopographyBackground
        className="pointer-events-none z-0"
        lineCount={12}
        lineColor="rgba(51, 65, 85, 0.10)"
        backgroundColor="#f8fafc"
        speed={0.5}
        strokeWidth={1}
      />
      <Particles
        className="pointer-events-none z-1 bg-transparent opacity-25"
        color="#475569"
        quantity={18}
        staticity={78}
        ease={80}
        size={0.75}
      />
    </>
  );
}
