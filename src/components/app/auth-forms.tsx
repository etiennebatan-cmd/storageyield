"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <form
      className="space-y-3 rounded border bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const supabase = supabaseBrowser();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return setMessage(error.message);
        router.push("/app");
      }}
    >
      <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-slate-900 py-2 text-white" type="submit">Sign in</button>
      {message ? <p className="text-sm">{message}</p> : null}
    </form>
  );
}

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <form
      className="space-y-3 rounded border bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const supabase = supabaseBrowser();
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return setMessage(error.message);
        if (data.user?.id) {
          await fetch("/api/users/upsert", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ id: data.user.id, email, full_name: name })
          });
        }
        setMessage("Account created. Confirm email if required, then log in.");
        router.push("/login");
      }}
    >
      <input className="w-full rounded border p-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-slate-900 py-2 text-white" type="submit">Create account</button>
      {message ? <p className="text-sm">{message}</p> : null}
    </form>
  );
}
