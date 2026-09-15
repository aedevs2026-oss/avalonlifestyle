import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsAdmin from "@/components/admin/SettingsAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEmailSettings } from "@/lib/data/dealers";
import { siteConfig } from "@/lib/site";

async function loadCompanySettings() {
  const admin = createAdminClient();
  const fallback = {
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.phone,
    email: siteConfig.email,
    address: siteConfig.address,
    map_embed_query: siteConfig.mapEmbedQuery,
    hours: "Mon – Sat, 9 AM – 6 PM",
    whatsapp: "",
    social: {},
  };
  if (!admin) return fallback;
  const { data } = await admin.from("site_settings").select("value").eq("key", "company").maybeSingle();
  return data?.value ? { ...fallback, ...data.value } : fallback;
}

export default async function AdminSettingsPage() {
  const [companySettings, emailSettings] = await Promise.all([
    loadCompanySettings(),
    getEmailSettings(),
  ]);
  const envStatus = {
    url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    service: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resend: Boolean(process.env.RESEND_API_KEY),
    smtpPassword: Boolean(process.env.SMTP_PASSWORD),
  };

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Company contact details for the live site, enquiry routing, and dealer radius."
      />
      <SettingsAdmin companySettings={companySettings} emailSettings={emailSettings} envStatus={envStatus} />
    </>
  );
}
