import { FAQ_ITEMS } from "../home-data";
import { SectionTitle } from "./section-title";

export function HomeFaq() {
  return (
    <section id="faq" className="w-full px-4 py-14 md:px-8 md:py-20 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionTitle
          badge="FAQ"
          title="Pertanyaan yang sering ditanyakan"
          description="Jawaban ringkas untuk pertanyaan umum seputar NoteLogic dan fitur-fiturnya."
        />

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-border/70 bg-card/60 px-4 py-3 open:border-primary/40"
            >
              <summary className="cursor-pointer list-none text-sm font-medium md:text-base">
                <span className="inline-flex items-start justify-between gap-4">
                  {item.question}
                  <span className="text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
