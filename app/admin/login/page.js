import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAdminProfile } from "@/lib/admin/auth";

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const nextPath = typeof params?.next === "string" ? params.next : "/admin";
  const errorCode = typeof params?.error === "string" ? params.error : "";

  const profile = await getAdminProfile();
  if (profile && !errorCode) {
    redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
  }

  return <AdminLoginForm nextPath={nextPath} errorCode={errorCode} />;
}
