import { requireApiUser } from "@/lib/api/auth";
import { apiSuccess, apiUnauthorized } from "@/lib/api/response";
import { getDashboardStats } from "@/server/dashboard";

export async function GET() {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const stats = await getDashboardStats(user.id);
  return apiSuccess(stats);
}
