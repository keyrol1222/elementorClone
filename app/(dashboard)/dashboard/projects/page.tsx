import { FolderKanban } from "lucide-react";
import { getCurrentUser } from "@/server/auth";
import { getUserProjects } from "@/server/dashboard";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function ProjectsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const projects = await getUserProjects(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        <p className="text-muted-foreground">
          Manage your website projects. Full CRUD coming in Phase 2.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Project creation and management will be available in Phase 2.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="h-full transition-colors hover:bg-accent/50">
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
                    {project._count.pages} pages
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
