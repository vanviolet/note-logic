"use client";

import * as React from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

export type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {},
): boolean {
  const getMatches = (queryString: string): boolean => {
    if (IS_SERVER) {
      return defaultValue;
    }
    return window.matchMedia(queryString).matches;
  };

  const [matches, setMatches] = React.useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  function handleChange() {
    setMatches(getMatches(query));
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);

    handleChange();

    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query]);

  return matches;
}
