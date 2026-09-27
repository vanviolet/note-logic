import { Badge } from "~/templates/components/ui/badge";

interface SectionTitleProps {
  badge: string;
  title: string;
  description: string;
  centered?: boolean;
}

export function SectionTitle({
  badge,
  title,
  description,
  centered = false,
}: SectionTitleProps) {
  return (
    <div className={centered ? "text-center" : "text-left"}>
      <Badge variant="secondary" className="mb-3">
        {badge}
      </Badge>
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <p className="mt-3 text-sm text-muted-foreground md:text-base">
        {description}
      </p>
    </div>
  );
}
