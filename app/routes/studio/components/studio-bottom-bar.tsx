import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "~/templates/components/ui/button";
import { Input } from "~/templates/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import { Slider } from "~/templates/components/ui/slider";

type StudioBottomBarProps = {
  left: number;
  width: number;
  measureCount: number;
  timeSignatureNumerator: number;
  tempo: number;
  cellWidth: number;
  onChangeMeasureCount: (next: number) => void;
  onChangeBeatsPerMeasure: (next: number) => void;
  onChangeTempo: (next: number) => void;
  onChangeCellWidth: (next: number) => void;
};

export function StudioBottomBar({
  left,
  width,
  measureCount,
  timeSignatureNumerator,
  tempo,
  cellWidth,
  onChangeMeasureCount,
  onChangeBeatsPerMeasure,
  onChangeTempo,
  onChangeCellWidth,
}: StudioBottomBarProps) {
  const zoomPercent = Math.round(((cellWidth - 44) / (88 - 44)) * 100);

  return (
    <div
      className="fixed bottom-0 z-40 border-t border-border/70 bg-card/95 px-3 backdrop-blur shadow-lg"
      style={{
        left: `${left}px`,
        width: `${width}px`,
      }}
    >
      <div className="flex h-10 flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Bars</span>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-6 w-6"
            onClick={() => onChangeMeasureCount(Math.max(1, measureCount - 1))}
          >
            -
          </Button>
          <span className="min-w-5 text-center text-xs font-medium">
            {measureCount}
          </span>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-6 w-6"
            onClick={() => onChangeMeasureCount(Math.min(64, measureCount + 1))}
          >
            +
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">TS</span>
          <Select
            value={String(timeSignatureNumerator)}
            onValueChange={(v) => onChangeBeatsPerMeasure(Number(v))}
          >
            <SelectTrigger className="h-7 w-[76px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((b) => (
                <SelectItem key={b} value={String(b)}>
                  {b}/4
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Tempo</span>
          <Input
            className="h-7 w-[72px] text-xs"
            type="number"
            min={30}
            max={260}
            value={tempo}
            onChange={(e) =>
              onChangeTempo(
                Math.max(30, Math.min(260, Number(e.target.value) || 96)),
              )
            }
          />
        </div>

        <div className="ml-auto flex min-w-52 items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Zoom</span>
          <ZoomOut className="size-3.5 text-muted-foreground" />
          <Slider
            className="w-28"
            min={44}
            max={88}
            step={1}
            value={[cellWidth]}
            onValueChange={([value]) => {
              if (typeof value === "number") onChangeCellWidth(value);
            }}
            aria-label="Zoom"
          />
          <ZoomIn className="size-3.5 text-muted-foreground" />
          <span className="min-w-9 text-right text-[10px] font-medium text-muted-foreground">
            {zoomPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
