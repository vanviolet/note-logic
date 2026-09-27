import { isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./templates/components/ui/empty";
import { LayoutDashboard, MoveLeft } from "lucide-react";
import { Button } from "./templates/components/ui/button";
import { Link } from "react-router";

export function MainErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <LayoutDashboard />
        </EmptyMedia>
        <EmptyTitle>{message}</EmptyTitle>
        <EmptyDescription>
          {import.meta.env.DEV && (
            <pre className="w-full p-4 overflow-x-auto bg-muted rounded-md">
              <code>{details}</code>
            </pre>
          )}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div>
          <Link to={"/"}>
            <Button>
              <MoveLeft />
              Go back to Home
            </Button>
          </Link>
        </div>
      </EmptyContent>
    </Empty>
  );
}
