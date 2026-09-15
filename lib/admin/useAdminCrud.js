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

        if (fullReload) {
          window.location.reload();
          return true;
        }

        startTransition(() => {
          router.refresh();
        });
        return true;
      } catch (err) {
        setError(formatActionError(err));
        return false;
      } finally {
        setBusy(false);
      }
    },
    [router, clearFeedback],
  );

  return { busy, message, error, setMessage, setError, clearFeedback, run };
}
