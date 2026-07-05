"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { pagesApi } from "@/lib/api/client";
import type { PageSummary, ProjectDetail } from "@/types/project";
import { CreatePageDialog } from "@/features/pages/components/create-page-dialog";
import { PageListItem } from "@/features/pages/components/page-list-item";
import { Card, CardContent } from "@/components/ui/card";

type PagesListProps = {
  project: ProjectDetail;
};

export function PagesList({ project }: PagesListProps) {
  const [pages, setPages] = useState<PageSummary[]>(project.pages);

  useEffect(() => {
    setPages(project.pages);
  }, [project.pages]);

  const refreshPages = useCallback(async () => {
    const data = await pagesApi.list(project.id);
    setPages(data);
  }, [project.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pages</h3>
          <p className="text-sm text-muted-foreground">
            Manage pages in this project.
          </p>
        </div>
        <CreatePageDialog projectId={project.id} onCreated={refreshPages} />
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-10 w-10 text-muted-foreground/50" />
            <h4 className="mb-2 font-medium">No pages yet</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first page to get started.
            </p>
            <CreatePageDialog projectId={project.id} onCreated={refreshPages} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <PageListItem
              key={page.id}
              projectId={project.id}
              page={page}
              onUpdated={refreshPages}
            />
          ))}
        </div>
      )}
    </div>
  );
}
