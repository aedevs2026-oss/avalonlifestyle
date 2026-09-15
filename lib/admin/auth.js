import { createClient } from "@/lib/supabase/server";

export async function getSessionUser() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

export async function getAdminProfile() {
  const user = await getSessionUser();
  if (!user) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("admin_profiles")
      .select("user_id, email, full_name, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) return null;
    return { ...data, authUser: user };
  } catch {
    return null;
  }
}

export async function requireAdminProfile() {
  const profile = await getAdminProfile();
  if (!profile) {
    throw new Error("UNAUTHORIZED");
  }
  return profile;
}
