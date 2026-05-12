import type { Metadata } from "next";
import { SignupForm } from "@/components/app/auth-forms";

export const metadata: Metadata = {
  title: "Create account | StorageYield",
  robots: {
    index: false,
    follow: false
  }
};

export default function SignupPage() {
  return (
    <main className="container-page max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <SignupForm />
    </main>
  );
}
