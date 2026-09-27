import React from "react";
import { useFwCtx } from "./context";

const FwContent = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  const { content } = useFwCtx();
  return (
    <div ref={ref} {...props} className="content">
      {content}
    </div>
  );
});

FwContent.displayName = "FwContent";
export { FwContent as FwContent };
