import React from "react";
import { useFwCtx } from "./context";
import interact from "interactjs";
import {
  calcPosCenterScreen,
  detachMetadata$,
  detachStyle$,
  dotPrefix,
  embedMetadata$,
  embedStyle$,
  extractMetadata,
  percent,
  px,
  translate,
} from "./util";
import { FW_CONF } from "./config";

const FwEffectDrag = React.forwardRef<HTMLDivElement, {}>(() => {
  const {
    refFw,
    refSnap,
    initialHeight,
    initialWidth,
    snap,
    disableSnap,
    isFullscreen,
    setIsFullscreen,
  } = useFwCtx();

  // Keep latest fullscreen state for interact.js handlers (avoid stale closure)
  const isFullscreenRef = React.useRef(isFullscreen);
  React.useEffect(() => {
    isFullscreenRef.current = isFullscreen;
  }, [isFullscreen]);

  React.useEffect(() => {
    if (!refFw?.current) return;
    const fwElement = refFw.current;

    const { x, y } = calcPosCenterScreen({
      width: initialWidth,
      height: initialHeight,
    });

    embedMetadata$(refFw, {
      dw: initialWidth.toString(),
      dh: initialHeight.toString(),
      dx: x.toString(),
      dy: y.toString(),
    });

    embedStyle$(refFw, {
      width: px(initialWidth),
      height: px(initialHeight),
      transform: translate(x, y),
    });

    interact(fwElement).draggable({
      allowFrom: dotPrefix(FW_CONF.draggableAllowFromClass),
      ignoreFrom: ".no-drag",
      listeners: {},
      inertia: false,
      onstart(event) {
        detachStyle$(refFw, ["transition"]);
        const { ds, dpw, dph, dpx, dpy } = extractMetadata(fwElement);

        // If currently fullscreen (using ref to avoid stale closure): exit fullscreen at drag start
        if (isFullscreenRef.current) {
          // Restore previous geometry if available, else center
          const restoreWidth = dpw ? parseFloat(dpw) : fwElement.clientWidth;
          const restoreHeight = dph ? parseFloat(dph) : fwElement.clientHeight;
          let restoreX = dpx ? parseFloat(dpx) : 0;
          let restoreY = dpy ? parseFloat(dpy) : 0;

          if (!dpx || !dpy) {
            const { x: cx, y: cy } = calcPosCenterScreen({
              width: restoreWidth,
              height: restoreHeight,
            });
            restoreX = cx;
            restoreY = cy;
          }

          embedStyle$(refFw, {
            width: px(restoreWidth),
            height: px(restoreHeight),
            transform: translate(restoreX, restoreY),
          });

          embedMetadata$(refFw, {
            dw: restoreWidth.toString(),
            dh: restoreHeight.toString(),
            dx: restoreX.toString(),
            dy: restoreY.toString(),
          });

          setIsFullscreen?.(false); // triggers header icon swap
        }

        if (ds) {
          // Use current live dimensions (may have been resized after snap)
          const prevWidth = fwElement.clientWidth;
          const prevHeight = fwElement.clientHeight;

          const cursorX = event.clientX;
          const cursorY = event.clientY;

          const x = cursorX - prevWidth / 2;
          const y = cursorY;

          detachMetadata$(refFw, ["ds"]);

          embedMetadata$(refFw, {
            dx: x.toString(),
            dy: y.toString(),
            dw: prevWidth.toString(),
            dh: prevHeight.toString(),
          });

          embedStyle$(refFw, {
            transform: translate(x, y),
            width: px(prevWidth),
            height: px(prevHeight),
          });

          interact(fwElement).resizable({
            edges: { left: true, top: true, right: true, bottom: true },
          });
        }
      },
      onmove(event) {
        event.preventDefault();
        const { dx, dy, dw, dh } = extractMetadata(fwElement);

        const x = (parseFloat(dx) || 0) + event.dx;
        let y = (parseFloat(dy) || 0) + event.dy;

        if (!disableSnap) {
          const width = parseFloat(dw) || initialWidth;
          const height = parseFloat(dh) || initialHeight;

          const overRight = window.innerWidth - width - x < -50;
          const overLeft = x < -50;
          const overTop = y < 4;
          const overBottom = window.innerHeight - height - y < -50;

          if (overRight && snap?.right) {
            embedMetadata$(refFw, { ds: "right" });
            embedStyle$(refSnap, {
              left: "50%",
              right: px(snap.offsetScreen || 0),
              top: px(snap.offsetScreen || 0),
              bottom: px(snap.offsetScreen || 0),
              opacity: "1",
            });
          }

          if (overLeft && snap?.left) {
            embedMetadata$(refFw, { ds: "left" });
            embedStyle$(refSnap, {
              right: "50%",
              left: px(snap.offsetScreen || 0),
              top: px(snap.offsetScreen || 0),
              bottom: px(snap.offsetScreen || 0),
              opacity: "1",
            });
          }

          if (overTop && snap?.top) {
            embedMetadata$(refFw, { ds: "top" });
            embedStyle$(refSnap, {
              bottom: "50%",
              top: px(snap.offsetScreen || 0),
              left: px(snap.offsetScreen || 0),
              right: px(snap.offsetScreen || 0),
              opacity: "1",
            });
          }

          if (overBottom && snap?.bottom) {
            embedMetadata$(refFw, { ds: "bottom" });
            embedStyle$(refSnap, {
              top: "50%",
              bottom: px(snap.offsetScreen || 0),
              left: px(snap.offsetScreen || 0),
              right: px(snap.offsetScreen || 0),
              opacity: "1",
            });
          }

          if (!overRight && !overLeft && !overTop && !overBottom) {
            detachMetadata$(refFw, ["ds"]);

            embedStyle$(refSnap, {
              top: percent(snap?.backgroundVanishOffset || 0),
              bottom: percent(snap?.backgroundVanishOffset || 0),
              left: percent(snap?.backgroundVanishOffset || 0),
              right: percent(snap?.backgroundVanishOffset || 0),
              opacity: "0",
            });
          }
        }

        if (y < 0) {
          y = 0;
        }

        embedStyle$(refFw, { transform: translate(x, y) });
        embedMetadata$(refFw, { dx: x.toString(), dy: y.toString() });
      },
      onend() {
        const { dw, dh, ds } = extractMetadata(fwElement);
        embedMetadata$(refFw, {
          dpw: dw,
          dph: dh,
        });

        if (ds && !disableSnap) {
          embedStyle$(refFw, { transition: "all 0.3s ease" });
          let snapX = 0;
          let snapY = 0;
          let snapWidth = 0;
          let snapHeight = 0;

          switch (ds) {
            case "right":
              if (!snap?.right) break;
              snapX = window.innerWidth / 2;
              snapY = snap.offsetScreen || 0;
              snapWidth = window.innerWidth / 2 - (snap.offsetScreen || 0);
              snapHeight = window.innerHeight - 2 * (snap.offsetScreen || 0);

              interact(fwElement).resizable({
                edges: { right: false },
              });
              break;

            case "left":
              if (!snap?.left) break;
              snapX = snap.offsetScreen || 0;
              snapY = snap.offsetScreen || 0;
              snapWidth = window.innerWidth / 2 - (snap.offsetScreen || 0);
              snapHeight = window.innerHeight - 2 * (snap.offsetScreen || 0);

              interact(fwElement).resizable({
                edges: { left: false },
              });
              break;

            case "top":
              if (!snap?.top) break;
              snapX = snap.offsetScreen || 0;
              snapY = snap.offsetScreen || 0;
              snapWidth = window.innerWidth - 2 * (snap.offsetScreen || 0);
              snapHeight = window.innerHeight / 2 - (snap.offsetScreen || 0);

              interact(fwElement).resizable({
                edges: { top: false },
              });
              break;

            case "bottom":
              if (!snap?.bottom) break;
              snapX = snap.offsetScreen || 0;
              snapY = window.innerHeight / 2;
              snapWidth = window.innerWidth - 2 * (snap.offsetScreen || 0);
              snapHeight = window.innerHeight / 2 - (snap.offsetScreen || 0);

              interact(fwElement).resizable({
                edges: { bottom: false },
              });
              break;
          }

          embedStyle$(refFw, {
            width: px(snapWidth),
            height: px(snapHeight),
            transform: translate(snapX, snapY),
          });

          embedMetadata$(refFw, {
            dx: snapX.toString(),
            dy: snapY.toString(),
            dw: snapWidth.toString(),
            dh: snapHeight.toString(),
          });

          embedStyle$(refSnap, { opacity: "0" });
        }
      },
    });

    return () => interact(fwElement).unset();
  }, []);
  return undefined;
});

FwEffectDrag.displayName = "FwEffectDrag";
export { FwEffectDrag };
