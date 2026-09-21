import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { StoreProvider } from "@/lib/redux/provider";
import { Toaster } from "@/components/ui/sonner";
import { AppNav } from "@/components/app-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Task Assistant",
  description: "Streaming chat, document Q&A, and agent task runner built with Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-dvh flex-col">
        <StoreProvider>
          <AppNav />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
