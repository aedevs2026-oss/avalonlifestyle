"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, startTransition } from "react";

export function formatActionError(err) {
  const msg = err?.message || "Action failed.";
  if (msg === "UNAUTHORIZED") {
    return "Your session expired. Please sign in again at /admin/login.";
  }
  if (msg === "SUPABASE_NOT_CONFIGURED") {
    return "Supabase is not configured. Check .env.local and migrations.";
  }
  if (/input stream|networkerror|failed to fetch|load failed/i.test(msg)) {
    return "The server response was interrupted. Your change may still have saved — refresh the page. If this keeps happening, avoid slow VPN and try again.";
  }
  return msg;
}

/**
 * Consistent save/delete/status updates: feedback + refresh.
 *
 * @param {object} [options]
 * @param {boolean} [options.fullReload] - full page reload after success (forms); default soft router.refresh
 */
export function useAdminCrud() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clearFeedback = useCallback(() => {
    setMessage("");
    setError("");
  }, []);

  const run = useCallback(
    async (fn, successMessage, options = {}) => {
      const { fullReload = false } = options;
      clearFeedback();
      setBusy(true);
      try {
        await fn();
        if (successMessage) setMessage(successMessage);

        startTransition(() => {
          router.refresh();
        });

        if (fullReload) {
          // Hard reload after the server-action stream completes (immediate reload causes
          // "Error in input stream" in Firefox / Turbopack).
          setTimeout(() => {
            window.location.reload();
          }, 250);
        }
        return true;
      } catch (err) {
        setError(formatActionError(err));
        return false;
      } finally {
        if (!fullReload) {
          setBusy(false);
        }
      }
    },
    [router, clearFeedback],
  );

  return { busy, message, error, setMessage, setError, clearFeedback, run };
}
