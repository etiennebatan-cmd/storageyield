"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

function safeNextUrl(fallback: string) {
  if (typeof window === "undefined") return fallback;
  const next = new URL(window.location.href).searchParams.get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}

async function parseApiError(response: Response) {
  const body = await response.json().catch(() => ({}));
  return typeof body.error === "string" ? body.error : "Request failed";
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const error = new URL(window.location.href).searchParams.get("error");
    if (error) setMessage(error);
  }, []);

  return (
    <form
      className="space-y-3 rounded border bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");
        try {
          const supabase = supabaseBrowser();
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            setMessage(error.message);
            return;
          }

          const res = await fetch("/api/auth/after-login", { method: "POST" });
          if (!res.ok) {
            setMessage(await parseApiError(res));
            return;
          }
          const data = (await res.json()) as { onboarding_required?: boolean; redirect_to?: string };
          const target = data.onboarding_required ? "/onboarding" : safeNextUrl(data.redirect_to ?? "/app/decisions");
          router.refresh();
          router.replace(target);
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Login failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-slate-900 py-2 text-white disabled:opacity-60" disabled={submitting} type="submit">
        {submitting ? "Signing in..." : "Sign in"}
      </button>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </form>
  );
}

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  return (
    <form
      className="space-y-3 rounded border bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");
        try {
          const supabase = supabaseBrowser();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name },
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          });
          if (error) {
            setMessage(error.message);
            return;
          }

          if (data.session) {
            const res = await fetch("/api/users/me", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ full_name: name })
            });
            if (!res.ok) {
              setMessage(await parseApiError(res));
              return;
            }
            router.refresh();
            router.replace("/onboarding");
            return;
          }

          setMessage("Account created. Check your email to confirm your account.");
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Signup failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <input className="w-full rounded border p-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-slate-900 py-2 text-white disabled:opacity-60" disabled={submitting} type="submit">
        {submitting ? "Creating account..." : "Create account"}
      </button>
      {message ? <p className={`text-sm ${message.startsWith("Account created") ? "text-emerald-700" : "text-red-600"}`}>{message}</p> : null}
    </form>
  );
}
