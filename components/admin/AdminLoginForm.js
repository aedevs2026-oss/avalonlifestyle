"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { assets } from "@/lib/assets";

export default function AdminLoginForm({ nextPath, errorCode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const configError =
    errorCode === "config"
      ? "Supabase is not configured. Add keys to .env.local (see docs/SUPABASE_ADMIN.md)."
      : errorCode === "forbidden"
        ? "This account is not authorized for admin access."
        : "";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!isSupabaseConfigured()) {
      setError("Supabase environment variables are missing.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      window.location.href = nextPath || "/admin";
    } catch (err) {
      setError(err.message || "Unable to sign in.");
      setLoading(false);
    }
  }

  const setupHint =
    errorCode === "forbidden"
      ? "Your Supabase login works, but this user is not in admin_profiles yet. Run: npm run grant-admin -- your@email.com \"Your Name\""
      : "";

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card admin-card">
        <div className="admin-card-header text-center">
          <Image
            src={assets.brand.logo}
            alt="Avalon Premium Mattress"
            width={140}
            height={42}
            className="mx-auto mb-3"
          />
          <h1>Admin Sign In</h1>
          <p className="mt-2 text-sm text-[var(--admin-muted)]">
            Secure access for catalogue, dealers, and customer enquiries.
          </p>
        </div>
        <form onSubmit={onSubmit} className="admin-card-body space-y-4">
          {(configError || error) && (
            <p className="admin-alert-error">{configError || error}</p>
          )}
          {setupHint ? <p className="admin-alert-info">{setupHint}</p> : null}
          <div>
            <label className="admin-label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              className="admin-input"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              className="admin-input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary w-full">
            {loading ? "Signing in…" : "Enter console"}
          </button>
          <button
            type="button"
            className="w-full text-center text-xs text-[var(--admin-muted)] underline-offset-2 hover:underline"
            onClick={async () => {
              if (!email) {
                setError("Enter your email above, then use forgot password.");
                return;
              }
              if (!isSupabaseConfigured()) return;
              const supabase = createClient();
              const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/login`,
              });
              if (resetError) setError(resetError.message);
              else setResetSent(true);
            }}
          >
            Forgot password?
          </button>
          {resetSent ? (
            <p className="admin-message-ok text-xs">Password reset email sent if the account exists.</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
