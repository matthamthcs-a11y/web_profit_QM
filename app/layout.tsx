import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { QuickContact } from "@/components/quick-contact";
import { MiniCartDrawer } from "@/components/mini-cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { getLocale } from "@/lib/i18n";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-site",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
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
  const htmlLang = locale === "en" ? "en-US" : "vi-VN";

  return (
    <html lang={htmlLang}>
      <body className={robotoCondensed.variable}>
        <CartProvider>
          <Header />
        <main>{children}</main>
        <Footer />
        <QuickContact locale={locale} />
          <MiniCartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
