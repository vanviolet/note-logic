# Documentation Usage Instructions

Before creating or updating features, consult the curated references under `.github/docs` so implementations stay aligned with our design system, routing conventions, and state patterns.

## Components & UI Patterns

- Always reference `.github/docs/ui.shadcn.com` (shadcn/ui cheatsheets) and `.github/docs/radix/components` + `.github/docs/radix/guides` for component behaviors, accessibility notes, and prop contracts.
- When designing a new component or extending an existing one, start from the relevant markdown (for example `ui.shadcn.com/button.md` or `radix/components/dialog.mdx`) and mirror the documented variants, keyboard interactions, and anatomy before writing code.
- Prefer composing existing primitives from Radix/shadcn instead of inventing ad-hoc DOM; the docs outline recommended structure, state machines, and styling hooks.

## Routing & Navigation

- For anything related to routes, loaders, actions, or navigation semantics, read `.github/docs/react-router-v7`—especially `index.md` and the `api` directory—so changes respect the Router v7 APIs we target.
- Cross-check nested routes, data routers, and RSC notes in the docs to avoid mixing deprecated patterns.

## State Stores

- When building or adjusting global stores, review the `.github/docs/zustand` references (guides, hooks, middlewares, integrations) to stay consistent with the recommended patterns (slices, persist middleware, immer usage, etc.).
- Reuse documented helpers/middleware configurations from these notes before writing new store boilerplate.

## Workflow Reminder

1. Identify the domain of the change (component, route, store).
2. Open the matching docs folder mentioned above and capture the relevant constraints/recipes.
3. Only start coding after confirming your plan aligns with those docs, and cite which document informed the implementation in your analysis if needed.

Following this flow keeps generated code cohesive with our existing systems and prevents redundant or conflicting implementations.
