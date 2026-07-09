import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { QuickContact } from "@/components/quick-contact";
import { getLocale } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "Pro-Fitness Sports Nutrition",
    template: "%s | Pro-Fitness",
  },
  description:
    "Catalog san pham Pro-Fitness Sports Nutrition: gia ban, huong vi, cong dung, cach su dung va lien he tu van.",
  metadataBase: new URL("https://profitness-preview.vercel.app"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <QuickContact locale={locale} />
      </body>
    </html>
  );
}
