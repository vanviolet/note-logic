"use client";

import * as React from "react";

export type UseCopyToClipboardReturn = [
  (text: string) => Promise<void>,
  boolean,
];

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = React.useState(false);

  const copy = React.useCallback(async (text: string): Promise<void> => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.warn("Copy failed", error);
      setIsCopied(false);
    }
  }, []);

  return [copy, isCopied];
};
