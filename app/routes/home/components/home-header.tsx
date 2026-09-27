import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { NAV_DIRECT_LINKS, NAV_GROUPS } from "../home-data";
import { Button } from "~/templates/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/templates/components/ui/navigation-menu";
import { useBoolean } from "~/templates/hooks";
import { HomeThemeToggle } from "./home-theme-toggle";
import { Particles } from "~/templates/components/custom/particle";

/* ------------------------------------------------------------------ */
/*  Sub-component: single link inside NavigationMenuContent           */
/* ------------------------------------------------------------------ */

function NavGroupLink({
  title,
  href,
  description,
  icon: Icon,
}: {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            <Icon className="size-4 text-primary" />
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Header                                                       */
/* ------------------------------------------------------------------ */

export function HomeHeader() {
  const mobileMenu = useBoolean(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-8 lg:px-10">
        {/* ── Logo ── */}
        <Link to="/" className="inline-flex items-center gap-2 font-semibold">
          <span className="app-icon-aura relative">
            <Particles
              className="absolute inset-0 overflow-hidden rounded-full bg-transparent"
              quantity={18}
              staticity={20}
              ease={40}
              size={0.35}
              color="#fc2646"
              vx={0}
              vy={-0.15}
            />
            <img
              src="/note-logic-icon-colored.png"
              alt="NoteLogic"
              className="relative z-10 size-8 object-contain"
            />
          </span>
          <span>
            Note<span className="text-primary">Logic</span>
          </span>
        </Link>

        {/* ── Desktop Navigation ── */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {/* Beranda – direct link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/">Beranda</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Grouped menus */}
            {NAV_GROUPS.map((group) => (
              <NavigationMenuItem key={group.label}>
                <NavigationMenuTrigger className="bg-transparent">
                  {group.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={
                      group.items.length <= 2
                        ? "grid w-[320px] gap-1 p-2"
                        : "grid w-[420px] gap-1 p-2 md:grid-cols-2"
                    }
                  >
                    {group.items.map((item) => (
                      <NavGroupLink
                        key={item.href}
                        title={item.title}
                        href={item.href}
                        description={item.description}
                        icon={item.icon}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            {/* Direct anchor links */}
            {NAV_DIRECT_LINKS.map((link) => (
              <NavigationMenuItem key={link.label}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to={link.href}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* ── Desktop right controls ── */}
        <div className="hidden items-center gap-2 md:flex">
          <HomeThemeToggle />
          <Button asChild size="sm">
            <Link to="/chord">Mulai Explore</Link>
          </Button>
        </div>

        {/* ── Mobile controls ── */}
        <div className="flex items-center gap-2 md:hidden">
          <HomeThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={mobileMenu.value ? "Tutup menu" : "Buka menu"}
            onClick={mobileMenu.toggle}
          >
            {mobileMenu.value ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* ── Mobile Navigation Panel ── */}
      {mobileMenu.value && (
        <div className="border-t border-border/50 bg-background/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {/* Beranda */}
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={mobileMenu.setFalse}
            >
              Beranda
            </Link>

            {/* Grouped sections */}
            {NAV_GROUPS.map((group) => (
              <MobileNavGroup
                key={group.label}
                label={group.label}
                items={group.items}
                onNavigate={mobileMenu.setFalse}
              />
            ))}

            {/* Direct links */}
            {NAV_DIRECT_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={mobileMenu.setFalse}
              >
                {link.label}
              </Link>
            ))}

            {/* CTA */}
            <div className="mt-2 border-t border-border/50 pt-3">
              <Button asChild size="sm" className="w-full">
                <Link to="/chord" onClick={mobileMenu.setFalse}>
                  Mulai Explore
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Smoke gradient fade bleeding out below the header */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full z-50 h-12 bg-linear-to-b from-background/60 via-background/20 to-transparent"
      />
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile: collapsible group with details/summary                    */
/* ------------------------------------------------------------------ */

function MobileNavGroup({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: typeof NAV_GROUPS[number]["items"];
  onNavigate: () => void;
}) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        {label}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="ml-3 flex flex-col gap-0.5 border-l border-border/50 pl-3 pt-1">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={onNavigate}
          >
            <item.icon className="size-3.5 text-primary" />
            <div>
              <span className="font-medium">{item.title}</span>
              <p className="text-xs text-muted-foreground/70">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </details>
  );
}
