import Link from "next/link";
import { FolderKanban, FileText, Globe, Plus } from "lucide-react";
import { getCurrentUser } from "@/server/auth";
import { getDashboardStats, getUserProjects } from "@/server/dashboard";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [stats, projects] = await Promise.all([
    getDashboardStats(user.id),
    getUserProjects(user.id),
  ]);

  const statCards = [
    {
      title: "Projects",
      value: stats.projectCount,
      icon: FolderKanban,
      description: "Total projects",
    },
    {
      title: "Pages",
      value: stats.pageCount,
      icon: FileText,
      description: "Total pages created",
    },
    {
      title: "Published",
      value: stats.publishedCount,
      icon: Globe,
      description: "Live pages",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h2>
          <p className="text-muted-foreground">
            Manage your projects and build beautiful pages.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>
            Your most recently updated projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
              <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                Create your first project to start building pages with the visual
                editor.
              </p>
              <Button asChild>
                <Link href="/dashboard/projects">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Updated {formatDate(project.updatedAt)}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {project._count.pages} page
                    {project._count.pages !== 1 ? "s" : ""}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
