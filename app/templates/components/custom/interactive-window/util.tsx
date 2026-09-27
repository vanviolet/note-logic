import React from "react";
import type {
  FwAttributeMetadata,
  DataSnap,
  SpecificRemoveAttribute,
  SpecificSetAttribute,
  SpecificSetStyle,
  EmbedMetadata,
  RefDiv,
  EmbedStyles,
  DetachMetadata,
  DetachStyles,
} from "./type";

export function extractMetadata(
  _element: HTMLDivElement | RefDiv | null | undefined,
) {
  let element = _element;

  if (element && "current" in element) {
    element = element.current;
  }
  return {
    /** Data Height */
    dh: element?.getAttribute("dh") || "",

    /** Data Width */
    dw: element?.getAttribute("dw") || "",

    /** Data X */
    dx: element?.getAttribute("dx") || "",

    /** Data Y */
    dy: element?.getAttribute("dy") || "",

    /** Data Previous Height */
    dph: element?.getAttribute("dph") || "",

    /** Data Previous Width */
    dpw: element?.getAttribute("dpw") || "",

    /** Data Previous X */
    dpx: element?.getAttribute("dpx") || "",

    /** Data Previous Y */
    dpy: element?.getAttribute("dpy") || "",

    /** Data Snap */
    ds: (element?.getAttribute("ds") as DataSnap | null) || "",
  };
}

type AddClass = (...tokens: string[]) => void;
type RemoveClass = (...tokens: string[]) => void;

export type UtilityKeys<Name extends string> =
  | `setAttribute${Name}`
  | `removeAttribute${Name}`
  | `setStyle${Name}`
  | `addClass${Name}`
  | `removeClass${Name}`
  | `setAtt$${Name}`;

export type UtilityObject<Name extends string> = {
  [K in UtilityKeys<Name>]: K extends `setAttribute${Name}`
    ? SpecificSetAttribute
    : K extends `removeAttribute${Name}`
      ? SpecificRemoveAttribute
      : K extends `setStyle${Name}`
        ? SpecificSetStyle
        : K extends `addClass${Name}`
          ? AddClass
          : K extends `removeClass${Name}`
            ? RemoveClass
            : EmbedMetadata;
};

export type UtilityMethods = "embed" | "detach";
export type UtilityTags = "Metadata$" | "Style$" | "Class$";
export type UtilityType<Name extends string> =
  `${UtilityMethods}${UtilityTags}${Name}`;

export type ComposeUtil$<Name extends string> = {
  [K in UtilityType<Name>]: <Type extends () => any>(
    ...args: Parameters<Type>
  ) => ReturnType<Type>;
};

export function embedMetadata$(
  _ref?: RefDiv | HTMLDivElement | null,
  qualifiedName?: {
    [key in FwAttributeMetadata]?: key extends "ds" ? DataSnap : string;
  },
) {
  let ref = _ref;
  if (ref && "current" in ref) {
    ref = ref.current;
  }
  if (!ref) return;
  for (const [key, value] of Object.entries(qualifiedName || {})) {
    ref.setAttribute(key, value);
  }
}

export function detachMetadata$(
  _ref?: RefDiv | HTMLDivElement | null,
  keys?: FwAttributeMetadata[],
) {
  let ref = _ref;
  if (ref && "current" in ref) {
    ref = ref.current;
  }
  if (!ref) return;
  for (const key of keys || []) {
    ref.removeAttribute(key);
  }
}

export function embedStyle$(
  _ref?: RefDiv | HTMLDivElement | null,
  styles?: React.CSSProperties,
) {
  let ref = _ref;
  if (ref && "current" in ref) {
    ref = ref.current;
  }
  if (!ref) return;
  for (const [key, value] of Object.entries(styles || {})) {
    ref.style.setProperty(key, value);
  }
}

export function detachStyle$(
  _ref?: RefDiv | HTMLDivElement | null,
  keys?: Array<keyof React.CSSProperties>,
) {
  let ref = _ref;
  if (ref && "current" in ref) {
    ref = ref.current;
  }
  if (!ref) return;
  for (const key of keys || []) {
    ref.style.removeProperty(key);
  }
}

export function embedClass$(
  _ref?: RefDiv | HTMLDivElement | null,
  tokens?: string[],
) {
  let ref = _ref;
  if (ref && "current" in ref) {
    ref = ref.current;
  }
  if (!ref) return;
  if (!tokens) return;
  ref.classList.add(...tokens);
}

export type BatchEmbed$ = {
  ref?: RefDiv | HTMLDivElement | null;
  metadata?: {
    [key in FwAttributeMetadata]?: key extends "ds" ? DataSnap : string;
  };
  style?: React.CSSProperties;
  class?: string[];
};

