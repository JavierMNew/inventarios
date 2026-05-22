import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
);

/**
 * Creates a request-scoped Supabase client for safe SSR.
 * Prevents "session bleeding" between concurrent requests.
 */
export async function getSupabase(cookies: any) {
    const client = createClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_ANON_KEY,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }
    );

    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    if (accessToken && refreshToken) {
        await client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
    }

    return client;
}