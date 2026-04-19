import { supabaseClient } from "./supabase";

export async function adminFetch(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    },
  });
}