export type BatchDetach$ = {
  ref?: RefDiv | HTMLDivElement | null;
  metadata?: FwAttributeMetadata[];
  style?: Array<keyof React.CSSProperties>;
  class?: string[];
};
export function batchEmbed$(batch: BatchEmbed$[]) {
  for (const { ref, metadata, style: styles, class: tokens } of batch) {
    if (metadata) embedMetadata$(ref, metadata);
    if (styles) embedStyle$(ref, styles);
    if (tokens) embedClass$(ref, tokens);
  }
}

export function batchDetach$(batch: BatchDetach$[]) {
  for (const { ref, metadata, style: styles, class: tokens } of batch) {
    if (metadata) detachMetadata$(ref, metadata);
    if (styles) detachStyle$(ref, styles);
    if (tokens) detachClass$(ref, tokens);
  }
}

export function detachClass$(
  _ref?: RefDiv | HTMLDivElement | null,
  tokens?: string[],
) {
  let ref = _ref;
  if (ref && "current" in ref) {
    ref = ref.current;
  }
  if (!ref) return;
  if (!tokens) return;
  ref.classList.remove(...tokens);
}

export function composeUtil$<Name extends string>(
  name: Name,
  _ref?: RefDiv | HTMLDivElement | null,
): ComposeUtil$<Name> {
  let ref = _ref;
  if (ref && "current" in ref) {
    ref = ref.current;
  }
  const embedMetadata: EmbedMetadata = (attributes) => {
    for (const [key, value] of Object.entries(attributes)) {
      ref?.setAttribute(key, value);
    }
  };

  const embedStyle: EmbedStyles = (styles) => {
    for (const [key, value] of Object.entries(styles)) {
      ref?.style.setProperty(key, value);
    }
  };

  const embedClass: AddClass = (...tokens) => {
    ref?.classList.add(...tokens);
  };

  const detachMetadata: DetachMetadata = (attributes) => {
    for (const key of attributes) {
      ref?.removeAttribute(key);
    }
  };

  const detachStyle: DetachStyles = (styles) => {
    for (const key of styles) {
      ref?.style.removeProperty(key);
    }
  };

  const detachClass: RemoveClass = (...tokens) => {
    ref?.classList.remove(...tokens);
  };

  return {
    [`embed$Metadata${name}`]: embedMetadata,
    [`embed$Style${name}`]: embedStyle,
    [`embed$Class${name}`]: embedClass,
    [`detach$Metadata${name}`]: detachMetadata,
    [`detach$Style${name}`]: detachStyle,
    [`detach$Class${name}`]: detachClass,
  } as ComposeUtil$<Name>;
}

type Greeting = `Hello, ${UtilityMethods}!`;

export function getUtilities<Name extends string>(
  _element: HTMLDivElement | null | undefined | RefDiv,
  name: Name,
): UtilityObject<Name> {
  let element = _element;
  if (element && "current" in element) {
    element = element.current;
  }
  const voidFn = () => {};
  const setAttribute = element?.setAttribute.bind(element) || voidFn;
  const removeAttribute = element?.removeAttribute.bind(element) || voidFn;
  const setStyle = element?.style.setProperty.bind(element.style) || voidFn;
  const addClass = element?.classList.add.bind(element.classList) || voidFn;
  const removeClass =
    element?.classList.remove.bind(element.classList) || voidFn;
  const setAttribute$: EmbedMetadata = (attributes) => {
    for (const [key, value] of Object.entries(attributes)) {
      element?.setAttribute(key, value);
    }
  };
  return {
    [`setAttribute${name}`]: setAttribute,
    [`removeAttribute${name}`]: removeAttribute,
    [`setStyle${name}`]: setStyle,
    [`addClass${name}`]: addClass,
    [`removeClass${name}`]: removeClass,
    [`setAtt$${name}`]: setAttribute$,
  } as UtilityObject<Name>;
}

export function translate(x: number, y: number) {
  return `translate(${x}px, ${y}px)`;
}

export function calcPosCenterScreen({
  height,
  width,
}: {
  height: number;
  width: number;
}) {
  return {
    x: window.innerWidth / 2 - width / 2,
    y: window.innerHeight / 2 - height / 2,
  };
}

export const px = (arg: string | number) => {
  if (typeof arg === "number") return `${arg}px`;
  return arg.includes("px") ? arg : `${arg}px`;
};

export const percent = (arg: string | number) => {
  if (typeof arg === "number") return `${arg}%`;
  return arg.includes("%") ? arg : `${arg}%`;
};

export const dotPrefix = (arg: string) => {
  return arg.startsWith(".") ? arg : `.${arg}`;
};

export function elementManipulation() {}
