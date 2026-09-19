import { redirect } from "next/navigation";
import { AdminGate } from "@/components/admin/AdminGate";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return <AdminGate />;
}
