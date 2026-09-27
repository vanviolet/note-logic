import React from "react";
import { type Root } from "react-dom/client";

export type DataSnap = "right" | "left" | "top" | "bottom" | "fullscreen";
export type FwAttributeMetadata =
  /** Data X */
  | "dx"

  /** Data Y */
  | "dy"

  /** Data Width */
  | "dw"

  /** Data Height */
  | "dh"

  /** Data Previous Width */
  | "dpw"

  /** Data Previous Height */
  | "dph"

  /** Data Previous X */
  | "dpx"

  /** Data Previous Y */
  | "dpy"

  /** Data Snap */
  | "ds";

export type FwSnapProps = {
  right?: boolean;
  left?: boolean;
  top?: boolean;
  bottom?: boolean;
  offsetScreen?: number;

  /** Percent 50 = 50% */
  backgroundVanishOffset?: number;
};

export type FwProps = {
  id?: string;
  title?: string;
  description?: string;
  order?: number;
  initialWidth: number;
  initialHeight: number;
  minWidth: number;
  minHeight: number;
  onMinimized?: () => void;
  onMaximized?: () => void;
  onFullscreen?: () => void;
  onUnfullscreen?: () => void;
  onClosed?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ctx: FwCtxType,
  ) => void;
  onDialogMouseDown?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ctx: FwCtxType,
  ) => void;
  content?: React.ReactNode;
  root?: Root;
  snap?: FwSnapProps;
  disableSnap?: boolean;
  /** runtime flag mutated internally */
  isFullscreen?: boolean;
  /** runtime flag mutated internally (mobile detection) */
  isMobile?: boolean;
  /** limit windows (from config) */
  maxWindows?: number;
  setIsFullscreen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobile?: React.Dispatch<React.SetStateAction<boolean>>;
  /** Custom icon (header + minimized). Defaults to Package icon */
  icon?: React.ReactNode;
  /** Variant background for minimized icon box */
  minimizedVariant?:
    | "primary"
    | "success"
    | "destructive"
    | "warning"
    | "secondary";

  // draggable?: {
  //   allowFrom?: string;
  //   ignoreFrom?: string;
  // };
  // resizable?: {
  //   min?: { width: number; height: number };
  //   max?: { width: number; height: number };
  //   allowFrom?: string;
  //   ignoreFrom?: string;
  // };
};

export type RefDiv = React.MutableRefObject<HTMLDivElement | null>;

export type FwCtxType = {
  refSnap?: RefDiv;
  refFw?: RefDiv;
  refContent?: RefDiv;
  refMinimizedContent?: RefDiv;
} & FwProps;

export type SpecificSetAttribute = (
  qualifiedName: FwAttributeMetadata,
  value: string,
) => void;

export type SpecificGetAttribute = (
  qualifiedName: FwAttributeMetadata,
) => string;

export type SpecificRemoveAttribute = (
  qualifiedName: FwAttributeMetadata,
) => void;

export type SpecificSetStyle = (
  property: keyof React.CSSProperties,
  value: string | null,
  priority?: string,
) => void;

export type EmbedMetadata = (qualifiedName: {
  [key in FwAttributeMetadata]?: key extends "ds" ? DataSnap : string;
}) => void;

export type EmbedStyles = (styles: React.CSSProperties) => void;

export type DetachMetadata = (qualifiedName: FwAttributeMetadata[]) => void;

export type DetachStyles = (styles: (keyof React.CSSProperties)[]) => void;
