import { getAdminProfile } from "@/lib/admin/auth";
import { NextResponse } from "next/server";

export async function requireAdminApi() {
  const profile = await getAdminProfile();
  if (!profile) {
    return { profile: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { profile, response: null };
}
