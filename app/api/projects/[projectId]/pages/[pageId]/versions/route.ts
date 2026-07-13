import { requireApiUser } from "@/lib/api/auth";
import {
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { listPublishVersions } from "@/server/pages";

type RouteParams = {
  params: Promise<{ projectId: string; pageId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId, pageId } = await params;
  const versions = await listPublishVersions(user.id, projectId, pageId);

  if (!versions) {
    return apiNotFound("Page not found");
  }

  return apiSuccess(versions);
}
