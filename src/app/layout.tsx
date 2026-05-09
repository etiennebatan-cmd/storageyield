import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "StorageYield | Self-storage software voor Benelux-operators",
    template: "%s"
  },
  description: "Benelux-native operating system voor self-storage, garagebox, containeropslag en hybride opslagoperators.",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
