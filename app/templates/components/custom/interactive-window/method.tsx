import { createRoot } from "react-dom/client";
import FwRoot from "./root";
import type { FwCtxType } from "./type";
import { FW_CONF } from "./config";
import { dotPrefix, px, translate } from "./util";

/** Query all minimized dialogs (elements with class is-minimized) */
export function getAllMinimized(): HTMLDivElement[] {
  return Array.from(
    document.querySelectorAll<HTMLDivElement>(
      `.${FW_CONF.containerClass}.is-minimized`,
    ),
  );
}

/** Recalculate positions of minimized windows.
 * Stacks from bottom-right upward, then creates a new column to the left when reaching top.
 */
export function recalcMinimizedPositions() {
  const minimized = getAllMinimized();
  const size = 50;
  const gap = 10;
  const verticalGap = 5;
  const availableHeight = window.innerHeight - gap * 2;
  const perColumn = Math.max(
    1,
    Math.floor(availableHeight / (size + verticalGap)),
  );
  minimized.forEach((el, idx) => {
    const col = Math.floor(idx / perColumn);
    const row = idx % perColumn;
    const x = window.innerWidth - (col + 1) * (size + gap) - gap;
    const y = window.innerHeight - gap - size - row * (size + verticalGap);
    el.style.transition = "all 0.3s ease";
    el.style.width = px(size);
    el.style.height = px(size);
    el.style.transform = translate(x, y);
    el.style.zIndex = (FW_CONF.zIndexMinimized + idx).toString();
  });
}

// Listen to resize to keep minimized windows fixed to viewport.
if (typeof window !== "undefined") {
  window.addEventListener("resize", () => {
    recalcMinimizedPositions();
  });
}

export function newWindow({ id, ...ctx }: Partial<FwCtxType>) {
  const _id = id || "__anonym-dialog__";
  const existing = document.querySelectorAll(
    `.${FW_CONF.containerClass}`,
  ).length;
  if (FW_CONF.maxWindows && existing >= FW_CONF.maxWindows) {
    return; // exceed max windows
  }
  let container = document.getElementById(_id);

  if (!container) {
    container = document.createElement("div");
    container.id = _id;
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(<FwRoot {...{ id: container.id, root, ...ctx }} />);
    recalcMinimizedPositions();
  } else {
    container = document.createElement("div");
    container.id = `${_id}-${Date.now().toString()}`;
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(<FwRoot {...{ id: container.id, root, ...ctx }} />);
    recalcMinimizedPositions();
  }
}

export function closeWindowById(id?: string, ctx?: FwCtxType) {
  const container = document.getElementById(id || "");
  if (container) document.body.removeChild(container);
  ctx?.root?.unmount();
  // After removal reflow minimized positions
  recalcMinimizedPositions();
}

export function getMajorWindow(): HTMLDivElement | null {
  return document.querySelector(dotPrefix(FW_CONF.windowMajorClass));
}

/** Elevate a dialog to front by assigning next highest z-index */
export function bringToFront(el?: HTMLDivElement | null) {
  if (!el) return;
  const dialogs = Array.from(
    document.querySelectorAll<HTMLDivElement>(`.${FW_CONF.containerClass}`),
  );
  const maxZ = dialogs.reduce((m, d) => {
    const z = parseInt(d.style.zIndex || "0", 10);
    return z > m ? z : m;
  }, FW_CONF.zIndex);
  el.style.zIndex = (maxZ + 1).toString();
}
