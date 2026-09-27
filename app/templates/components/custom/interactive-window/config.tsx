export const FW_CONF = {
  defaultId: "default",
  defaultTitle: "Unamed Dialog",
  defaultDescription: "Description",
  defaultHeight: 360,
  defaultWidth: 360,
  defaultMinHeight: 300,
  defaultMinWidth: 300,
  /** Maximum number of windows allowed concurrently (undefined = unlimited) */
  maxWindows: undefined as number | undefined,
  /** Mobile breakpoint (px) where dialog becomes forced fullscreen & controls hidden */
  mobileBreakpoint: 768,
  defaultSnap: {
    top: true,
    right: true,
    bottom: true,
    left: true,
    offsetScreen: 4,
    backgroundVanishOffset: 30,
  },

  resize: {
    left: true,
    right: true,
    bottom: true,
    top: true,
  },

  windowMajorClass: "awkd-dialog-active",
  containerClass: "awkd-dialog",
  snapBackgroundClass: "awkd-snap-bg",

  draggableAllowFromClass: "drag-handle",

  zIndex: 10000,
  /** z-index for snap background overlay */
  zIndexSnap: 10000 + 90,
  /** base z-index for minimized windows (stack will increment from here) */
  zIndexMinimized: 10000 + 10,
};
