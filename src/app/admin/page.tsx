import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminGate } from "@/components/admin/AdminGate";
import { isAdminAuthenticated } from "@/lib/auth";
import { getContent, githubPersistConfigured } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    return <AdminGate />;
  }

  const content = await getContent();

  return (
    <AdminDashboard
      initialContent={content}
      githubPersist={githubPersistConfigured()}
    />
  );
}
