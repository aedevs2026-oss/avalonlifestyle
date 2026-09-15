"use client";

import { useState } from "react";
import { saveCompanySettings, saveEmailSettings, sendTestEmail } from "@/lib/admin/actions";
import { useAdminCrud } from "@/lib/admin/useAdminCrud";
import AdminFeedback from "@/components/admin/AdminFeedback";

export default function SettingsAdmin({ companySettings, emailSettings, envStatus }) {
  const [company, setCompany] = useState(companySettings);
  const [email, setEmail] = useState(emailSettings);
  const [testTo, setTestTo] = useState(emailSettings.main_email || "");
  const { busy, message, error, run } = useAdminCrud();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await run(() => saveCompanySettings(company), "Company information saved.");
        }}
        className="admin-card admin-card-body space-y-3"
      >
        <h2 className="font-serif text-xl">Company & contact information</h2>
        <AdminFeedback error={error} message={message} />
        <input className="admin-input" placeholder="Company name" value={company.name || ""} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
        <input className="admin-input" placeholder="Tagline" value={company.tagline || ""} onChange={(e) => setCompany({ ...company, tagline: e.target.value })} />
        <input className="admin-input" placeholder="Phone" value={company.phone || ""} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
        <input className="admin-input" placeholder="WhatsApp" value={company.whatsapp || ""} onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })} />
        <input className="admin-input" placeholder="Main email" value={company.email || ""} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
        <textarea className="admin-textarea" placeholder="Address" value={company.address || ""} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
        <input className="admin-input" placeholder="Google Maps query" value={company.map_embed_query || ""} onChange={(e) => setCompany({ ...company, map_embed_query: e.target.value })} />
        <input className="admin-input" placeholder="Working hours" value={company.hours || ""} onChange={(e) => setCompany({ ...company, hours: e.target.value })} />
        <button type="submit" disabled={busy} className="admin-btn admin-btn-primary">Save company info</button>
      </form>

      <div className="space-y-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await run(() => saveEmailSettings(email), "Email & SMTP settings saved.");
          }}
          className="admin-card admin-card-body space-y-3"
        >
          <h2 className="font-serif text-xl">SMTP & enquiry routing</h2>

          <label className="admin-label">Mail provider</label>
          <select
            className="admin-select"
            value={email.provider || "smtp"}
            onChange={(e) => setEmail({ ...email, provider: e.target.value })}
          >
            <option value="smtp">SMTP (Gmail, Outlook, custom)</option>
            <option value="resend">Resend API</option>
          </select>

          <p className="text-xs text-[var(--admin-muted)]">
            SMTP password is stored only in <code>.env.local</code> as <code>SMTP_PASSWORD</code> (never in the database).
          </p>

          <input
            className="admin-input"
            placeholder="SMTP host (e.g. smtp.gmail.com)"
            value={email.smtp_host || ""}
            onChange={(e) => setEmail({ ...email, smtp_host: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="admin-input"
              type="number"
              placeholder="Port (587)"
              value={email.smtp_port ?? 587}
              onChange={(e) => setEmail({ ...email, smtp_port: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(email.smtp_secure)}
                onChange={(e) => setEmail({ ...email, smtp_secure: e.target.checked })}
              />
              SSL / port 465
            </label>
          </div>
          <input
            className="admin-input"
            placeholder="SMTP username (usually your email)"
            value={email.smtp_user || ""}
            onChange={(e) => setEmail({ ...email, smtp_user: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="From name"
            value={email.from_name || ""}
            onChange={(e) => setEmail({ ...email, from_name: e.target.value })}
          />
          <input
            className="admin-input"
            type="email"
            placeholder="From email"
            value={email.from_email || ""}
            onChange={(e) => setEmail({ ...email, from_email: e.target.value })}
          />

          <hr className="border-[var(--admin-border)]" />

          <input
            className="admin-input"
            type="email"
            placeholder="Main enquiry email (inbox)"
            value={email.main_email || ""}
            onChange={(e) => setEmail({ ...email, main_email: e.target.value })}
          />
          <input
            className="admin-input"
            type="email"
            placeholder="Sales email (optional)"
            value={email.sales_email || ""}
            onChange={(e) => setEmail({ ...email, sales_email: e.target.value })}
          />
          <input
            className="admin-input"
            type="number"
            min={1}
            max={500}
            placeholder="Dealer search radius (km)"
            value={email.dealer_search_radius_km ?? 25}
            onChange={(e) => setEmail({ ...email, dealer_search_radius_km: e.target.value })}
          />
          <input
            className="admin-input"
            type="number"
            min={1}
            max={10}
            placeholder="Max dealers to notify"
            value={email.dealer_suggestions_count ?? 3}
            onChange={(e) => setEmail({ ...email, dealer_suggestions_count: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={email.dealer_notification_enabled !== false}
              onChange={(e) => setEmail({ ...email, dealer_notification_enabled: e.target.checked })}
            />
            Email nearest dealers
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={email.customer_confirmation_enabled !== false}
              onChange={(e) => setEmail({ ...email, customer_confirmation_enabled: e.target.checked })}
            />
            Send customer confirmation email
          </label>

          <button type="submit" disabled={busy} className="admin-btn admin-btn-primary">
            Save email settings
          </button>
        </form>

        <div className="admin-card admin-card-body space-y-3">
          <h3 className="font-serif text-lg">Send test email</h3>
          <input
            className="admin-input"
            type="email"
            placeholder="Test recipient"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
          />
          <button
            type="button"
            disabled={busy}
            className="admin-btn admin-btn-ghost"
            onClick={async () => {
              await run(async () => {
                const result = await sendTestEmail(testTo);
                return result;
              }, `Test email sent.`);
            }}
          >
            Send SMTP test
          </button>

          <div className="border-t border-[var(--admin-border)] pt-3 text-xs text-[var(--admin-muted)]">
            <p className="mb-2 font-semibold text-[var(--admin-text)]">Server environment</p>
            <ul className="space-y-1">
              <li>SMTP password: {envStatus.smtpPassword ? "✓ set" : "✗ missing SMTP_PASSWORD"}</li>
              <li>Resend API: {envStatus.resend ? "✓ optional" : "—"}</li>
              <li>Supabase: {envStatus.service ? "✓" : "✗"}</li>
            </ul>
            <p className="mt-3">
              Gmail: use an <a href="https://support.google.com/accounts/answer/185833" className="text-[var(--admin-gold)] underline" target="_blank" rel="noreferrer">App Password</a>, host <code>smtp.gmail.com</code>, port <code>587</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
