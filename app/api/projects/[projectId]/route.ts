import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiNotFound,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { updateProjectSchema } from "@/lib/validations/project";
import {
  deleteProject,
  getProjectById,
  updateProject,
} from "@/server/projects";

type RouteParams = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId } = await params;
  const project = await getProjectById(user.id, projectId);

  if (!project) {
    return apiNotFound("Project not found");
  }

  return apiSuccess(project);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId } = await params;
  const body: unknown = await request.json();
  const parsed = updateProjectSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const project = await updateProject(user.id, projectId, parsed.data);

  if (!project) {
    return apiNotFound("Project not found");
  }

  return apiSuccess(project);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const { projectId } = await params;
  const deleted = await deleteProject(user.id, projectId);

  if (!deleted) {
    return apiNotFound("Project not found");
  }

  return apiSuccess({ id: projectId });
}
