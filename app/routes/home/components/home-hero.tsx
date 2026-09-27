import { ArrowRight, Radio, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { HERO_METRICS, NAV_GROUPS } from "../home-data";
import { NeonBackground } from "~/templates/components/custom/neon";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/templates/components/ui/card";
import { useIsDarkMode } from "./home-theme";

export function HomeHero() {
  const isDarkMode = useIsDarkMode();

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border/50"
    >
      {isDarkMode ? (
        <NeonBackground
          className="pointer-events-none absolute inset-0 z-0 bg-transparent opacity-80"
          count={5}
          intensity={0.8}
          speed={0.7}
          colors={["#fc2646", "#ff6b35", "#e11d48", "#fb7185", "#ff3d68"]}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.25),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-32 bg-linear-to-b from-primary/10 to-transparent" />

      <div className="relative z-10 grid w-full gap-10 px-4 py-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-24">
        <div>
          <Badge className="mb-4" variant="secondary">
            <Sparkles />
            Platform Belajar Musik Interaktif
          </Badge>

          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Belajar teori musik lebih jelas, terarah, dan menyenangkan.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            NoteLogic menyediakan 7 modul interaktif: dari Chord Explorer,
            Interval, Harmonic Family, sampai Guitar Tuner, Songbook, dan Tab
            Studio — semua dengan audio playback dan visual yang intuitif.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/chord">
                Jelajahi Chord Explorer
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#fitur">Lihat Semua Fitur</a>
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <Button asChild variant="link" className="px-0">
              <Link to="/nolopedia">Buka Nolopedia</Link>
            </Button>
            <Button asChild variant="link" className="px-0">
              <Link to="/songbook">Buka Songbook</Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 sm:max-w-md sm:gap-3">
            {HERO_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-border/70 bg-card/60 px-2 py-3 text-center backdrop-blur sm:px-3"
              >
                <p className="text-sm font-bold sm:text-base">
                  {metric.value}
                </p>
                <p className="mt-1 text-[11px] leading-tight text-muted-foreground sm:text-xs">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right card: feature overview */}
        <Card className="border-border/70 bg-card/70 shadow-xl backdrop-blur">
          <CardHeader>
            <Badge variant="outline" className="mb-2 w-fit">
              <Radio />
              Modul Tersedia
            </Badge>
            <CardTitle>Dari Teori ke Praktik Musik Nyata</CardTitle>
            <CardDescription>
              Setiap modul dirancang agar kamu bisa langsung menerapkan teori ke
              instrument, aransemen, dan produksi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {NAV_GROUPS.map((group) => (
              <div
                key={group.label}
                className="rounded-lg border border-border/70 bg-background/70 p-4"
              >
                <p className="font-medium text-foreground">{group.label}</p>
                <p className="mt-1">
                  {group.items.map((item) => item.title).join(" • ")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
