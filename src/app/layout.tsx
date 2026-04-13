import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ramen Don — Birmingham",
  description: "Authentic ramen in the heart of Birmingham. Handcrafted broths, bold flavours. Book your table at Ramen Don.",
  icons: {
    icon: "/images/logo/Ramen_Don_Logo_Cirlce.png",
    apple: "/images/logo/Ramen_Don_Logo_Cirlce.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#1A1714] text-[#F0EBE3]">{children}</body>
    </html>
  );
}
