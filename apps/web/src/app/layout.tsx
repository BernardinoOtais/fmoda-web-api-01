import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/components/providers/providers";

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
      <body className={`antialiased`}>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
