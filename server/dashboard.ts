import { prisma } from "@/lib/prisma";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [projectCount, pageCount, publishedCount] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.page.count({
      where: { project: { userId } },
    }),
    prisma.page.count({
      where: {
        project: { userId },
        status: "PUBLISHED",
      },
    }),
  ]);

  return {
    projectCount,
    pageCount,
    publishedCount,
  };
}
