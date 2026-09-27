import type { Route } from "./+types/root";
import "./app.css";

import { MainLinks } from "./links";
import { MainLayout } from "./layout";
import MainApp from "./app";
import { MainErrorBoundary } from "./error-boundary";

export const links: Route.LinksFunction = MainLinks;

export function Layout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  return <MainApp />;
}

export function ErrorBoundary({ ...props }: Route.ErrorBoundaryProps) {
  return <MainErrorBoundary {...props} />;
}
