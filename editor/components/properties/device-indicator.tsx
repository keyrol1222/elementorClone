"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import type { EditorDevice } from "@/editor/types";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const devices: { id: EditorDevice; icon: typeof Monitor; label: string }[] = [
  { id: "desktop", icon: Monitor, label: "Desktop" },
  { id: "tablet", icon: Tablet, label: "Tablet" },
  { id: "mobile", icon: Smartphone, label: "Mobile" },
];

export function DeviceIndicator() {
  const device = useEditorStore((state) => state.device);
  const setDevice = useEditorStore((state) => state.setDevice);

  return (
    <div className="rounded-lg border bg-muted/40 p-2">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Editing for
      </p>
      <div className="grid grid-cols-3 gap-1">
        {devices.map((item) => {
          const Icon = item.icon;
          const isActive = device === item.id;

          return (
            <Button
              key={item.id}
              type="button"
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn("h-8 px-2 text-[10px]", isActive && "shadow-sm")}
              onClick={() => setDevice(item.id)}
            >
              <Icon className="mr-1 h-3 w-3" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
