import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { updateTemplateSchema } from "@/lib/validations/template";
import {
  deleteTemplate,
  getTemplateById,
  updateTemplate,
} from "@/server/templates";

type RouteParams = {
  params: Promise<{ templateId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { templateId } = await params;
  const template = await getTemplateById(user.id, templateId);

  if (!template) {
    return apiNotFound("Template not found");
  }

  return apiSuccess(template);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { templateId } = await params;
  const body: unknown = await request.json();
  const parsed = updateTemplateSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const template = await updateTemplate(user.id, templateId, parsed.data);

  if (!template) {
    return apiNotFound("Template not found");
  }

  return apiSuccess(template);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { templateId } = await params;
  const deleted = await deleteTemplate(user.id, templateId);

  if (!deleted) {
    return apiNotFound("Template not found");
  }

  return apiSuccess({ id: templateId });
}
