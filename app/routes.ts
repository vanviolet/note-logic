import {
  index,
  layout,
  type RouteConfig,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("routes/site-layout.tsx", [
    index("routes/home/index.tsx"),
    layout("routes/learn-layout.tsx", [
      route("family", "routes/family/index.tsx"),
      route("interval", "routes/interval/index.tsx"),
    ]),
    route("circle-of-fifths", "routes/circle-of-fifths/index.tsx"),
    ...prefix("scale", [
      index("routes/scale/index.tsx"),
      route(":scaleType", "routes/scale/$scaleType.tsx"),
    ]),
    ...prefix("chord", [
      index("routes/chord/index.tsx"),
      route(":chordId", "routes/chord/$chordId.tsx"),
    ]),
    route("tuner", "routes/tuner/index.tsx"),
    ...prefix("nolopedia", [
      index("routes/nolopedia/index.tsx"),
      route(":termId", "routes/nolopedia/$termId.tsx"),
    ]),
    ...prefix("songbook", [
      index("routes/songbook/index.tsx"),
      route(":songId", "routes/songbook/$songId.tsx"),
    ]),
    route("fingering-routine", "routes/fingering-routine/index.tsx"),
    ...prefix("knowledge", [
      index("routes/knowledge/index.tsx"),
      route(":articleId", "routes/knowledge/$articleId.tsx"),
    ]),
    ...prefix("sight-reading", [
      index("routes/sight-reading/index.tsx"),
      route("materi", "routes/sight-reading/materi.tsx"),
      route("explorer", "routes/sight-reading/explorer.tsx"),
      route("quiz/:topicId", "routes/sight-reading/quiz.tsx"),
    ]),
  ]),
  route("studio", "routes/studio/index.tsx"),
  route("*", "./catchall.tsx"),
] satisfies RouteConfig;
