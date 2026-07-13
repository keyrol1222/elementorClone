import { getCurrentUser } from "@/server/auth";
import { listTemplates } from "@/server/templates";
import { TemplatesPageClient } from "@/features/templates/templates-page-client";

export default async function TemplatesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const templates = await listTemplates(user.id);

  return <TemplatesPageClient initialTemplates={templates} />;
}
