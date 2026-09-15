import { siteConfig } from "@/lib/site";
import { getEmailSettings } from "@/lib/data/dealers";

const ENV_DEFAULTS = {
  provider: process.env.EMAIL_PROVIDER || "smtp",
  smtp_host: process.env.SMTP_HOST || "smtp.gmail.com",
  smtp_port: Number(process.env.SMTP_PORT) || 587,
  smtp_secure: process.env.SMTP_SECURE === "true",
  smtp_user: process.env.SMTP_USER || "",
  from_name: process.env.SMTP_FROM_NAME || "Avalon Premium Mattress",
  from_email: process.env.SMTP_FROM || process.env.EMAIL_FROM || siteConfig.email,
};

/**
 * Resolved outbound mail config (admin DB + env). Password only from SMTP_PASSWORD.
 */
export async function getMailTransportConfig() {
  const settings = await getEmailSettings();
  const provider = settings.provider || ENV_DEFAULTS.provider;

  const fromEmail =
    settings.from_email || settings.smtp_user || ENV_DEFAULTS.from_email;
  const fromName = settings.from_name || ENV_DEFAULTS.from_name;

  return {
    provider,
    resendApiKey: process.env.RESEND_API_KEY || "",
    smtp: {
      host: settings.smtp_host || ENV_DEFAULTS.smtp_host,
      port: Number(settings.smtp_port) || ENV_DEFAULTS.smtp_port,
      secure: settings.smtp_secure ?? ENV_DEFAULTS.smtp_secure,
      user: settings.smtp_user || ENV_DEFAULTS.smtp_user,
      pass: process.env.SMTP_PASSWORD || "",
    },
    from: {
      name: fromName,
      email: fromEmail.replace(/^.*<([^>]+)>.*$/, "$1").trim() || fromEmail,
    },
    getFromHeader() {
      return `${fromName} <${this.from.email}>`;
    },
  };
}

export function isSmtpReady(config) {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);
}
