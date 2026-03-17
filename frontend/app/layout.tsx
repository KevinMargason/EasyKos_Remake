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
  title: "EasyKos - Modern Boarding House Management",
  description:
    "Manage your boarding house (kos) with ease - room management, tenant tracking, payment processing, and gamification features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      {/* Anti-FOUC: apply stored theme before paint */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var o=localStorage.getItem('ek-theme-override');var isDark=o?o==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',isDark);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {/* Bungkus children dengan Providers */}
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
