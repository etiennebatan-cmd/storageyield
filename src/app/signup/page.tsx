import { SignupForm } from "@/components/app/auth-forms";

export default function SignupPage() {
  return (
    <main className="container-page max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <SignupForm />
    </main>
  );
}
