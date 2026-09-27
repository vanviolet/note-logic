# Accordion

A vertically stacked set of interactive headings that each reveal an
associated section of content.

### Is it accessible?

Yes. It adheres to the WAI-ARIA design pattern.

### Is it unstyled?

### Can it be animated?

index.jsxindex.jsxstyles.cssstyles.css

CSS

```
import * as React from "react";

import { Accordion } from "radix-ui";

import classNames from "classnames";

import { ChevronDownIcon } from "@radix-ui/react-icons";

import "./styles.css";

const AccordionDemo = () => (

	<Accordion.Root
		className="AccordionRoot"
		type="single"
		defaultValue="item-1"
		collapsible
	>

		<Accordion.Item className="AccordionItem" value="item-1">

			<AccordionTrigger>Is it accessible?</AccordionTrigger>

			<AccordionContent>

				Yes. It adheres to the WAI-ARIA design pattern.

			</AccordionContent>

		</Accordion.Item>

		<Accordion.Item className="AccordionItem" value="item-2">

			<AccordionTrigger>Is it unstyled?</AccordionTrigger>

			<AccordionContent>

				Yes. It's unstyled by default, giving you freedom over the look and

				feel.

			</AccordionContent>

		</Accordion.Item>

		<Accordion.Item className="AccordionItem" value="item-3">

			<AccordionTrigger>Can it be animated?</AccordionTrigger>

			<Accordion.Content className="AccordionContent">

				<div className="AccordionContentText">

					Yes! You can animate the Accordion with CSS or JavaScript.

				</div>

			</Accordion.Content>

		</Accordion.Item>

	</Accordion.Root>

);

const AccordionTrigger = React.forwardRef(

	({ children, className, ...props }, forwardedRef) => (

		<Accordion.Header className="AccordionHeader">

			<Accordion.Trigger
				className={classNames("AccordionTrigger", className)}
				{...props}
				ref={forwardedRef}
			>

				{children}

				<ChevronDownIcon className="AccordionChevron" aria-hidden />

			</Accordion.Trigger>

		</Accordion.Header>

	),

);

const AccordionContent = React.forwardRef(

	({ children, className, ...props }, forwardedRef) => (

		<Accordion.Content
			className={classNames("AccordionContent", className)}
			{...props}
			ref={forwardedRef}
		>

			<div className="AccordionContentText">{children}</div>

		</Accordion.Content>

	),

);

export default AccordionDemo;

Expand code
```

## Features

Full keyboard navigation.

Supports horizontal/vertical orientation.

Supports Right to Left direction.

Can expand one or multiple items.

Can be controlled or uncontrolled.

## Component Reference Links

