import * as React from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Download,
  FolderOpen,
  Pause,
  Play,
  Sparkles,
  Square,
} from "lucide-react";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/templates/components/ui/dialog";
import { Input } from "~/templates/components/ui/input";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/templates/components/ui/menubar";

type StudioHeaderProps = {
  title: string;
  onChangeTitle: (next: string) => void;
  notesCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onNewProject: () => void;
  showSidebar: boolean;
  showBottomBar: boolean;
  showPreview: boolean;
  onToggleSidebar: (next: boolean) => void;
  onToggleBottomBar: (next: boolean) => void;
  onTogglePreview: (next: boolean) => void;
  showBarPanel: boolean;
  showScorePanel: boolean;
  onToggleBarPanel: (next: boolean) => void;
  onToggleScorePanel: (next: boolean) => void;
  alphaReady: boolean;
  isPlaybackRunning: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onExportAlphaTex: () => void;
  onImportFile: (file: File) => void;
  savedProjects: Array<{ id: string; name: string; updatedAt: number }>;
  onOpenProject: (projectId: string) => void;
  onOpenEffectPalette: () => void;
};

export const StudioHeader = React.memo(function StudioHeader({
  title,
  onChangeTitle,
  notesCount,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onNewProject,
  showSidebar,
  showBottomBar,
  showPreview,
  onToggleSidebar,
  onToggleBottomBar,
  onTogglePreview,
  showBarPanel,
  showScorePanel,
  onToggleBarPanel,
  onToggleScorePanel,
  alphaReady,
  isPlaybackRunning,
  onPlayPause,
  onStop,
  onExportAlphaTex,
  onImportFile,
  savedProjects,
  onOpenProject,
  onOpenEffectPalette,
}: StudioHeaderProps) {
  const [savedOpen, setSavedOpen] = React.useState(false);

  return (
    <header className="border-b bg-card/70 px-3 py-1.5 backdrop-blur supports-backdrop-filter:bg-card/50">
      <Dialog open={savedOpen} onOpenChange={setSavedOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Saved Projects</DialogTitle>
          </DialogHeader>

          <div className="max-h-80 space-y-2 overflow-auto pr-1">
            {savedProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No saved project available.
              </p>
            ) : (
              savedProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    onOpenProject(project.id);
                    setSavedOpen(false);
                  }}
                  className="w-full rounded-md border border-border/70 bg-card px-3 py-2 text-left transition hover:border-primary/50"
                >
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(project.updatedAt).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background/80 px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="size-3.5 text-muted-foreground" />
            <span className="font-medium">Beranda</span>
          </Link>

          <Menubar className="h-7 py-0">
            <MenubarMenu>
              <MenubarTrigger className="text-xs">File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={onNewProject}>
                  New Project
                  <MenubarShortcut>Ctrl+N</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => setSavedOpen(true)}>
                  Saved Projects
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-xs">Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={onUndo} disabled={!canUndo}>
                  Undo
                  <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={onRedo} disabled={!canRedo}>
                  Redo
                  <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={onNewProject}>New Project</MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-xs">View</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem
                  checked={showSidebar}
                  onCheckedChange={(checked) =>
                    onToggleSidebar(Boolean(checked))
                  }
                >
                  Sidebar
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={showBottomBar}
                  onCheckedChange={(checked) =>
                    onToggleBottomBar(Boolean(checked))
                  }
                >
                  Bottom Bar
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={showPreview}
                  onCheckedChange={(checked) =>
                    onTogglePreview(Boolean(checked))
                  }
                >
                  Preview Panel
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarCheckboxItem
                  checked={showBarPanel}
                  onCheckedChange={(checked) =>
                    onToggleBarPanel(Boolean(checked))
                  }
                >
                  Bar Panel
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={showScorePanel}
                  onCheckedChange={(checked) =>
                    onToggleScorePanel(Boolean(checked))
                  }
                >
                  Score &amp; Track Panel
                </MenubarCheckboxItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-xs">Effect</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={onOpenEffectPalette}>
                  <Sparkles className="mr-2 size-4" />
                  Effect Palette
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <Input
            className="h-7 w-56 text-xs"
            value={title}
            onChange={(event) => onChangeTitle(event.target.value)}
            aria-label="Project title"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={onPlayPause}
            disabled={!alphaReady}
            title={isPlaybackRunning ? "Pause" : "Play"}
            aria-label={isPlaybackRunning ? "Pause" : "Play"}
          >
            {isPlaybackRunning ? (
              <Pause className="size-3.5" />
            ) : (
              <Play className="size-3.5" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={onStop}
            disabled={!alphaReady}
            title="Stop"
            aria-label="Stop"
          >
            <Square className="size-3.5" />
          </Button>
          <label className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-primary/60 hover:text-primary">
            <FolderOpen className="size-3.5" />
            <input
              type="file"
              accept=".gp,.gp3,.gp4,.gp5,.gpx"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onImportFile(file);
                }
              }}
            />
          </label>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={onExportAlphaTex}
            title="Export AlphaTex"
            aria-label="Export AlphaTex"
          >
            <Download className="size-3.5" />
          </Button>

          <Badge variant="secondary" className="h-6 text-[11px]">
            {notesCount} notes
          </Badge>
        </div>
      </div>
    </header>
  );
});
