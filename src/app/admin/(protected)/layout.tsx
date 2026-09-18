import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import Sidebar from "@/components/admin/Sidebar";
import { Toaster } from "sonner";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-cream-100">
      <Sidebar role={admin.role} name={admin.full_name} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">{children}</main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
