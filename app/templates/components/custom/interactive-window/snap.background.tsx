import React from "react";
import { useFwCtx } from "./context";
import { FW_CONF } from "./config";

const FwSnap = React.forwardRef<HTMLDivElement, {}>(() => {
  const { refSnap, disableSnap } = useFwCtx();
  if (disableSnap) return null;
  return (
    <div
      ref={refSnap}
      className={FW_CONF.snapBackgroundClass}
      style={{ zIndex: FW_CONF.zIndexSnap }}
    ></div>
  );
});

FwSnap.displayName = "FwSnap";
export { FwSnap };
