# Hook Usage Instructions

These hooks already live in `app/templates/hooks` and are re-exported through the barrel file. Use them instead of rewriting duplicate logic whenever you need the behaviors listed below.

## How To Import

- Default import path: `import { useBoolean } from "@/templates/hooks";`
- Import only the hooks you need; the barrel is tree-shakeable.
- Types are exported next to each hook (for example `UseBooleanReturn`, `CountdownOptions`).
- Hooks marked as DOM-dependent already guard against SSR, so you can safely import them inside Remix/Next loaders without adding extra `typeof window` checks.

## Hook Catalog (pick, don't re-implement)

### State & Flow
- `useBoolean` – boolean toggles with `setTrue`, `setFalse`, `toggle` helpers.
- `useCounter` – counter state with `increment`, `decrement`, `reset`.
- `useMap` – managed `Map` state with `set`, `setAll`, `remove`, `reset`.
- `useStep` – wizard step control with boundary checks and guards.

### Timers & Scheduling
- `useInterval` – `setInterval` that cleans up automatically.
- `useTimeout` – `setTimeout` with declarative cancellation.
- `useCountdown` – composed from `useCounter`, `useBoolean`, `useInterval` for countdown widgets.

### Debounce & Performance
- `useDebounceCallback` – lodash-powered callback debouncer with `cancel`, `flush`, `isPending`.
- `useDebounceValue` – keeps a debounced value in sync with user input while exposing the debounced updater function.
- `useEventCallback` – stable callback identity that always closes over the latest props/state.

### DOM & Media
- `useIsomorphicLayoutEffect` – drop-in replacement for `useLayoutEffect` that falls back to `useEffect` on the server.
- `useMediaQuery` – responds to media query changes with SSR fallbacks.
- `useScreen` – exposes `window.screen` with optional resize debouncing.
- `useScrollLock` – locks `<body>` or a specific element and handles scrollbar compensation.
- `useMousePosition` – tracks global mouse position plus element-relative coordinates.
- `useIntersectionObserver` – viewport visibility tracking with freeze-once-visible behavior.

### Events & Interactions
- `useEventListener` – generic event wiring for window, document, elements, and media queries.
- `useClickAnyWhere` – global click monitor (wrapper around `useEventListener`).
- `useHover` – hover state for any ref.
- `useOnClickOutside` – detect clicks outside one or more refs (supports focus/touch events).

### UX Utilities
- `useCopyToClipboard` – clipboard write with optimistic state.
- `useDarkMode` – persisted theme mode with optional `document.documentElement` class toggling.
- `useIsClient` – `true` only after hydration; ideal for conditional rendering.
- `useIsMounted` – returns a function that tells you if the component is still mounted.
- `useUnmount` – run cleanup logic on unmount without inline `useEffect` boilerplate.

## Working With These Hooks

1. **Check the catalog first.** If the behavior exists here, import it rather than copying code from another component.
2. **Compose hooks when new UX is needed.** Example: combine `useBoolean` + `useOnClickOutside` for dropdowns, or `useDebounceValue` + `useQuery` for debounced searches.
3. **Add new hooks beside the existing ones** (in `app/templates/hooks`) and update the barrel plus this file whenever you introduce shared behavior.
4. **Prefer derived state to mutations.** Most hooks already expose setters; avoid reaching into their internals.
5. **Reference `app/templates/hooks/readme.md`** for detailed option tables and sample snippets if you need deeper context.

Following this guide keeps hook usage consistent and prevents the AI from re-implementing utilities that already exist in the template library.
