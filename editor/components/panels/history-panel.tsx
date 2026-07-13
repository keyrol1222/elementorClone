"use client";

import {
  ClipboardPaste,
  Copy,
  History,
  Redo2,
  Trash2,
  Undo2,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function HistoryPanel() {
  const past = useEditorStore((state) => state.past);
  const future = useEditorStore((state) => state.future);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const jumpToHistory = useEditorStore((state) => state.jumpToHistory);
  const clipboard = useEditorStore((state) => state.clipboard);
  const copySelected = useEditorStore((state) => state.copySelected);
  const pasteClipboard = useEditorStore((state) => state.pasteClipboard);
  const duplicateSelected = useEditorStore((state) => state.duplicateSelected);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);

  const historyNewestFirst = [...past].reverse();

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b p-3">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 flex-1 text-xs"
            disabled={past.length === 0}
            onClick={() => undo()}
          >
            <Undo2 className="mr-1.5 h-3.5 w-3.5" />
            Undo
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 flex-1 text-xs"
            disabled={future.length === 0}
            onClick={() => redo()}
          >
            <Redo2 className="mr-1.5 h-3.5 w-3.5" />
            Redo
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 justify-start text-xs"
            disabled={!selectedNodeId}
            onClick={() => copySelected()}
          >
            <Copy className="mr-1.5 h-3 w-3" />
            Copy
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 justify-start text-xs"
            disabled={!clipboard}
            onClick={() => pasteClipboard()}
          >
            <ClipboardPaste className="mr-1.5 h-3 w-3" />
            Paste
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 justify-start text-xs"
            disabled={!selectedNodeId}
            onClick={() => duplicateSelected()}
          >
            <Copy className="mr-1.5 h-3 w-3" />
            Duplicate
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 justify-start text-xs text-destructive"
            disabled={!selectedNodeId}
            onClick={() => deleteSelected()}
          >
            <Trash2 className="mr-1.5 h-3 w-3" />
            Delete
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground">
          ⌘Z undo · ⌘⇧Z redo · ⌘C/V/D · Del
        </p>
      </div>

      <ScrollArea className="flex-1">
        {past.length === 0 && future.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <History className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <h3 className="mb-1 text-sm font-medium">No history yet</h3>
            <p className="text-xs text-muted-foreground">
              Edits, moves, and deletes will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-3">
            <div className="rounded-md border border-primary/40 bg-primary/5 px-3 py-2">
              <p className="text-xs font-medium">Current</p>
              <p className="text-[10px] text-muted-foreground">
                Live canvas state
              </p>
            </div>

            {future.length > 0 && (
              <>
                <Separator className="my-2" />
                <p className="px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Redo stack
                </p>
                {future.map((entry, index) => (
                  <button
                    key={`future-${entry.id}`}
                    type="button"
                    onClick={() => {
                      for (let step = 0; step <= index; step += 1) {
                        redo();
                      }
                    }}
                    className="flex w-full flex-col rounded-md border border-dashed px-3 py-2 text-left opacity-70 transition hover:opacity-100"
                  >
                    <span className="text-xs font-medium">{entry.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(entry.timestamp)} · redo to here
                    </span>
                  </button>
                ))}
              </>
            )}

            {historyNewestFirst.length > 0 && (
              <>
                <Separator className="my-2" />
                <p className="px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Past
                </p>
                {historyNewestFirst.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => jumpToHistory(entry.id)}
                    className={cn(
                      "flex w-full flex-col rounded-md border px-3 py-2 text-left transition hover:bg-muted/60",
                    )}
                  >
                    <span className="text-xs font-medium">{entry.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(entry.timestamp)}
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
