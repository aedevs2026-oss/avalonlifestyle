import { getMailTransportConfig, isSmtpReady } from "@/lib/email/config";
import { sendViaSmtp } from "@/lib/email/smtp";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendViaResend({ apiKey, from, to, subject, html, text }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email] Resend error", res.status, body);
    return { ok: false, error: body, method: "resend" };
  }

  return { ok: true, method: "resend" };
}

/**
 * Send email using SMTP (default) or Resend per admin/env configuration.
 */
export async function sendEmail({ to, subject, html, text }) {
  const config = await getMailTransportConfig();
  const fromHeader = config.getFromHeader();

  if (config.provider === "smtp" && isSmtpReady(config)) {
    try {
      return await sendViaSmtp({
        smtp: config.smtp,
        from: config.from,
        to,
        subject,
        html,
        text,
      });
    } catch (err) {
      console.error("[email] SMTP error", err);
      return { ok: false, error: err.message || "SMTP send failed", method: "smtp" };
    }
  }

  if (config.provider === "resend" && config.resendApiKey) {
    return sendViaResend({
      apiKey: config.resendApiKey,
      from: fromHeader,
      to,
      subject,
      html,
      text,
    });
  }

  if (config.resendApiKey) {
    return sendViaResend({
      apiKey: config.resendApiKey,
      from: fromHeader,
      to,
      subject,
      html,
      text,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[email:dev]", { to, subject, provider: config.provider, text });
  }
  return {
    ok: true,
    skipped: true,
    reason: "Configure SMTP_PASSWORD in .env.local or set provider to resend with RESEND_API_KEY",
  };
}

export function formatDealerListHtml(dealers) {
  if (!dealers?.length) {
    return "<p><em>No dealers with coordinates matched this location.</em></p>";
  }
  return `<ul>${dealers
    .map(
      (d) =>
        `<li><strong>${escapeHtml(d.name)}</strong> — ${escapeHtml(d.city)} (${escapeHtml(
          d.distanceLabel || "",
        )})<br/>${escapeHtml(d.address)}<br/>Phone: ${escapeHtml(d.phone || "—")}</li>`,
    )
    .join("")}</ul>`;
}

export async function sendContactNotification({
  to,
  submission,
  nearestDealers,
}) {
  const subject = `[Avalon Contact] ${submission.subject || "General"} — ${submission.name}`;
  const dealerBlock = formatDealerListHtml(nearestDealers);

  const html = `
    <h2>New customer message</h2>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>
    <p><strong>City:</strong> ${escapeHtml(submission.city)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(submission.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(submission.message)}</p>
    <h3>Suggested nearby dealers</h3>
    ${dealerBlock}
  `;

  const text = [
    "New customer message",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone || ""}`,
    `City: ${submission.city || ""}`,
    `Subject: ${submission.subject || ""}`,
    "",
    submission.message,
    "",
    "Suggested nearby dealers:",
    ...(nearestDealers || []).map(
      (d) => `- ${d.name} (${d.distanceLabel}) — ${d.address} — ${d.phone || ""}`,
    ),
  ].join("\n");

  return sendEmail({ to, subject, html, text });
}

export async function sendDealerLeadNotification({ to, submission, distanceLabel }) {
  const subject = `[Avalon Lead] Customer enquiry near you — ${submission.name}`;
  const html = `
    <h2>Customer enquiry in your area</h2>
    <p><strong>Distance:</strong> ${escapeHtml(distanceLabel || "—")}</p>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>
    <p><strong>City:</strong> ${escapeHtml(submission.city)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(submission.subject)}</p>
    <p>${escapeHtml(submission.message)}</p>
    <p><em>Please follow up promptly. Main office has also been notified.</em></p>
  `;
  const text = [
    "Customer enquiry in your area",
    `Distance: ${distanceLabel || ""}`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone || ""}`,
    submission.message,
  ].join("\n");
  return sendEmail({ to, subject, html, text });
}

export async function sendCustomerConfirmation({ to, name }) {
  const subject = "We received your message — Avalon Premium Mattress";
  const html = `
    <p>Dear ${escapeHtml(name)},</p>
    <p>Thank you for contacting Avalon. Our team has received your enquiry and will respond within 24 hours.</p>
    <p>For urgent matters, call us during business hours.</p>
    <p>Warm regards,<br/>Avalon Premium Mattress</p>
  `;
  const text = `Dear ${name},\n\nThank you for contacting Avalon. We will respond within 24 hours.\n\nAvalon Premium Mattress`;
  return sendEmail({ to, subject, html, text });
}

export async function sendDealerApplicationNotification({ to, application }) {
  const subject = `[Avalon Dealer Enquiry] ${application.business_name}`;
  const html = `
    <h2>New dealer partnership enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(application.name)}</p>
    <p><strong>Business:</strong> ${escapeHtml(application.business_name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(application.phone)}</p>
    <p><strong>City:</strong> ${escapeHtml(application.city)}</p>
    <p><strong>Business type:</strong> ${escapeHtml(application.business_type)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(application.message)}</p>
  `;

  const text = [
    "New dealer partnership enquiry",
    `Name: ${application.name}`,
    `Business: ${application.business_name}`,
    `Email: ${application.email}`,
    `Phone: ${application.phone}`,
    `City: ${application.city || ""}`,
    `Type: ${application.business_type || ""}`,
    "",
    application.message || "",
  ].join("\n");

  return sendEmail({ to, subject, html, text });
}
