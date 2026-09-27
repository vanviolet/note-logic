import { ThemeProvider } from "./templates/components/theme-provider";
import { Toaster } from "./templates/components/ui/sonner";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";

function AppContent() {
  return (
    <Fragment>
      <Toaster />
      <Outlet />
    </Fragment>
  );
}

export default function MainApp() {
  return (
    <ThemeProvider defaultTheme="light">
      <AppContent />
    </ThemeProvider>
  );
}
