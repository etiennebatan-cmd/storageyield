import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function safelySetCookie(name: string, value: string, options: Record<string, unknown>) {
  try {
    cookies().set({ name, value, ...(options as object) });
  } catch {
    // Server Components cannot mutate cookies during render. Route handlers/server actions can.
  }
}

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          safelySetCookie(name, value, options);
        },
        remove(name: string, options: Record<string, unknown>) {
          safelySetCookie(name, "", options);
        }
      }
    }
  );
}
