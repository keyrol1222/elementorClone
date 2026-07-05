"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, FolderKanban } from "lucide-react";
import { projectsApi } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";
import type { ProjectSummary } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProjectSwitcherProps = {
  currentProjectId?: string;
};

export function ProjectSwitcher({ currentProjectId }: ProjectSwitcherProps) {
  const router = useRouter();
  const { activeProjectId, setActiveProjectId } = useProjectStore();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedId = currentProjectId ?? activeProjectId;
  const selectedProject = projects.find((project) => project.id === selectedId);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await projectsApi.list();
        setProjects(data);

        if (currentProjectId) {
          setActiveProjectId(currentProjectId);
        } else if (!activeProjectId && data.length > 0) {
          setActiveProjectId(data[0].id);
        }
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [activeProjectId, currentProjectId, setActiveProjectId]);

  function handleSelect(projectId: string) {
    setActiveProjectId(projectId);
    router.push(`/dashboard/projects/${projectId}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="max-w-[220px] justify-between"
          disabled={loading}
        >
          <span className="flex items-center gap-2 truncate">
            <FolderKanban className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {loading
                ? "Loading..."
                : (selectedProject?.name ?? "Select project")}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <DropdownMenuLabel>Switch project</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {projects.length === 0 ? (
          <DropdownMenuItem disabled>No projects yet</DropdownMenuItem>
        ) : (
          projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => handleSelect(project.id)}
              className="flex items-center justify-between"
            >
              <span className="truncate">{project.name}</span>
              {project.id === selectedId && (
                <Check className={cn("h-4 w-4 shrink-0")} />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
