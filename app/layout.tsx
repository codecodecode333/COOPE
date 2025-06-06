import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/clerk-react'

import { Toaster } from "sonner";
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from '@/components/providers/modal-provider';
import localFont from 'next/font/local'
import { EdgeStoreProvider } from "@/lib/edgestore";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard"
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "coope",
  description: "The connected workspace where better, faster work happens",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light",
        url: "/logo.png",
        href: "/logo.png",
      },
      {
        media: "(prefers-color-schem: dark",
        url: "/logo-dark.png",
        href: "/logo-dark.png",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${pretendard.variable} font-pretendard font-bold`}
      >
        <ConvexClientProvider>
        <EdgeStoreProvider>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="coope-theme-2"
          >
            <Toaster position="bottom-center" />
            <ModalProvider />
            {children}
          </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}