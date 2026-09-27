import React from "react";
import type { FwCtxType } from "./type";
import { FwEffectResize } from "./effect.resizeable";
import { FwEffectDrag } from "./effect.draggable";
import { FwContainer } from "./dialog";
import { FwSnap } from "./snap.background";
import { FwCtx } from "./context";
import { FW_CONF } from "./config";

export default function FwRoot({
  id = FW_CONF.defaultId,
  title = FW_CONF.defaultTitle,
  description = FW_CONF.defaultDescription,
  initialWidth = FW_CONF.defaultWidth,
  initialHeight = FW_CONF.defaultHeight,
  minWidth = FW_CONF.defaultMinWidth,
  minHeight = FW_CONF.defaultMinHeight,
  refContent,
  refFw,
  refMinimizedContent,
  refSnap,
  snap,
  ...props
}: Partial<FwCtxType>) {
  const _refSnap = refSnap || React.useRef<HTMLDivElement | null>(null);
  const _refFw = refFw || React.useRef<HTMLDivElement | null>(null);
  const _refContent = refContent || React.useRef<HTMLDivElement | null>(null);
  const _refMinimizedContent =
    refMinimizedContent || React.useRef<HTMLDivElement | null>(null);

  snap = {
    ...FW_CONF.defaultSnap,
    ...snap,
  };

  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const calcIsMobile = () => window.innerWidth < FW_CONF.mobileBreakpoint;
    const mobile = calcIsMobile();
    setIsMobile(mobile);
    if (mobile && _refFw.current) {
      // store previous dimensions before forcing fullscreen
      const el = _refFw.current;
      if (!isFullscreen) {
        el.setAttribute(
          "dpw",
          el.getAttribute("dw") || initialWidth.toString(),
        );
        el.setAttribute(
          "dph",
          el.getAttribute("dh") || initialHeight.toString(),
        );
        el.setAttribute("dpx", el.getAttribute("dx") || "0");
        el.setAttribute("dpy", el.getAttribute("dy") || "0");
        el.style.transition = "all 0.3s ease";
        el.style.width = `${window.innerWidth}px`;
        el.style.height = `${window.innerHeight}px`;
        el.style.transform = `translate(0, 0)`;
        setIsFullscreen(true);
      }
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      // If currently fullscreen (desktop) keep matching viewport
      if (isFullscreen && _refFw.current) {
        const el = _refFw.current;
        el.style.width = `${window.innerWidth}px`;
        el.style.height = `${window.innerHeight}px`;
        el.style.transform = `translate(0, 0)`;
      }
    }

    const onResize = () => {
      const m = calcIsMobile();
      setIsMobile(m);
      if (m && _refFw.current) {
        const el = _refFw.current;
        el.style.width = `${window.innerWidth}px`;
        el.style.height = `${window.innerHeight}px`;
        el.style.transform = `translate(0, 0)`;
        setIsFullscreen(true);
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } else if (!m) {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        if (isFullscreen && _refFw.current) {
          const el = _refFw.current;
          el.style.width = `${window.innerWidth}px`;
          el.style.height = `${window.innerHeight}px`;
          el.style.transform = `translate(0, 0)`;
        }
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [initialHeight, initialWidth, isFullscreen]);

  return (
    <FwCtx.Provider
      value={{
        description,
        id,
        initialHeight,
        initialWidth,
        minHeight,
        minWidth,
        title,
        snap,
        refContent: _refContent,
        refFw: _refFw,
        refMinimizedContent: _refMinimizedContent,
        refSnap: _refSnap,
        isFullscreen,
        isMobile,
        setIsFullscreen,
        setIsMobile,
        minimizedVariant: props.minimizedVariant || "primary",
        icon: props.icon,
        ...props,
      }}
    >
      <FwEffectResize />
      <FwEffectDrag />
      <FwSnap />
      <FwContainer />
    </FwCtx.Provider>
  );
}
