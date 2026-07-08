"use client";

import { useEditorStore } from "@/store/editor-store";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function SettingsPanel() {
  const { pageTitle, pageSlug, pageStatus, device } = useEditorStore();

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        <div>
          <h3 className="mb-3 text-sm font-semibold">Page Settings</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Title</Label>
              <p className="text-sm font-medium">{pageTitle}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Slug</Label>
              <p className="text-sm font-medium">/{pageSlug}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Badge variant="secondary">{pageStatus}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 text-sm font-semibold">Editor</h3>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Active device
            </Label>
            <p className="text-sm font-medium capitalize">{device}</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
