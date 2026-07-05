import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { listProjects } from "@/server/projects";
import { ProjectsList } from "@/features/projects/components/projects-list";

export default async function ProjectsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const projects = await listProjects(user.id);

  return <ProjectsList initialProjects={projects} />;
}