[View source](https://github.com/radix-ui/primitives/tree/main/packages/react/accordion/src)

[Report an issue](https://github.com/radix-ui/primitives/issues/new/choose)

[ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion)

## [Installation](https://www.radix-ui.com/primitives/docs/components/accordion\#installation)

Install the component from your command line.

```bash
npm install @radix-ui/react-accordion
```

## [Anatomy](https://www.radix-ui.com/primitives/docs/components/accordion\#anatomy)

Import all parts and piece them together.

```jsx
import { Accordion } from "radix-ui";

export default () => (

	<Accordion.Root>

		<Accordion.Item>

			<Accordion.Header>

				<Accordion.Trigger />

			</Accordion.Header>

			<Accordion.Content />

		</Accordion.Item>

	</Accordion.Root>

);
```

## [API Reference](https://www.radix-ui.com/primitives/docs/components/accordion\#api-reference)

### [Root](https://www.radix-ui.com/primitives/docs/components/accordion\#root)

Contains all the parts of an accordion.

| Prop | Type | Default |
| --- | --- | --- |
| `asChild`<br>Prop description | `boolean` | `false` |
| `type*`<br>Prop description | `enum`<br>See full type | No default value |
| `value`<br>Prop description | `string` | No default value |
| `defaultValue`<br>Prop description | `string` | No default value |
| `onValueChange`<br>Prop description | `function`<br>See full type | No default value |
| `value`<br>Prop description | `string[]` | `[]` |
| `defaultValue`<br>Prop description | `string[]` | `[]` |
| `onValueChange`<br>Prop description | `function`<br>See full type | No default value |
| `collapsible`<br>Prop description | `boolean` | `false` |
| `disabled`<br>Prop description | `boolean` | `false` |
| `dir`<br>Prop description | `enum`<br>See full type | `"ltr"` |
| `orientation`<br>Prop description | `enum`<br>See full type | `"vertical"` |

| Data attribute | Values |
| --- | --- |
| `[data-orientation]` | `"vertical"  | "horizontal"` |

### [Item](https://www.radix-ui.com/primitives/docs/components/accordion\#item)

Contains all the parts of a collapsible section.

| Prop | Type | Default |
| --- | --- | --- |
| `asChild`<br>Prop description | `boolean` | `false` |
| `disabled`<br>Prop description | `boolean` | `false` |
| `value*`<br>Prop description | `string` | No default value |

| Data attribute | Values |
| --- | --- |
| `[data-state]` | `"open"  | "closed"` |
| `[data-disabled]` | Present when disabled |
| `[data-orientation]` | `"vertical"  | "horizontal"` |

### [Header](https://www.radix-ui.com/primitives/docs/components/accordion\#header)

Wraps an `Accordion.Trigger`. Use the `asChild` prop to update it to the appropriate heading level for your page.

| Prop | Type | Default |
| --- | --- | --- |
| `asChild`<br>Prop description | `boolean` | `false` |

| Data attribute | Values |
| --- | --- |
| `[data-state]` | `"open"  | "closed"` |
| `[data-disabled]` | Present when disabled |
| `[data-orientation]` | `"vertical"  | "horizontal"` |

### [Trigger](https://www.radix-ui.com/primitives/docs/components/accordion\#trigger)

Toggles the collapsed state of its associated item. It should be nested inside of an `Accordion.Header`.

| Prop | Type | Default |
| --- | --- | --- |
| `asChild`<br>Prop description | `boolean` | `false` |

| Data attribute | Values |
| --- | --- |
| `[data-state]` | `"open"  | "closed"` |
| `[data-disabled]` | Present when disabled |
| `[data-orientation]` | `"vertical"  | "horizontal"` |

### [Content](https://www.radix-ui.com/primitives/docs/components/accordion\#content)

Contains the collapsible content for an item.

| Prop | Type | Default |
| --- | --- | --- |
| `asChild`<br>Prop description | `boolean` | `false` |
| `forceMount`<br>Prop description | `boolean` | No default value |

| Data attribute | Values |
| --- | --- |
| `[data-state]` | `"open"  | "closed"` |
| `[data-disabled]` | Present when disabled |
| `[data-orientation]` | `"vertical"  | "horizontal"` |

| CSS Variable | Description |
| --- | --- |
| `--radix-accordion-content-width` | The width of the content when it opens/closes |
| `--radix-accordion-content-height` | The height of the content when it opens/closes |

## [Examples](https://www.radix-ui.com/primitives/docs/components/accordion\#examples)

### [Expanded by default](https://www.radix-ui.com/primitives/docs/components/accordion\#expanded-by-default)

Use the `defaultValue` prop to define the open item by default.

```jsx
<Accordion.Root type="single" defaultValue="item-2">

	<Accordion.Item value="item-1">…</Accordion.Item>

	<Accordion.Item value="item-2">…</Accordion.Item>

</Accordion.Root>
```

### [Allow collapsing all items](https://www.radix-ui.com/primitives/docs/components/accordion\#allow-collapsing-all-items)

Use the `collapsible` prop to allow all items to close.

```jsx
<Accordion.Root type="single" collapsible>

	<Accordion.Item value="item-1">…</Accordion.Item>

	<Accordion.Item value="item-2">…</Accordion.Item>

</Accordion.Root>
```

### [Multiple items open at the same time](https://www.radix-ui.com/primitives/docs/components/accordion\#multiple-items-open-at-the-same-time)

Set the `type` prop to `multiple` to enable opening multiple items at once.

```jsx
<Accordion.Root type="multiple">

	<Accordion.Item value="item-1">…</Accordion.Item>

	<Accordion.Item value="item-2">…</Accordion.Item>

</Accordion.Root>
```

### [Rotated icon when open](https://www.radix-ui.com/primitives/docs/components/accordion\#rotated-icon-when-open)

You can add extra decorative elements, such as chevrons, and rotate it when the item is open.

```jsx
// index.jsx

import { Accordion } from "radix-ui";

import { ChevronDownIcon } from "@radix-ui/react-icons";

import "./styles.css";

export default () => (

	<Accordion.Root type="single">

		<Accordion.Item value="item-1">

			<Accordion.Header>

				<Accordion.Trigger className="AccordionTrigger">

					<span>Trigger text</span>

					<ChevronDownIcon className="AccordionChevron" aria-hidden />

				</Accordion.Trigger>

			</Accordion.Header>

			<Accordion.Content>…</Accordion.Content>

		</Accordion.Item>

	</Accordion.Root>

);
```

```css
/* styles.css */

.AccordionChevron {

	transition: transform 300ms;

}

.AccordionTrigger[data-state="open"] > .AccordionChevron {

	transform: rotate(180deg);

}
```

### [Horizontal orientation](https://www.radix-ui.com/primitives/docs/components/accordion\#horizontal-orientation)

Use the `orientation` prop to create a horizontal accordion.

```jsx
<Accordion.Root orientation="horizontal">

	<Accordion.Item value="item-1">…</Accordion.Item>

	<Accordion.Item value="item-2">…</Accordion.Item>

</Accordion.Root>
```

### [Animating content size](https://www.radix-ui.com/primitives/docs/components/accordion\#animating-content-size)

Use the `--radix-accordion-content-width` and/or `--radix-accordion-content-height` CSS variables to animate the size of the content when it opens/closes:

```jsx
// index.jsx

import { Accordion } from "radix-ui";

import "./styles.css";

export default () => (

	<Accordion.Root type="single">

		<Accordion.Item value="item-1">

			<Accordion.Header>…</Accordion.Header>

			<Accordion.Content className="AccordionContent">…</Accordion.Content>

		</Accordion.Item>

	</Accordion.Root>

);
```

```css
/* styles.css */

.AccordionContent {

	overflow: hidden;

}

.AccordionContent[data-state="open"] {

	animation: slideDown 300ms ease-out;

}

.AccordionContent[data-state="closed"] {

	animation: slideUp 300ms ease-out;

}

@keyframes slideDown {

	from {

		height: 0;

	}

	to {

		height: var(--radix-accordion-content-height);

	}

}

@keyframes slideUp {

	from {

		height: var(--radix-accordion-content-height);

	}

	to {

		height: 0;

	}

}
```

## [Accessibility](https://www.radix-ui.com/primitives/docs/components/accordion\#accessibility)

Adheres to the [Accordion WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion).

### [Keyboard Interactions](https://www.radix-ui.com/primitives/docs/components/accordion\#keyboard-interactions)

| Key | Description |
| --- | --- |
| `Space` | When focus is on an `Accordion.Trigger` of a collapsed section, expands the section. |
| `Enter` | When focus is on an `Accordion.Trigger` of a collapsed section, expands the section. |
| `Tab` | Moves focus to the next focusable element. |
| `Shift + Tab` | Moves focus to the previous focusable element. |
| `ArrowDown` | Moves focus to the next `Accordion.Trigger` when`orientation` is `vertical`. |
| `ArrowUp` | Moves focus to the previous `Accordion.Trigger` when`orientation` is `vertical`. |
| `ArrowRight` | Moves focus to the next `Accordion.Trigger` when`orientation` is `horizontal`. |
| `ArrowLeft` | Moves focus to the previous `Accordion.Trigger` when`orientation` is `horizontal`. |
| `Home` | When focus is on an `Accordion.Trigger`, moves focus to the first `Accordion.Trigger`. |
| `End` | When focus is on an `Accordion.Trigger`, moves focus to the last `Accordion.Trigger`. |

#### Quick nav

- [Installation](https://www.radix-ui.com/primitives/docs/components/accordion#installation)
- [Anatomy](https://www.radix-ui.com/primitives/docs/components/accordion#anatomy)
- [API Reference](https://www.radix-ui.com/primitives/docs/components/accordion#api-reference)
- [Root](https://www.radix-ui.com/primitives/docs/components/accordion#root)
- [Item](https://www.radix-ui.com/primitives/docs/components/accordion#item)
- [Header](https://www.radix-ui.com/primitives/docs/components/accordion#header)
- [Trigger](https://www.radix-ui.com/primitives/docs/components/accordion#trigger)
- [Content](https://www.radix-ui.com/primitives/docs/components/accordion#content)
- [Examples](https://www.radix-ui.com/primitives/docs/components/accordion#examples)
- [Expanded by default](https://www.radix-ui.com/primitives/docs/components/accordion#expanded-by-default)
- [Allow collapsing all items](https://www.radix-ui.com/primitives/docs/components/accordion#allow-collapsing-all-items)
- [Multiple items open at the same time](https://www.radix-ui.com/primitives/docs/components/accordion#multiple-items-open-at-the-same-time)
- [Rotated icon when open](https://www.radix-ui.com/primitives/docs/components/accordion#rotated-icon-when-open)
- [Horizontal orientation](https://www.radix-ui.com/primitives/docs/components/accordion#horizontal-orientation)
- [Animating content size](https://www.radix-ui.com/primitives/docs/components/accordion#animating-content-size)
- [Accessibility](https://www.radix-ui.com/primitives/docs/components/accordion#accessibility)
- [Keyboard Interactions](https://www.radix-ui.com/primitives/docs/components/accordion#keyboard-interactions)

Previous [Server-side rendering](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering)

Next [Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog)

[Edit this page on GitHub.](https://github.com/radix-ui/website/edit/main/data/primitives/docs/components/accordion.mdx "Edit this page on GitHub.")