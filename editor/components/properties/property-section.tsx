"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type PropertySectionProps = {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function PropertySection({
  title,
  icon,
  defaultOpen = true,
  children,
}: PropertySectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium"
      >
        {icon}
        <span className="flex-1">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="space-y-3 border-t px-3 py-3">{children}</div>}
    </div>
  );
}
