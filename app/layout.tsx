"use client";
import { Providers } from "./providers";
import { PostModal } from "@/components/posts/PostModal";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            {children}
          </main>
          <PostModal />
        </Providers>
      </body>
    </html>
  );
}
