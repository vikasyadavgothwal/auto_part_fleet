import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language/language-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { getSiteBranding } from "@/lib/site-branding";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getSiteBranding();
  return {
    title: "Fleet ",
    description: "The best way to manage your fleet",
    icons: { icon: branding.faviconUrl || "/favicon.ico" },
  };
}

const isDashboardLanguage = (value: unknown): value is "en" | "ar" =>
  value === "en" || value === "ar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const languageCookie = (await cookies()).get("app_lang")?.value;
  const language = isDashboardLanguage(languageCookie) ? languageCookie : "en";

  return (
    <html
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
