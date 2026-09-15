import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

/** Supabase Realtime needs a WebSocket in Node versions below 22. */
export const supabaseNodeClientOptions = {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: WebSocket },
};

/**
 * Service-role client for scripts and server-only code (no session persistence).
 */
export function createServiceRoleClient(url, serviceKey, extraOptions = {}) {
  return createClient(url, serviceKey, {
    ...supabaseNodeClientOptions,
    ...extraOptions,
    auth: { ...supabaseNodeClientOptions.auth, ...extraOptions.auth },
    realtime: { ...supabaseNodeClientOptions.realtime, ...extraOptions.realtime },
  });
}
