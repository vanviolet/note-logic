"use client";

import { useEventListener } from "./use-event-listener";

/**
 * Custom hook that handles click events anywhere on the document
 * @param handler The function to be called when a click event is detected anywhere on the document
 */
export function useClickAnyWhere(handler: (event: MouseEvent) => void): void {
  useEventListener("click", (event) => {
    handler(event);
  });
}
