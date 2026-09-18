import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

/**
 * Refreshes the Supabase auth session cookie on every request.
 *
 * Server Components can read cookies but can't write them, so if a user's
 * access token expires while they're only navigating between pages (no
 * Server Action / Route Handler in between to persist a refreshed cookie),
 * the refreshed token from `getUser()` inside `createClient()` would be
 * silently dropped on every request. Running this in `proxy.ts` (Next's
 * middleware-equivalent, see AGENTS.md) means it runs before every request
 * and can actually persist the refreshed cookie on the response.
 *
 * This does NOT perform authorization — it only keeps "who is the user"
 * (the session) fresh. "What they're allowed to do" is still decided by
 * requireAdminRole()/RLS on each page and action, per this project's rule:
 * autenticação determina quem é o usuário; autorização determina o que ele
 * pode fazer.
 */
export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // IMPORTANT: don't add logic between createServerClient and getUser() —
  // that would risk the session appearing to randomly log users out.
  await supabase.auth.getUser();

  return response;
}
