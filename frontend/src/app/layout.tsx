import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VedaAI Exam Generator",
  description: "Generate pixel-perfect exams with AI",
};

import AuthLayout from "@/components/AuthLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthLayout>
          {children}
        </AuthLayout>
      </body>
    </html>
  );
}
