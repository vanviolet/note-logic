"use client";

import * as React from "react";

/**
 * A React hook that runs a cleanup function when the component unmounts.
 *
 * @param fn - The cleanup function to run on unmount
 */
export function useUnmount(fn: () => void): void {
  if (typeof fn !== "function") {
    throw new Error("useUnmount expects a function as argument");
  }

  const fnRef = React.useRef(fn);

  fnRef.current = fn;

  React.useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
}
