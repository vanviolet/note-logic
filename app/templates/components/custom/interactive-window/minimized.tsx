import { Package } from "lucide-react";
import React from "react";
import { useFwCtx } from "./context";
import { recalcMinimizedPositions, bringToFront } from "./method";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/templates/components/ui/tooltip";

const FwMinimizedContent = React.forwardRef<HTMLDivElement, {}>(
  (props, _ref) => {
    const {
      refContent,
      refFw,
      refMinimizedContent,
      onMaximized,
      title,
      description,
      isMobile,
      icon,
      setIsFullscreen,
    } = useFwCtx();

    if (isMobile) return null; // no minimized feature on mobile

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="minimized-content hidden"
              {...props}
              ref={refMinimizedContent}
              onClick={(e) => {
                e.preventDefault();
                const _currentDialog = refFw?.current;
                const _currentContent = refContent?.current;
                const _currentMinimizedContent = refMinimizedContent?.current;
                if (!_currentMinimizedContent) return;
                if (!_currentDialog) return;
                if (!_currentContent) return;
                _currentContent.classList.toggle("hidden");
                _currentDialog.classList.toggle("no-drag");
                _currentDialog.style.transition = "none";
                _currentDialog.classList.remove("is-minimized");

                // Use stored pre-minimize geometry/state
                const state = _currentDialog.getAttribute("data-min-state");
                const prevWidth = parseFloat(
                  _currentDialog.getAttribute("data-min-dw") || "0",
                );
                const prevHeight = parseFloat(
                  _currentDialog.getAttribute("data-min-dh") || "0",
                );
                const prevX = parseFloat(
                  _currentDialog.getAttribute("data-min-dx") || "0",
                );
                const prevY = parseFloat(
                  _currentDialog.getAttribute("data-min-dy") || "0",
                );
                _currentDialog.style.transition = "all 0.3s ease";
                if (state === "fullscreen") {
                  _currentDialog.style.width = `${window.innerWidth}px`;
                  _currentDialog.style.height = `${window.innerHeight}px`;
                  _currentDialog.style.transform = `translate(0, 0)`;
                  setIsFullscreen?.(true);
                } else {
                  _currentDialog.style.width = `${prevWidth}px`;
                  _currentDialog.style.height = `${prevHeight}px`;
                  _currentDialog.style.transform = `translate(${prevX}px, ${prevY}px)`;
                  setIsFullscreen?.(false);
                }
                // zIndex handled by bringToFront
                _currentMinimizedContent.classList.add("hidden");
                _currentMinimizedContent.classList.remove("flex");

                bringToFront(_currentDialog);
                recalcMinimizedPositions();
                onMaximized?.();
              }}
            >
              {icon || <Package />}
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" align="center">
            <div className="font-semibold">{title}</div>
            <div className="text-xs opacity-70 max-w-[160px] line-clamp-3">
              {description}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

FwMinimizedContent.displayName = "FwMinimizedContent";
export { FwMinimizedContent };
