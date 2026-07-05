import { requireApiUser } from "@/lib/api/auth";
import {
  apiError,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api/response";
import { createProjectSchema } from "@/lib/validations/project";
import { createProject, listProjects } from "@/server/projects";

export async function GET() {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const projects = await listProjects(user.id);
  return apiSuccess(projects);
}

export async function POST(request: Request) {
  const { user, unauthorized } = await requireApiUser();

  if (!user) {
    return unauthorized ?? apiUnauthorized();
  }

  const body: unknown = await request.json();
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const project = await createProject(user.id, parsed.data);
  return apiSuccess(project, 201);
}
