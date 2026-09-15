import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const nextPath = typeof params?.next === "string" ? params.next : "/admin";
  const errorCode = typeof params?.error === "string" ? params.error : "";

  return <AdminLoginForm nextPath={nextPath} errorCode={errorCode} />;
}
