import { Maximize, Minus, Minimize2, Package, X } from "lucide-react";
import { Button as ComponentButton } from "~/templates/components/ui/button";
import React from "react";
import { useFwCtx } from "./context";

import { FW_CONF } from "./config";
import { recalcMinimizedPositions, bringToFront } from "./method";
import {
  detachClass$,
  embedClass$,
  embedMetadata$,
  embedStyle$,
  extractMetadata,
  px,
} from "./util";
import { cn } from "~/templates/lib/utils";

const FwHead = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  const ctx = useFwCtx();
  const {
    refContent,
    refFw,
    refMinimizedContent,
    description,
    id,
    onClosed,
    onMinimized,
    title,
    root,
    isFullscreen,
    setIsFullscreen,
    isMobile,
    onFullscreen,
    onUnfullscreen,
    icon,
    minimizedVariant = "primary",
  } = ctx;

  return (
    <div
      ref={ref}
      {...props}
      className={cn("header", FW_CONF.draggableAllowFromClass)}
    >
      <div className="left">
        <div className="title">
          {icon || <Package className="icon" />}
          <div className="typo large">{title}</div>
        </div>
        {description && <div className="typo muted">{description}</div>}
      </div>
      <div className="right">
        {!isMobile && (
          <ComponentButton
            className="no-drag"
            variant={"outline"}
            size={"icon"}
            onClick={(e) => {
              e.preventDefault();
              const { dw, dh, dx, dy } = extractMetadata(refFw);
              embedClass$(refContent, ["hidden"]);
              embedClass$(refFw, ["no-drag", "is-minimized"]);
              embedClass$(refMinimizedContent, [
                "flex",
                `variant-${minimizedVariant}`,
              ]);
              // store precise pre-minimize state & geometry
              const el = refFw?.current;
              if (el) {
                const minDw = dw || el.clientWidth.toString();
                const minDh = dh || el.clientHeight.toString();
                el.setAttribute("data-min-dw", minDw);
                el.setAttribute("data-min-dh", minDh);
                el.setAttribute("data-min-dx", dx || "0");
                el.setAttribute("data-min-dy", dy || "0");
                const snapState = el.getAttribute("ds");
                el.setAttribute(
                  "data-min-state",
                  isFullscreen ? "fullscreen" : snapState || "free",
                );
              }
              embedMetadata$(refFw, {
                dpw: dw,
                dph: dh,
                dpx: dx,
                dpy: dy,
              });
              embedStyle$(refFw, {
                transition: "all 0.3s ease",
                width: px(50),
                height: px(50),
              });
              detachClass$(refMinimizedContent, ["hidden"]);
              onMinimized?.();
              recalcMinimizedPositions();
            }}
          >
            <Minus />
          </ComponentButton>
        )}
        {!isMobile && (
          <ComponentButton
            className="no-drag"
            variant={"outline"}
            size={"icon"}
            onClick={(e) => {
              e.preventDefault();
              const el = refFw?.current;
              if (!el) return;
              if (!isFullscreen) {
                const lastWidth = parseFloat(el.getAttribute("dw")!);
                const lastHeight = parseFloat(el.getAttribute("dh")!);
                const lastX = parseFloat(el.getAttribute("dx")!);
                const lastY = parseFloat(el.getAttribute("dy")!);
                el.setAttribute("dpw", lastWidth.toString());
                el.setAttribute("dph", lastHeight.toString());
                el.setAttribute("dpx", lastX.toString());
                el.setAttribute("dpy", lastY.toString());
                el.style.transition = "all 0.3s ease";
                el.style.width = `${window.innerWidth}px`;
                el.style.height = `${window.innerHeight}px`;
                el.style.transform = `translate(0, 0)`;
                setIsFullscreen?.(true);
                bringToFront(el);
                onFullscreen?.();
              } else {
                const prevWidth = parseFloat(el.getAttribute("dpw") || "0");
                const prevHeight = parseFloat(el.getAttribute("dph") || "0");
                const prevX = parseFloat(el.getAttribute("dpx") || "0");
                const prevY = parseFloat(el.getAttribute("dpy") || "0");
                el.style.transition = "all 0.3s ease";
                if (prevWidth && prevHeight) {
                  el.style.width = `${prevWidth}px`;
                  el.style.height = `${prevHeight}px`;
                }
                el.style.transform = `translate(${prevX}px, ${prevY}px)`;
                setIsFullscreen?.(false);
                bringToFront(el);
                onUnfullscreen?.();
              }
            }}
          >
            {isFullscreen ? <Minimize2 /> : <Maximize />}
          </ComponentButton>
        )}
        <ComponentButton
          className="awkd-close-btn no-drag"
          variant={"outline"}
          size={"icon"}
          onClick={(e) => {
            e.preventDefault();
            const container = document.getElementById(id || "");
            if (container) document.body.removeChild(container);
            root?.unmount();
            onClosed?.(e, ctx);
            recalcMinimizedPositions();
          }}
        >
          <X />
        </ComponentButton>
      </div>
    </div>
  );
});

FwHead.displayName = "FwHead";
export { FwHead };
