import * as React from "react";
import { Badge } from "~/templates/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/templates/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/templates/components/ui/tabs";
import type {
  BeatEffect,
  DynamicMark,
  NoteDuration,
  NoteEffect,
  StudioNote,
} from "../types";

type StudioPropertyInspectorProps = {
  selectedNote: StudioNote | null;
  defaultDuration: NoteDuration;
  onChangeDuration: (duration: NoteDuration) => void;
  onChangeDynamic: (dynamic: DynamicMark) => void;
  onChangeBeatEffect: (effect: BeatEffect) => void;
  onChangeNoteEffect: (effect: NoteEffect) => void;
};

const DYNAMICS: DynamicMark[] = ["pp", "p", "mp", "mf", "f", "ff"];
const BEAT_EFFECTS: BeatEffect[] = [
  "none",
  "v",
  "vw",
  "f",
  "fo",
  "vs",
  "d",
  "dd",
  "su",
  "sd",
];
const NOTE_EFFECTS: NoteEffect[] = ["none", "h", "tr"];

export function StudioPropertyInspector({
  selectedNote,
  defaultDuration,
  onChangeDuration,
  onChangeDynamic,
  onChangeBeatEffect,
  onChangeNoteEffect,
}: StudioPropertyInspectorProps) {
  const currentDuration = selectedNote?.duration ?? defaultDuration;
  const currentDynamic = selectedNote?.dynamic ?? "mf";
  const currentBeatEffect = selectedNote?.beatEffect ?? "none";
  const currentNoteEffect = selectedNote?.noteEffect ?? "none";

  return (
    <Card className="min-w-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Inspector</span>
          <Badge variant="outline">Duration / Dynamic / Effects</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="duration" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="duration">Duration</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic</TabsTrigger>
            <TabsTrigger value="beat">Beat FX</TabsTrigger>
            <TabsTrigger value="note">Note FX</TabsTrigger>
          </TabsList>

          <TabsContent value="duration" className="mt-3 space-y-1.5">
            <p className="text-xs text-muted-foreground">
              Durasi note terpilih (atau default untuk note baru).
            </p>
            <Select
              value={String(currentDuration)}
              onValueChange={(value) =>
                onChangeDuration(Number(value) as NoteDuration)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Whole (1)</SelectItem>
                <SelectItem value="2">Half (2)</SelectItem>
                <SelectItem value="4">Quarter (4)</SelectItem>
                <SelectItem value="8">Eighth (8)</SelectItem>
                <SelectItem value="16">Sixteenth (16)</SelectItem>
              </SelectContent>
            </Select>
          </TabsContent>

          <TabsContent value="dynamic" className="mt-3 space-y-1.5">
            <p className="text-xs text-muted-foreground">
              Dynamic mempengaruhi gain playback editor.
            </p>
            <Select
              value={currentDynamic}
              onValueChange={(value) => onChangeDynamic(value as DynamicMark)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dynamic" />
              </SelectTrigger>
              <SelectContent>
                {DYNAMICS.map((dynamic) => (
                  <SelectItem key={dynamic} value={dynamic}>
                    {dynamic.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>

          <TabsContent value="beat" className="mt-3 space-y-1.5">
            <p className="text-xs text-muted-foreground">
              Beat property alphaTex (contoh: vibrato, fade, stroke).
            </p>
            <Select
              value={currentBeatEffect}
              onValueChange={(value) => onChangeBeatEffect(value as BeatEffect)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Beat effect" />
              </SelectTrigger>
              <SelectContent>
                {BEAT_EFFECTS.map((effect) => (
                  <SelectItem key={effect} value={effect}>
                    {effect === "none" ? "None" : effect}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>

          <TabsContent value="note" className="mt-3 space-y-1.5">
            <p className="text-xs text-muted-foreground">
              Note property alphaTex (contoh: hammer-on / harmonic).
            </p>
            <Select
              value={currentNoteEffect}
              onValueChange={(value) => onChangeNoteEffect(value as NoteEffect)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Note effect" />
              </SelectTrigger>
              <SelectContent>
                {NOTE_EFFECTS.map((effect) => (
                  <SelectItem key={effect} value={effect}>
                    {effect === "none" ? "None" : effect}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
