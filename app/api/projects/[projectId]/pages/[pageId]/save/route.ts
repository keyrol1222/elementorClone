import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { savePageSchema } from "@/lib/validations/page";
import { savePageContent } from "@/server/pages";
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
  const parsed = savePageSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const result = await savePageContent(user.id, projectId, pageId, {
    ...parsed.data,
    content: parsePageContent(parsed.data.content),
  });

  if (!result) {
    return apiNotFound("Page not found");
  }

  return apiSuccess(result);
}
