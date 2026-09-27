import { Link } from "react-router";
import { CORE_FEATURES } from "../home-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/templates/components/ui/card";
import { SectionTitle } from "./section-title";

export function HomeFeatureGrid() {
  return (
    <section
      id="fitur"
      className="w-full px-4 py-14 md:px-8 md:py-20 lg:px-10"
    >
      <SectionTitle
        badge="Fitur Tersedia"
        title="Semua modul interaktif yang siap kamu gunakan"
        description="7 modul pembelajaran musik yang sudah lengkap dengan audio playback, visual interaktif, dan data yang kaya."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CORE_FEATURES.map((feature) => (
          <Link key={feature.title} to={feature.href} className="group">
            <Card className="h-full border-border/70 bg-card/60 transition-colors group-hover:border-primary/40">
              <CardHeader className="gap-3">
                <span className="w-fit rounded-md border border-primary/30 bg-primary/15 p-2 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
