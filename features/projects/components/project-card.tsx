"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderKanban, MoreHorizontal, Trash2 } from "lucide-react";
import { projectsApi } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";
import type { ProjectSummary } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProjectCardProps = {
  project: ProjectSummary;
  onDeleted: () => void;
};

export function ProjectCard({ project, onDeleted }: ProjectCardProps) {
  const router = useRouter();
  const setActiveProjectId = useProjectStore((state) => state.setActiveProjectId);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${project.name}"? All pages in this project will be removed.`,
    );

    if (!confirmed) {
      return;
    }

    await projectsApi.delete(project.id);
    onDeleted();
    router.refresh();
  }

  function handleOpen() {
    setActiveProjectId(project.id);
  }

  return (
    <Card className="group relative transition-colors hover:bg-accent/50">
      <Link href={`/dashboard/projects/${project.id}`} onClick={handleOpen}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            {project.name}
          </CardTitle>
          <CardDescription>
            {project.description ?? "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Updated {formatDate(project.updatedAt)}
          </span>
          <Badge variant="secondary">
            {project.pageCount} page{project.pageCount !== 1 ? "s" : ""}
          </Badge>
        </CardContent>
      </Link>

      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
