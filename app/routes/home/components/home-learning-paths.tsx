import { Link } from "react-router";
import { LEARNING_PATHS, UPCOMING_MODULES } from "../home-data";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/templates/components/ui/card";
import { SectionTitle } from "./section-title";

export function HomeLearningPaths() {
  return (
    <section
      id="learning-path"
      className="border-y border-border/50 bg-muted/20"
    >
      <div className="w-full px-4 py-14 md:px-8 md:py-20 lg:px-10">
        <SectionTitle
          badge="Learning Path"
          title="Jalur belajar yang disesuaikan dengan levelmu"
          description="Setiap path mengarahkan ke modul yang sudah tersedia. Pilih sesuai pengalaman musikmu."
          centered
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {LEARNING_PATHS.map((path) => (
            <Card
              key={path.title}
              className={
                path.featured
                  ? "border-primary/45 shadow-lg"
                  : "border-border/70"
              }
            >
              <CardHeader>
                {path.featured ? (
                  <Badge className="mb-1 w-fit">Rekomendasi</Badge>
                ) : null}
                <CardTitle>{path.title}</CardTitle>
                <CardDescription>
                  Level:{" "}
                  <span className="font-medium text-foreground">
                    {path.level}
                  </span>
                </CardDescription>
                <p className="text-sm text-muted-foreground">
                  {path.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {path.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 size-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={path.ctaHref}>{path.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Upcoming Modules */}
        <div className="mt-10 rounded-xl border border-border/70 bg-card/60 p-5 md:p-6">
          <h3 className="text-lg font-semibold">Roadmap — Modul Mendatang</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Fitur yang sedang dalam pengembangan dan riset untuk rilis
            berikutnya.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {UPCOMING_MODULES.map((module) => (
              <article
                key={module.title}
                className="rounded-lg border border-border/70 bg-background/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2">
                    <module.icon className="size-4 text-primary" />
                    <p className="font-medium">{module.title}</p>
                  </div>
                  <Badge
                    variant={
                      module.status === "Dalam Riset" ? "outline" : "secondary"
                    }
                    className="shrink-0 text-[10px]"
                  >
                    {module.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {module.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
