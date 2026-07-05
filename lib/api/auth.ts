import { getCurrentUser } from "@/server/auth";
import { apiUnauthorized } from "@/lib/api/response";

export async function requireApiUser() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, unauthorized: apiUnauthorized() } as const;
  }

  return { user, unauthorized: null } as const;
}
