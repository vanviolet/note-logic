import { Particles } from "~/templates/components/custom/particle";

export function HomeFooter() {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="flex w-full flex-col gap-4 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
        <div className="inline-flex items-center gap-2 font-semibold">
          <span className="app-icon-aura relative">
            <Particles
              className="absolute inset-0 overflow-hidden rounded-full bg-transparent"
              quantity={18}
              staticity={20}
              ease={40}
              size={0.35}
              color="#fc2646"
              vx={0}
              vy={-0.15}
            />
            <img
              src="/note-logic-icon-colored.png"
              alt="NoteLogic"
              className="relative z-10 size-8 object-contain"
            />
          </span>
          <span>
            Note<span className="text-primary">Logic</span>
          </span>
        </div>
        <p className="text-muted-foreground">
          Build your music intuition, not just memorize formulas.
        </p>
      </div>
    </footer>
  );
}
