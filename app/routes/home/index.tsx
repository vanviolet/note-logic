import type { Route } from "./+types";
import { HomeFooter } from "./components/home-footer";
import { HomeHero } from "./components/home-hero";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Learn Music Theory" },
    {
      name: "description",
      content:
        "Platform belajar teori musik interaktif: Chord Explorer, Interval, Harmonic Family, Tuner, Songbook, Nolopedia, dan Tab Studio.",
    },
  ];
}

export default function HomeRoute() {
  return (
    <>
      <HomeHero />
      <div className="relative z-10">
        <HomeFooter />
      </div>
    </>
  );
}
