import Providers from "@/core/store/Providers";
import ThemeProvider from "@/component/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "EasyKos - Pengelolaan Kos Modern",
  description:
    "Kelola kos dengan mudah - manajemen kamar, pelacakan penyewa, proses pembayaran, dan fitur gamifikasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased">
        <ThemeProvider>
          {/* Bungkus children dengan Providers */}
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
