import * as React from "react";
import type { FwCtxType } from "./type";
import { FW_CONF } from "./config";

export const FwCtx = React.createContext<FwCtxType>({
  initialHeight: FW_CONF.defaultHeight,
  initialWidth: FW_CONF.defaultWidth,
  minHeight: FW_CONF.defaultMinHeight,
  minWidth: FW_CONF.defaultMinWidth,
});

export const useFwCtx = () => {
  const context = React.useContext(FwCtx);
  if (!context) {
    throw new Error("useFwCtx must be used within a AwakeningDialogProvider");
  }
  return context;
};
