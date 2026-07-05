import { requireApiUser } from "@/lib/api/auth";
import { apiNotFound, apiSuccess, apiUnauthorized } from "@/lib/api/response";
import { publishPage } from "@/server/pages";

type RouteParams = {
  params: Promise<{ projectId: string; pageId: string }>;
};

export async function POST(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId, pageId } = await params;
  const page = await publishPage(user.id, projectId, pageId);

  if (!page) {
    return apiNotFound("Page not found");
  }

  return apiSuccess(page);
}
