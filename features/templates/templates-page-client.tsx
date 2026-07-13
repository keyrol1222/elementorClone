"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, Trash2 } from "lucide-react";
import { templatesApi } from "@/lib/api/client";
import type { TemplateSummary } from "@/types/versioning";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TemplatesPageClientProps = {
  initialTemplates: TemplateSummary[];
};

export function TemplatesPageClient({
  initialTemplates,
}: TemplatesPageClientProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(templateId: string) {
    if (!confirm("Delete this template?")) {
      return;
    }

    setDeletingId(templateId);
    setError(null);

    try {
      await templatesApi.delete(templateId);
      setTemplates((current) =>
        current.filter((template) => template.id !== templateId),
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
        <p className="text-sm text-muted-foreground">
          Reusable page and section layouts. Save from the editor Settings
          panel.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Layers className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">No templates yet</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Open a page in the editor, go to Settings, and save the page as a
              template.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Badge variant="secondary">{template.type}</Badge>
                </div>
                <CardDescription>
                  {template.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Updated{" "}
                  {new Date(template.updatedAt).toLocaleDateString()}
                  {template.isPublic ? " · Public" : ""}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  disabled={deletingId === template.id}
                  onClick={() => void handleDelete(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
