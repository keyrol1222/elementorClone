"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PropertyFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "color" | "url";
  inherited?: boolean;
  className?: string;
};

export function PropertyField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inherited = false,
  className,
}: PropertyFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        {inherited && (
          <span className="text-[10px] text-muted-foreground">Inherited</span>
        )}
      </div>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 text-xs"
      />
    </div>
  );
}

type PropertySelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};

export function PropertySelect({
  label,
  value,
  onChange,
  options,
}: PropertySelectProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type PropertyToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function PropertyToggle({
  label,
  checked,
  onChange,
}: PropertyToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-input"
      />
    </label>
  );
}
