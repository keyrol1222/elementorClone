import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { createPageSchema } from "@/lib/validations/page";
import { createPage, listPages } from "@/server/pages";

type RouteParams = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId } = await params;
  const pages = await listPages(user.id, projectId);

  if (!pages) {
    return apiNotFound("Project not found");
  }

  return apiSuccess(pages);
}

export async function POST(request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId } = await params;
  const body: unknown = await request.json();
  const parsed = createPageSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const page = await createPage(user.id, projectId, parsed.data);

  if (!page) {
    return apiNotFound("Project not found");
  }

  return apiSuccess(page, 201);
}
