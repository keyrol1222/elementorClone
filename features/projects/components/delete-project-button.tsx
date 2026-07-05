"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { projectsApi } from "@/lib/api/client";
import { useProjectStore } from "@/store/project-store";
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

type DeleteProjectButtonProps = {
  projectId: string;
  projectName: string;
};

export function DeleteProjectButton({
  projectId,
  projectName,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const { activeProjectId, setActiveProjectId } = useProjectStore();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setIsDeleting(true);

    try {
      await projectsApi.delete(projectId);

      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }

      setOpen(false);
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{projectName}&quot;? This will
            permanently remove all pages in this project.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
