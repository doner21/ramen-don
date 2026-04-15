import AdminNav from "@/components/admin/AdminNav";
import AdminAuthWatcher from "@/components/admin/AdminAuthWatcher";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#1A1714]">
      <AdminAuthWatcher />
      <AdminNav />
      <main className="flex-1 p-8 pt-[88px] lg:pt-8 overflow-auto">{children}</main>
    </div>
  );
}
