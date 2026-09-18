import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { isAdminAuthenticated } from "@/lib/auth";
import { getContent, githubPersistConfigured } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const content = await getContent();

  return (
    <AdminDashboard
      initialContent={content}
      githubPersist={githubPersistConfigured()}
    />
  );
}
