import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "memory-museum-media";

/**
 * Client-safe Supabase instance (anon key). Used in browser components
 * for things like reading public/signed URLs. Never use this for writes
 * that require elevated privileges.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

let adminClient: SupabaseClient | null = null;

/**
 * Server-only Supabase instance using the service role key.
 * Never import this from a client component.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdminClient must not be called from the browser");
  }
  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

/**
 * Generates a time-limited signed upload URL for a user-scoped storage path.
 * Storage paths are namespaced by userId so RLS-equivalent isolation holds
 * even though we're using the service role for the actual write.
 */
export async function createSignedUploadUrl(
  userId: string,
  fileName: string
): Promise<{ path: string; signedUrl: string; token: string }> {
  const supabase = getSupabaseAdminClient();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error(`Failed to create signed upload URL: ${error?.message}`);
  }

  return { path, signedUrl: data.signedUrl, token: data.token };
}

export function getPublicMediaUrl(path: string): string {
  const supabase = getSupabaseBrowserClient();
  const { data } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
