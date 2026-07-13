import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import {
  createTemplateSchema,
} from "@/lib/validations/template";
import { createTemplate, listTemplates } from "@/server/templates";

export async function GET() {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const templates = await listTemplates(user.id);
  return apiSuccess(templates);
}

export async function POST(request: Request) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const body: unknown = await request.json();
  const parsed = createTemplateSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const template = await createTemplate(user.id, parsed.data);
  return apiSuccess(template, 201);
}
