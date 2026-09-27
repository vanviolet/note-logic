import { Github, Instagram, Mail, Heart } from "lucide-react";

export function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 text-sm md:px-8 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 font-semibold">
              <span className="app-icon-aura relative">
                <img
                  src="/note-logic-icon-colored.png"
                  alt="NoteLogic"
                  className="relative z-10 size-8 object-contain transition-transform duration-200 hover:scale-105"
                />
              </span>
              <span className="text-base tracking-tight">
                Note<span className="text-primary">Logic</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Build your music intuition, not just memorize formulas.
            </p>
          </div>

          {/* Creator & Social Links */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:vanviolet.js@gmail.com"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              title="Kirim Email ke Muchamad Irvan"
            >
              <Mail className="size-3.5 text-primary" />
              <span>vanviolet.js@gmail.com</span>
            </a>
            <a
              href="https://www.instagram.com/vanviolet.js?stkn=MWRkMmM4ZHA0eTNrcQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-pink-500/40 hover:text-foreground"
              title="Instagram @vanviolet.js"
            >
              <Instagram className="size-3.5 text-pink-500" />
              <span>Instagram</span>
            </a>
            <a
              href="https://github.com/vanviolet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              title="GitHub vanviolet"
            >
              <Github className="size-3.5 text-foreground" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} NoteLogic. Hak cipta dilindungi undang-undang.</p>
          <p className="inline-flex items-center gap-1">
            Dibuat oleh{" "}
            <span className="font-medium text-foreground">Muchamad Irvan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
