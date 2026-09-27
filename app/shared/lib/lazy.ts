import { lazy, type ComponentType } from "react";

/**
 * Helper to lazily import a named export from a dynamic module.
 * Wraps the named export as the `default` export expected by React.lazy.
 *
 * @example
 * const ChordItemCard = lazyNamed(
 *   () => import("./chord-item-card"),
 *   "ChordItemCard"
 * );
 */
export function lazyNamed<
  TComponent extends ComponentType<any>,
  TModule extends Record<string, unknown>,
  TKey extends keyof TModule,
>(
  importer: () => Promise<TModule & Record<TKey, TComponent>>,
  exportName: TKey,
) {
  return lazy(async () => {
    const module = await importer();
    return {
      default: module[exportName],
    };
  });
}
