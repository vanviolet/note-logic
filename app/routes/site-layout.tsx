import { Suspense } from "react";
import { Outlet, useLocation, useNavigation } from "react-router";
import { SiteRouteTransitionTopSlider } from "./components/site-shell-fallbacks";
import { HomeBackgroundEffects } from "./home/components/home-background-effects";
import { HomeHeader } from "./home/components/home-header";

export default function SiteLayoutRoute() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      {isHome && <HomeBackgroundEffects />}

      <HomeHeader />

      <main className="relative z-10">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>

      {isNavigating ? <SiteRouteTransitionTopSlider /> : null}
    </div>
  );
}
