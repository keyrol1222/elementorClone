"use client";

import { usePathname } from "next/navigation";
import { ProjectSwitcher } from "@/features/projects/components/project-switcher";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/projects": "Projects",
};

function getTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard/projects/") && pathname !== "/dashboard/projects") {
    return "Project";
  }

  return titles[pathname] ?? "Dashboard";
}

function getProjectId(pathname: string): string | undefined {
  const match = pathname.match(/^\/dashboard\/projects\/([^/]+)/);
  return match?.[1];
}

export function DashboardHeader() {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const projectId = getProjectId(pathname);

  return (
    <div className="flex items-center gap-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      {(pathname.startsWith("/dashboard/projects") || projectId) && (
        <ProjectSwitcher currentProjectId={projectId} />
      )}
    </div>
  );
}
