import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "StorageYield",
  description: "A live revenue control room for independent self-storage operators.",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1800px] items-center justify-between px-5 py-4 xl:px-8">
            <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">StorageYield</Link>
            <nav className="flex items-center gap-5 text-sm font-semibold text-slate-700">
              <Link className="transition hover:text-slate-950" href="/demo">View demo</Link>
              <Link className="transition hover:text-slate-950" href="/signup">Create account</Link>
              <Link className="transition hover:text-slate-950" href="/login">Login</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
