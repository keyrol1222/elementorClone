"use client";

import { History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HistoryPanel() {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <History className="mb-4 h-10 w-10 text-muted-foreground/40" />
        <h3 className="mb-1 text-sm font-medium">History</h3>
        <p className="text-xs text-muted-foreground">
          Undo, redo, and action history will be available in Phase 8.
        </p>
      </div>
    </ScrollArea>
  );
}
