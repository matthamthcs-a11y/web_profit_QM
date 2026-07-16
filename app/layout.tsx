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
    "Catalog sản phẩm Pro-Fitness Sports Nutrition: giá bán, hương vị, công dụng, cách sử dụng và liên hệ tư vấn.",
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
