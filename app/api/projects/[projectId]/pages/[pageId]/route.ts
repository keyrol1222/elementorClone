import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { updatePageSchema } from "@/lib/validations/page";
import { deletePage, getPageById, updatePage } from "@/server/pages";

type RouteParams = {
  params: Promise<{ projectId: string; pageId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId, pageId } = await params;
  const page = await getPageById(user.id, projectId, pageId);

  if (!page) {
    return apiNotFound("Page not found");
  }

  return apiSuccess(page);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId, pageId } = await params;
  const body: unknown = await request.json();
  const parsed = updatePageSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const page = await updatePage(user.id, projectId, pageId, parsed.data);

  if (!page) {
    return apiNotFound("Page not found");
  }

  return apiSuccess(page);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId, pageId } = await params;
  const deleted = await deletePage(user.id, projectId, pageId);

  if (!deleted) {
    return apiNotFound("Page not found");
  }

  return apiSuccess({ id: pageId });
}
