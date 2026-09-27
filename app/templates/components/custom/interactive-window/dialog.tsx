import React, { useEffect } from "react";
import { useFwCtx } from "./context";

import { FwHead } from "./header";
import { FwMinimizedContent } from "./minimized";
import { FwContent } from "./content";
import { detachClass$, embedClass$ } from "./util";
import { getMajorWindow, closeWindowById, bringToFront } from "./method";
import { FW_CONF } from "./config";
import { cn } from "~/templates/lib/utils";

const FwContainer = React.forwardRef<HTMLDivElement, {}>((props, _ref) => {
  const ctx = useFwCtx();
  const { refContent, refFw, id, order, onDialogMouseDown } = ctx;

  useEffect(() => {
    detachClass$(getMajorWindow(), [FW_CONF.windowMajorClass]);
    embedClass$(refFw, [FW_CONF.windowMajorClass]);
    bringToFront(refFw?.current || null);
  }, []);

  return (
    <div
      className={cn(FW_CONF.containerClass, id)}
      ref={refFw || _ref}
      autoFocus
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          closeWindowById(id, ctx);
        }
      }}
      onMouseDown={(e) => {
        detachClass$(getMajorWindow(), [FW_CONF.windowMajorClass]);
        embedClass$(refFw, [FW_CONF.windowMajorClass]);
        bringToFront(refFw?.current || null);
        onDialogMouseDown?.(e, ctx);
      }}
      {...props}
      style={{ zIndex: FW_CONF.zIndex + (order || 0) }}
    >
      <div className="fw-inner" ref={refContent}>
        <FwHead />
        <FwContent />
      </div>
      <FwMinimizedContent />
    </div>
  );
});

FwContainer.displayName = "FwContainer";
export { FwContainer };
