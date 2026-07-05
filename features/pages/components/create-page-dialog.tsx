"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { pagesApi } from "@/lib/api/client";
import { createPageSchema, type CreatePageInput } from "@/lib/validations/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreatePageDialogProps = {
  projectId: string;
  onCreated?: () => void;
};

export function CreatePageDialog({ projectId, onCreated }: CreatePageDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePageInput>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(data: CreatePageInput) {
    setError(null);

    try {
      await pagesApi.create(projectId, {
        title: data.title,
        slug: data.slug || undefined,
      });

      setOpen(false);
      reset();
      onCreated?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create page");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create page</DialogTitle>
          <DialogDescription>
            Add a new page to your project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-title">Title</Label>
            <Input
              id="page-title"
              placeholder="About Us"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-slug">Slug (optional)</Label>
            <Input
              id="page-slug"
              placeholder="about-us"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create page"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
