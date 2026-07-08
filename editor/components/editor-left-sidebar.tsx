"use client";

import {
  History,
  Layers,
  LayoutGrid,
  ListTree,
  Settings,
} from "lucide-react";
import type { EditorPanel } from "@/editor/types";
import { HistoryPanel } from "@/editor/components/panels/history-panel";
import { NavigatorPanel } from "@/editor/components/panels/navigator-panel";
import { SettingsPanel } from "@/editor/components/panels/settings-panel";
import { StructurePanel } from "@/editor/components/panels/structure-panel";
import { WidgetsPanel } from "@/editor/components/panels/widgets-panel";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const panels: {
  id: EditorPanel;
  icon: typeof Layers;
  label: string;
}[] = [
  { id: "widgets", icon: Layers, label: "Widgets" },
  { id: "structure", icon: LayoutGrid, label: "Structure" },
  { id: "navigator", icon: ListTree, label: "Navigator" },
  { id: "history", icon: History, label: "History" },
  { id: "settings", icon: Settings, label: "Settings" },
];

function PanelContent({ panel }: { panel: EditorPanel }) {
  switch (panel) {
    case "widgets":
      return <WidgetsPanel />;
    case "structure":
      return <StructurePanel />;
    case "navigator":
      return <NavigatorPanel />;
    case "history":
      return <HistoryPanel />;
    case "settings":
      return <SettingsPanel />;
    default:
      return null;
  }
}

export function EditorLeftSidebar() {
  const { activePanel, setActivePanel } = useEditorStore();

  return (
    <aside className="flex h-full w-72 flex-col border-r bg-card">
      <div className="flex h-12 items-center border-b px-2">
        <div className="flex w-full items-center gap-0.5">
          {panels.map((panel) => {
            const Icon = panel.icon;
            const isActive = activePanel === panel.id;

            return (
              <Tooltip key={panel.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 shrink-0",
                      isActive && "bg-primary/10 text-primary",
                    )}
                    onClick={() => setActivePanel(panel.id)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{panel.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <PanelContent panel={activePanel} />
      </div>
    </aside>
  );
}
