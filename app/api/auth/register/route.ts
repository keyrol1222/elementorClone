import { getCurrentUser } from "@/server/auth";
import { apiError, apiSuccess } from "@/lib/api/response";
import { registerSchema } from "@/lib/validations/auth";
import { registerUser } from "@/server/users";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (user) {
    return apiError("You are already signed in", 400);
  }

  const body: unknown = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const result = await registerUser(parsed.data);

  if ("error" in result) {
    return apiError(result.error ?? "Registration failed", 409);
  }

  return apiSuccess(result.user, 201);
}
