import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swept — Clean Cities. Real Jobs. Total Accountability.",
  description:
    "Swept brings visible, accountable civic cleanup to your city. Citizens report. Crews clean. Cities shine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-swept-dark text-white antialiased">{children}</body>
    </html>
  );
}
