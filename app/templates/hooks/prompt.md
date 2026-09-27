# React Custom Hooks - AI Reference

Complete list of available React hooks with their signatures and use cases.

## State Management

### `useBoolean(defaultValue?: boolean)`
Boolean state with setTrue, setFalse, toggle helpers.

### `useCounter(initialValue?: number)`
Counter state with increment, decrement, reset operations.

### `useMap<K, V>(initialState?: Map<K, V> | [K, V][])`
Map state management with set, setAll, remove, reset actions.

### `useStep(maxStep: number)`
Step-based navigation for wizards/multi-step forms. Returns current step and navigation controls.

## Timers

### `useCountdown(options: CountdownOptions)`
Countdown/countup timer with start, stop, reset controls. Options: countStart, intervalMs, isIncrement, countStop.

### `useInterval(callback: () => void, delay: number | null)`
Execute callback at regular intervals. Pass null to pause.

### `useTimeout(callback: () => void, delay: number | null)`
Execute callback after delay. Pass null to cancel.

## Events

### `useEventListener(eventName, handler, element?, options?)`
Add event listener with auto cleanup. Works with window, document, element refs, and MediaQueryList.

### `useClickAnyWhere(handler: (event: MouseEvent) => void)`
Detect clicks anywhere in document.

### `useHover<T extends HTMLElement>(elementRef: RefObject<T>)`
Returns boolean indicating if element is hovered.

### `useOnClickOutside<T>(ref: RefObject<T> | RefObject<T>[], handler, eventType?, options?)`
Detect clicks outside element(s). Supports multiple refs.

## UI/UX

### `useDarkMode(options?: DarkModeOptions)`
Dark mode with localStorage persistence and OS preference detection. Auto-applies 'dark' class to html root.

### `useMediaQuery(query: string, options?)`
Match CSS media queries. Returns boolean.

### `useScrollLock(options?: UseScrollLockOptions)`
Lock/unlock page scroll. Prevents layout shift. Options: autoLock, lockTarget, widthReflow.

### `useCopyToClipboard()`
Copy text to clipboard. Returns [copyFn, isCopied] tuple. isCopied auto-resets after 2s.

### `useScreen(options?)`
Get window.screen info with optional debouncing. Returns width, height, orientation, etc.

## Observers

### `useIntersectionObserver(options?)`
Detect element visibility in viewport. Returns [ref, isIntersecting, entry]. Supports freezeOnceVisible, threshold, rootMargin.

### `useMousePosition<T>()`
Track mouse position. Returns [position, ref]. Position includes pageX/Y and element-relative coordinates.

## Performance

### `useDebounceCallback<T>(func: T, delay?: number, options?)`
Debounce function calls. Returns debounced function with cancel, flush, isPending methods.

### `useDebounceValue<T>(initialValue: T, delay: number, options?)`
Debounce state value changes. Returns [debouncedValue, updateFn].

### `useEventCallback<Args, R>(fn: (...args: Args) => R)`
Create stable callback ref that always uses latest values. Prevents unnecessary re-renders.

## Utilities

### `useIsClient()`
Returns true if running on client-side. False during SSR.

### `useIsMounted()`
Returns function that checks if component is still mounted. Useful for async operations.

### `useIsomorphicLayoutEffect`
useLayoutEffect on client, useEffect on server. Safe for SSR.

### `useUnmount(fn: () => void)`
Execute cleanup function on component unmount.

## Usage Pattern

```typescript
import { useBoolean, useCounter, useDarkMode } from '@/templates/hooks';

// Only imported hooks are bundled (tree-shaking)
const { value, toggle } = useBoolean(false);
const { count, increment } = useCounter(0);
const { isDarkMode, toggle: toggleTheme } = useDarkMode();
```

## Notes

- All hooks are tree-shakeable
- Full TypeScript support with type inference
- Client-safe with SSR checks where needed
- Auto cleanup on unmount for event listeners and observers
