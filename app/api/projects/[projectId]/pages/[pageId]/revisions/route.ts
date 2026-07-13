import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { restoreRevisionSchema } from "@/lib/validations/page";
import { listRevisions, restoreRevision } from "@/server/pages";

type RouteParams = {
  params: Promise<{ projectId: string; pageId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId, pageId } = await params;
  const revisions = await listRevisions(user.id, projectId, pageId);

  if (!revisions) {
    return apiNotFound("Page not found");
  }

  return apiSuccess(revisions);
}

export async function POST(request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId, pageId } = await params;
  const body: unknown = await request.json();
  const parsed = restoreRevisionSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const page = await restoreRevision(
    user.id,
    projectId,
    pageId,
    parsed.data.revisionId,
  );

  if (!page) {
    return apiNotFound("Revision not found");
  }

  return apiSuccess(page);
}
