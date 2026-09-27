// ════════════════════════════════════════════════════════
// Sight Reading – Quiz Route
// ════════════════════════════════════════════════════════
//
// /sight-reading/quiz/:topicId — Quiz page for specifc topic.
// Reads topicId from URL params, finds the matching topic,
// and renders the quiz component. Back button navigates
// to /sight-reading via browser history.
// ════════════════════════════════════════════════════════

import { lazy, Suspense, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router";
import type { Route } from "./+types";
import { HelpCircle } from "lucide-react";
import { Button } from "~/templates/components/ui/button";
import { LESSON_TOPICS } from "./lib/note-data";

const NoteQuiz = lazy(() =>
  import("./components/note-quiz").then((m) => ({ default: m.NoteQuiz })),
);

export function meta({ params }: Route.MetaArgs) {
  const topicId = (params as Record<string, string | undefined>)?.topicId;
  const topic = LESSON_TOPICS.find((t) => t.id === topicId);
  const title = topic ? topic.title : "Quiz";
  return [
    { title: `NoteLogic | Quiz – ${title}` },
    {
      name: "description",
      content: `Quiz identifikasi not balok: ${title}. Uji kemampuan membaca not pada paranada.`,
    },
  ];
}

export default function QuizPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const topic = useMemo(
    () => LESSON_TOPICS.find((t) => t.id === topicId),
    [topicId],
  );

  if (!topic) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
        <HelpCircle className="mx-auto size-8 text-muted-foreground" />
        <h1 className="text-xl font-bold">Topik Tidak Ditemukan</h1>
        <p className="text-sm text-muted-foreground">
          Topik quiz "{topicId}" tidak tersedia.
        </p>
        <Button asChild>
          <Link to="/sight-reading">← Kembali ke Sight Reading</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="h-48 w-full rounded-xl bg-muted" />
          </div>
        }
      >
        <NoteQuiz
          topic={topic}
          questionCount={10}
          onBack={() => navigate("/sight-reading")}
        />
      </Suspense>
    </div>
  );
}
