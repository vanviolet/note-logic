// ════════════════════════════════════════════════════════
// Knowledge – AlphaTex Player Widget
// Renders and plays music notation using AlphaTab API
// ════════════════════════════════════════════════════════

import * as React from "react";
import { Play, Square, Loader2, Music } from "lucide-react";
import { cn } from "~/templates/lib/utils";

interface AlphaTexPlayerWidgetProps {
  title: string;
  tex: string;
  description?: string;
}

type PlayerState = "idle" | "loading" | "ready" | "playing" | "error";

export function AlphaTexPlayerWidget({
  title,
  tex,
  description,
}: AlphaTexPlayerWidgetProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const apiRef = React.useRef<any>(null);
  const [state, setState] = React.useState<PlayerState>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  // Detect dark mode — store in ref to avoid re-init
  const [isDark, setIsDark] = React.useState(false);
  const isDarkRef = React.useRef(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
    isDarkRef.current = dark;
    const observer = new MutationObserver(() => {
      const d = document.documentElement.classList.contains("dark");
      setIsDark(d);
      isDarkRef.current = d;
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Initialize AlphaTab once host is mounted
  React.useEffect(() => {
    let canceled = false;
    let api: any = null;
    const host = hostRef.current;

    async function init() {
      if (typeof window === "undefined" || !host) return;
      setState("loading");

      // Ensure host is clean before AlphaTab takes over
      while (host.firstChild) {
        host.removeChild(host.firstChild);
      }

      try {
        const alphaTab = await import("@coderline/alphatab");
        if (canceled || !host) return;

        const dark = isDarkRef.current;
        const mainColor = dark ? "rgba(228, 228, 228, 1)" : "rgba(0, 0, 0, 1)";
        const secondaryColor = dark
          ? "rgba(164, 164, 164, 1)"
          : "rgba(100, 100, 100, 1)";

        api = new alphaTab.AlphaTabApi(host, {
          core: {
            fontDirectory: "/font/",
            tex: true,
          },
          player: {
            enablePlayer: true,
            soundFont: "/soundfont/sonivox.sf3",
            enableCursor: true,
            enableAnimatedBeatCursor: true,
            enableElementHighlighting: true,
            scrollElement: host,
            scrollOffsetY: -10,
          },
          display: {
            staveProfile: "Default",
            resources: {
              mainGlyphColor: mainColor,
              secondaryGlyphColor: secondaryColor,
              staffLineColor: dark
                ? "rgba(100, 100, 100, 1)"
                : "rgba(200, 200, 200, 1)",
              barSeparatorColor: dark
                ? "rgba(100, 100, 100, 1)"
                : "rgba(200, 200, 200, 1)",
              scoreInfoColor: mainColor,
              barNumberColor: secondaryColor,
            },
          },
        });

        apiRef.current = api;

        api.playerReady.on(() => {
          if (canceled) return;
          api.metronomeVolume = 0;
          api.countInVolume = 0;
          api.masterVolume = 0.9;
          setState("ready");
        });

        api.playerStateChanged?.on((args: any) => {
          if (canceled) return;
          if (args?.state === 1) {
            setState("playing");
          } else {
            setState("ready");
          }
        });

        api.playerFinished?.on(() => {
          if (canceled) return;
          setState("ready");
        });

        api.error.on((error: unknown) => {
          if (canceled) return;
          const msg = error instanceof Error ? error.message : String(error);
          setErrorMsg(msg);
          setState("error");
        });

        // Render the tex
        api.tex(tex);
      } catch (e) {
        if (canceled) return;
        setErrorMsg(e instanceof Error ? e.message : String(e));
        setState("error");
      }
    }

    init();

    return () => {
      canceled = true;
      if (api) {
        try {
          api.destroy();
        } catch {
          // ignore
        }
      }
      apiRef.current = null;
      // Manually clear host DOM to prevent React removeChild conflicts
      if (host) {
        while (host.firstChild) {
          host.removeChild(host.firstChild);
        }
      }
    };
  }, [tex]); // only re-init when tex changes, not on dark mode toggle

  const handlePlayPause = React.useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    api.playPause();
  }, []);

  const handleStop = React.useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    api.stop();
  }, []);

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-card/50 p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">{title}</h3>
        </div>

        {/* Transport controls */}
        <div className="flex items-center gap-1.5">
          {state === "loading" && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Memuat...
            </span>
          )}

          {(state === "ready" || state === "playing") && (
            <>
              <button
                type="button"
                onClick={handlePlayPause}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  state === "playing"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                {state === "playing" ? (
                  <>
                    <Square className="h-3 w-3" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" /> Play
                  </>
                )}
              </button>
              {state === "playing" && (
                <button
                  type="button"
                  onClick={handleStop}
                  className="inline-flex items-center gap-1 rounded-lg bg-muted/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  <Square className="h-3 w-3" /> Stop
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}

      {state === "error" && (
        <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
          {errorMsg || "Gagal memuat player musik."}
        </div>
      )}

      {/* Loading indicator (outside the AlphaTab host to avoid DOM conflicts) */}
      {(state === "idle" || state === "loading") && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat notasi musik...
        </div>
      )}

      {/* AlphaTab render host — kept empty; AlphaTab manages its DOM */}
      <div
        ref={hostRef}
        className={cn(
          "w-full overflow-x-auto rounded-lg",
          isDark ? "at-surface-dark" : "at-surface-light",
          state === "idle" || state === "loading"
            ? "h-0 overflow-hidden"
            : "min-h-[120px]",
        )}
      />
    </div>
  );
}
