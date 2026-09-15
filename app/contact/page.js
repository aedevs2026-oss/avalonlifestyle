import { getCompanySettings, toSiteConfig } from "@/lib/cms/site";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact",
  description:
    "We're here for a better tomorrow. Contact Avalon Premium Mattress for support, inquiries, and expert guidance.",
};

export default async function ContactPage() {
  const company = await getCompanySettings();
  return <ContactClient siteConfig={toSiteConfig(company)} />;
}
