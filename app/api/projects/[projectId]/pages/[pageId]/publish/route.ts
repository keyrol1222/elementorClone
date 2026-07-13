import { z } from "zod";
import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { parsePageContent } from "@/lib/page-content";
import { publishPage } from "@/server/pages";

type RouteParams = {
  params: Promise<{ projectId: string; pageId: string }>;
};

const publishBodySchema = z
  .object({
    content: z
      .object({
        version: z.number().int().positive(),
        root: z.array(z.record(z.string(), z.unknown())),
      })
      .optional(),
  })
  .optional();

export async function POST(request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId, pageId } = await params;

  let contentOverride: ReturnType<typeof parsePageContent> | undefined;

  try {
    const body: unknown = await request.json().catch(() => undefined);
    const parsed = publishBodySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    if (parsed.data?.content) {
      contentOverride = parsePageContent(parsed.data.content);
    }
  } catch {
    // Empty body is fine
  }

  const page = await publishPage(
    user.id,
    projectId,
    pageId,
    contentOverride,
  );

  if (!page) {
    return apiNotFound("Page not found");
  }

  return apiSuccess(page);
}
