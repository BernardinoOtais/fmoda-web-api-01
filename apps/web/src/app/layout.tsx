import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s - Fmoda Indústria Têxtil S.A.",
    absolute: "Fmoda Indústria Têxtil S.A.",
  },
  description: "Web app da Fmoda Indústria Têxtil S.A.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
