"use client";

import { useCallback, useEffect, useState } from "react";
import { FolderKanban } from "lucide-react";
import { projectsApi } from "@/lib/api/client";
import type { ProjectSummary } from "@/types/project";
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { ProjectCard } from "@/features/projects/components/project-card";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

type ProjectsListProps = {
  initialProjects: ProjectSummary[];
};

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [projects, setProjects] = useState(initialProjects);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const refreshProjects = useCallback(async () => {
    const data = await projectsApi.list();
    setProjects(data);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Create and manage your website projects.
          </p>
        </div>
        <CreateProjectDialog onCreated={refreshProjects} />
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Create your first project to start building pages.
            </p>
            <CreateProjectDialog onCreated={refreshProjects} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDeleted={refreshProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
}
