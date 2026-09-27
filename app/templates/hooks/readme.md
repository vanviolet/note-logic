# React Custom Hooks

A comprehensive collection of reusable React hooks for common functionality. All hooks are tree-shakeable - only the hooks you import will be included in your bundle.

## Installation

```bash
npm install lodash.debounce @types/lodash.debounce
```

## Usage

```typescript
// Import only what you need - tree-shaking will remove unused hooks
import { useBoolean, useCounter, useDarkMode } from '@/templates/hooks';

function MyComponent() {
  const { value, toggle } = useBoolean(false);
  const { count, increment } = useCounter(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

## Available Hooks

### State Management

#### `useBoolean`
Manage boolean state with convenient helper methods.

```typescript
const { value, setValue, setTrue, setFalse, toggle } = useBoolean(false);
```

**Returns:**
- `value`: Current boolean value
- `setValue`: Set value directly
- `setTrue`: Set to true
- `setFalse`: Set to false
- `toggle`: Toggle between true/false

---

#### `useCounter`
Counter state management with increment, decrement, and reset operations.

```typescript
const { count, increment, decrement, reset, setCount } = useCounter(0);
```

**Parameters:**
- `initialValue?: number` - Initial count value (default: 0)

**Returns:**
- `count`: Current count value
- `increment`: Increment by 1
- `decrement`: Decrement by 1
- `reset`: Reset to initial value
- `setCount`: Set count directly

---

#### `useMap`
Manage Map state with convenient methods.

```typescript
const [map, { set, setAll, remove, reset }] = useMap<string, number>();
```

**Parameters:**
- `initialState?: Map<K, V> | [K, V][]` - Initial map or entries

**Returns:**
- `map`: Current Map instance (read-only)
- `set(key, value)`: Set a single entry
- `setAll(entries)`: Replace entire map
- `remove(key)`: Remove an entry
- `reset()`: Clear the map

---

#### `useStep`
Manage step-based navigation (wizards, multi-step forms).

```typescript
const [currentStep, { goToNextStep, goToPrevStep, reset, canGoToNextStep, canGoToPrevStep, setStep }] = useStep(5);
```

**Parameters:**
- `maxStep: number` - Maximum step number

**Returns:**
- `currentStep`: Current step (1-indexed)
- `goToNextStep`: Move to next step
- `goToPrevStep`: Move to previous step
- `reset`: Reset to step 1
- `canGoToNextStep`: Boolean indicating if next step is available
- `canGoToPrevStep`: Boolean indicating if previous step is available
- `setStep`: Set step directly

---

### Timer Hooks

#### `useCountdown`
Countdown timer with start/stop/reset controls.

```typescript
const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
  countStart: 60,
  intervalMs: 1000,
  isIncrement: false,
  countStop: 0
});
```

**Options:**
- `countStart: number` - Starting count value
- `intervalMs?: number` - Interval in milliseconds (default: 1000)
- `isIncrement?: boolean` - Count up instead of down (default: false)
- `countStop?: number` - Stop value (default: 0)

---

#### `useInterval`
Execute a function at regular intervals.

```typescript
useInterval(() => {
  console.log('Tick');
}, 1000); // Run every second
```

**Parameters:**
- `callback: () => void` - Function to execute
- `delay: number | null` - Interval in ms, or null to pause

---

#### `useTimeout`
Execute a function after a delay.

```typescript
useTimeout(() => {
  console.log('Executed after 3 seconds');
}, 3000);
```

**Parameters:**
- `callback: () => void` - Function to execute
- `delay: number | null` - Delay in ms, or null to cancel

---

### Event Hooks

#### `useEventListener`
Add event listeners with automatic cleanup.

```typescript
const buttonRef = useRef<HTMLButtonElement>(null);

useEventListener('click', (e) => {
  console.log('Clicked!', e);
}, buttonRef);
```

**Parameters:**
- `eventName: string` - Event name
- `handler: (event) => void` - Event handler
- `element?: RefObject<T>` - Target element (default: window)
- `options?: AddEventListenerOptions` - Event listener options

---

#### `useClickAnyWhere`
Detect clicks anywhere in the document.

```typescript
useClickAnyWhere((event) => {
  console.log('Clicked at:', event.pageX, event.pageY);
});
```

---

#### `useHover`
Detect hover state on an element.

```typescript
const hoverRef = useRef<HTMLDivElement>(null);
const isHovered = useHover(hoverRef);

return <div ref={hoverRef}>{isHovered ? 'Hovering!' : 'Not hovering'}</div>;
```

---

#### `useOnClickOutside`
Detect clicks outside of element(s).

```typescript
const modalRef = useRef<HTMLDivElement>(null);

useOnClickOutside(modalRef, () => {
  console.log('Clicked outside modal');
});

