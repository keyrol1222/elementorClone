import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { applyTemplateSchema } from "@/lib/validations/template";
import { applyTemplateToPage } from "@/server/templates";
import { parsePageContent } from "@/lib/page-content";

type RouteParams = {
  params: Promise<{ projectId: string; pageId: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId, pageId } = await params;
  const body: unknown = await request.json();
  const parsed = applyTemplateSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const page = await applyTemplateToPage(
    user.id,
    projectId,
    pageId,
    parsed.data,
  );

  if (!page) {
    return apiNotFound("Page or template not found");
  }

  return apiSuccess({
    ...page,
    content: parsePageContent(page.content),
  });
}
