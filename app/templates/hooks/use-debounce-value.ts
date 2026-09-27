"use client";

import * as React from "react";
import type { DebouncedState } from "./use-debounce-callback";
import { useDebounceCallback } from "./use-debounce-callback";

export type UseDebounceValueOptions<T> = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
  equalityFn?: (left: T, right: T) => boolean;
};

/**
 * Custom hook that returns a debounced version of the provided value, along with a function to update it.
 */
export function useDebounceValue<T>(
  initialValue: T | (() => T),
  delay: number,
  options?: UseDebounceValueOptions<T>,
): [T, DebouncedState<(value: T) => void>] {
  const eq = options?.equalityFn ?? ((left: T, right: T) => left === right);
  const unwrappedInitialValue =
    initialValue instanceof Function ? initialValue() : initialValue;
  const [debouncedValue, setDebouncedValue] = React.useState<T>(
    unwrappedInitialValue,
  );
  const previousValueRef = React.useRef<T | undefined>(unwrappedInitialValue);

  const updateDebouncedValue = useDebounceCallback(
    setDebouncedValue,
    delay,
    options,
  );

  if (!eq(previousValueRef.current as T, unwrappedInitialValue)) {
    updateDebouncedValue(unwrappedInitialValue);
    previousValueRef.current = unwrappedInitialValue;
  }

  return [debouncedValue, updateDebouncedValue];
}