// Multiple refs
useOnClickOutside([ref1, ref2], handleClickOutside);
```

**Parameters:**
- `ref: RefObject<T> | RefObject<T>[]` - Element reference(s)
- `handler: (event) => void` - Click handler
- `eventType?: EventType` - Event type (default: 'mousedown')
- `eventListenerOptions?: AddEventListenerOptions` - Listener options

---

### UI/UX Hooks

#### `useDarkMode`
Dark mode management with localStorage persistence.

```typescript
const { isDarkMode, toggle, enable, disable, set } = useDarkMode({
  defaultValue: false,
  localStorageKey: 'theme-mode',
  initializeWithValue: true,
  applyDarkClass: true
});
```

**Options:**
- `defaultValue?: boolean` - Default mode (default: false)
- `localStorageKey?: string` - Storage key (default: 'usehooks-ts-dark-mode')
- `initializeWithValue?: boolean` - Initialize with stored value (default: true)
- `applyDarkClass?: boolean` - Add 'dark' class to document root (default: true)

---

#### `useMediaQuery`
Match CSS media queries.

```typescript
const isMobile = useMediaQuery('(max-width: 768px)');
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
```

**Parameters:**
- `query: string` - Media query string
- `options?: { defaultValue?: boolean, initializeWithValue?: boolean }`

---

#### `useScrollLock`
Lock/unlock scrolling on page or element.

```typescript
const { isLocked, lock, unlock } = useScrollLock({
  autoLock: true,
  lockTarget: document.body,
  widthReflow: true
});
```

**Options:**
- `autoLock?: boolean` - Auto-lock on mount (default: true)
- `lockTarget?: HTMLElement | string` - Element to lock (default: body)
- `widthReflow?: boolean` - Prevent width shift (default: true)

---

#### `useCopyToClipboard`
Copy text to clipboard with status.

```typescript
const [copy, isCopied] = useCopyToClipboard();

<button onClick={() => copy('Hello World!')}>
  {isCopied ? 'Copied!' : 'Copy'}
</button>
```

**Returns:**
- `copy: (text: string) => Promise<void>` - Copy function
- `isCopied: boolean` - Copy status (auto-resets after 2s)

---

### Observer Hooks

#### `useIntersectionObserver`
Detect when element enters/exits viewport.

```typescript
const [ref, isIntersecting, entry] = useIntersectionObserver({
  threshold: 0.5,
  root: null,
  rootMargin: '0px',
  freezeOnceVisible: false
});

return <div ref={ref}>{isIntersecting ? 'Visible!' : 'Not visible'}</div>;
```

**Options:**
- `threshold?: number | number[]` - Intersection threshold (default: 0)
- `root?: Element | null` - Root element (default: viewport)
- `rootMargin?: string` - Root margin (default: '0%')
- `freezeOnceVisible?: boolean` - Stop observing after first intersection
- `onChange?: (isIntersecting, entry) => void` - Callback on change
- `initialIsIntersecting?: boolean` - Initial state

---

#### `useMousePosition`
Track mouse position relative to page/element.

```typescript
const [position, ref] = useMousePosition<HTMLDivElement>();

return (
  <div ref={ref}>
    Mouse: {position.x}, {position.y}
    Element: {position.elementX}, {position.elementY}
  </div>
);
```

**Returns:**
- `x, y`: Page coordinates
- `elementX, elementY`: Coordinates relative to element
- `elementPositionX, elementPositionY`: Element position on page

---

### Performance Hooks

#### `useDebounceCallback`
Debounce a callback function.

```typescript
const debouncedSearch = useDebounceCallback(
  (searchTerm: string) => {
    // API call
  },
  500,
  { leading: false, trailing: true }
);
```

**Parameters:**
- `func: Function` - Function to debounce
- `delay?: number` - Delay in ms (default: 500)
- `options?: { leading?, trailing?, maxWait? }` - Lodash debounce options

**Returns:**
- Debounced function with `cancel()`, `flush()`, `isPending()` methods

---

#### `useDebounceValue`
Debounce a state value.

```typescript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedValue, updateDebouncedValue] = useDebounceValue(
  searchTerm,
  500
);
```

**Parameters:**
- `initialValue: T | (() => T)` - Initial value
- `delay: number` - Delay in ms
- `options?: { leading?, trailing?, maxWait?, equalityFn? }`

---

#### `useEventCallback`
Create stable callback reference with latest values.

```typescript
const handleClick = useEventCallback((value: string) => {
  // Always uses latest props/state
  console.log(latestValue);
});
```

---

### Utility Hooks

#### `useIsClient`
Check if code is running on client.

```typescript
const isClient = useIsClient();

if (isClient) {
  // Safe to use window, document, etc.
}
```

---

#### `useIsMounted`
Check if component is mounted.

```typescript
const isMounted = useIsMounted();

useEffect(() => {
  fetchData().then(data => {
    if (isMounted()) {
      setState(data);
    }
  });
}, []);
```

---

#### `useIsomorphicLayoutEffect`
useLayoutEffect that works on server (uses useEffect on server).

```typescript
useIsomorphicLayoutEffect(() => {
  // Runs synchronously after DOM mutations (client)
  // Runs as useEffect on server
}, []);
```

---

#### `useUnmount`
Run cleanup function on component unmount.

```typescript
useUnmount(() => {
  console.log('Component unmounted');
  // Cleanup subscriptions, timers, etc.
});
```

---

#### `useScreen`
Get window.screen information with optional debouncing.

```typescript
const screen = useScreen({
  initializeWithValue: true,
  debounceDelay: 200
});

console.log(screen?.width, screen?.height, screen?.orientation);
```

---

## Tree-Shaking

This library is fully tree-shakeable. Only the hooks you import will be included in your final bundle:

```typescript
// ✅ Good - only useBoolean and useCounter are bundled
import { useBoolean, useCounter } from '@/templates/hooks';

// ❌ Avoid - imports everything (but still tree-shakeable with good bundler)
import * as hooks from '@/templates/hooks';
```

## TypeScript

All hooks are written in TypeScript with full type definitions. Type inference works automatically:

```typescript
const [map, actions] = useMap<string, number>(); // Map<string, number>
const { count } = useCounter(0); // number
```

## Browser Support

All hooks work in modern browsers. Some hooks (like `useIntersectionObserver`, `useCopyToClipboard`) require specific browser APIs and include appropriate checks.

## License

MIT
