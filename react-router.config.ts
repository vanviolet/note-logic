import type { Config } from "@react-router/dev/config";

export default {
  // SSR enabled — every route is server-rendered on each request for
  // full SEO (dynamic meta, JSON-LD, proper HTTP status codes).
  ssr: true,
  routeDiscovery: {
    mode: "lazy",
  },
} satisfies Config;
