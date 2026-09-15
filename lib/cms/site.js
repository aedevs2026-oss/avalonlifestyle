import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig as staticSite } from "@/lib/site";

export async function getCompanySettings() {
  const admin = createAdminClient();
  if (!admin) return staticSite;

  const { data } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "company")
    .maybeSingle();

  const company = data?.value;
  if (!company) return staticSite;

  return {
    name: company.name ?? staticSite.name,
    tagline: company.tagline ?? staticSite.tagline,
    phone: company.phone ?? staticSite.phone,
    email: company.email ?? staticSite.email,
    address: company.address ?? staticSite.address,
    mapEmbedQuery: company.map_embed_query ?? staticSite.mapEmbedQuery,
    copyright: staticSite.copyright,
    whatsapp: company.whatsapp ?? "",
    salesEmail: company.sales_email ?? "",
    supportEmail: company.support_email ?? "",
    hours: company.hours ?? "",
    social: company.social ?? {},
  };
}

/** Shape compatible with existing ContactClient / Footer usage. */
export function toSiteConfig(company) {
  return {
    name: company.name,
    tagline: company.tagline,
    phone: company.phone,
    email: company.email,
    address: company.address,
    mapEmbedQuery: company.mapEmbedQuery ?? company.map_embed_query,
    copyright: company.copyright,
  };
}
