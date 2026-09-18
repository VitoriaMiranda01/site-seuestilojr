import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/session";

/**
 * Runs before every request (Next 16's renamed `middleware.ts`). Its only
 * job is to keep the Supabase session cookie fresh — see session.ts for
 * why that needs to happen here rather than in a Server Component.
 *
 * This intentionally does NOT gate /admin routes: that's handled by
 * requireAdminRole() in `(protected)/layout.tsx` and every server action,
 * backed by RLS. Proxy would only be able to do an "optimistic" cookie
 * check anyway (no DB access without extra round-trips on every request),
 * and this app's real authorization boundary is deliberately kept close to
 * the data, not here.
 */
export default async function proxy(request: NextRequest) {
  return await updateSupabaseSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
