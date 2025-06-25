"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
  useTheme,
} from "next-themes";

import { Toaster } from "@/components/ui/sonner";

export function Providers({
  children,
  ...props
}: React.PropsWithChildren<ThemeProviderProps>) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <ToasterProvider />
    </NextThemesProvider>
  );
}

function ToasterProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      richColors
      closeButton
      position="bottom-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
