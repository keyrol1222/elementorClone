"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pagesApi } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";
import { updatePageSchema, type UpdatePageInput } from "@/lib/validations/page";
import type { PageSummary } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PageListItemProps = {
  projectId: string;
  page: PageSummary;
  onUpdated: () => void;
};

function statusVariant(status: PageSummary["status"]) {
  switch (status) {
    case "PUBLISHED":
      return "default" as const;
    case "ARCHIVED":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

export function PageListItem({ projectId, page, onUpdated }: PageListItemProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePageInput>({
    resolver: zodResolver(updatePageSchema),
    defaultValues: {
      title: page.title,
      slug: page.slug,
    },
  });

  async function handlePublish() {
    setIsPublishing(true);

    try {
      await pagesApi.publish(projectId, page.id);
      onUpdated();
      router.refresh();
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${page.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await pagesApi.delete(projectId, page.id);
      onUpdated();
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleRename(data: UpdatePageInput) {
    setRenameError(null);

    try {
      await pagesApi.update(projectId, page.id, {
        title: data.title,
        slug: data.slug,
      });

      setRenameOpen(false);
      onUpdated();
      router.refresh();
    } catch (err) {
      setRenameError(err instanceof Error ? err.message : "Failed to rename page");
    }
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{page.title}</p>
              <Badge variant={statusVariant(page.status)}>{page.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">/{page.slug}</p>
            <p className="text-xs text-muted-foreground">
              Updated {formatDate(page.updatedAt)}
              {page.publishedAt
                ? ` · Published ${formatDate(page.publishedAt)}`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" disabled title="Editor available in Phase 3">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Publish
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename page</DialogTitle>
            <DialogDescription>
              Update the page title and slug.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleRename)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`rename-title-${page.id}`}>Title</Label>
              <Input id={`rename-title-${page.id}`} {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`rename-slug-${page.id}`}>Slug</Label>
              <Input id={`rename-slug-${page.id}`} {...register("slug")} />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>

            {renameError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {renameError}
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
