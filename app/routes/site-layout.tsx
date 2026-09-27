import { Suspense, lazy } from "react";
import { Outlet, useLocation, useNavigation } from "react-router";
import {
  SiteRouteTransitionTopSlider,
  SiteShellHeaderFallback,
} from "./components/site-shell-fallbacks";
import { HomeBackgroundEffects } from "./home/components/home-background-effects";

const HomeHeader = lazy(() =>
  import("./home/components/home-header").then((module) => ({
    default: module.HomeHeader,
  })),
);

export default function SiteLayoutRoute() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      {isHome && <HomeBackgroundEffects />}

      <Suspense fallback={<SiteShellHeaderFallback />}>
        <HomeHeader />
      </Suspense>

      <main className="relative z-10">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>

      {isNavigating ? <SiteRouteTransitionTopSlider /> : null}
    </div>
  );
}
