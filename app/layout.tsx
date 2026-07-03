import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Memory Museum",
    template: "%s | Memory Museum",
  },
  description:
    "An immersive digital museum where you walk through the most meaningful moments of your life.",
  keywords: ["memory", "museum", "memories", "3D", "personal", "gallery"],
  authors: [{ name: "Memory Museum" }],
  openGraph: {
    title: "Memory Museum",
    description: "Walk through the most meaningful moments of your life.",
    type: "website",
    siteName: "Memory Museum",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Museum",
    description: "Walk through the most meaningful moments of your life.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
        <body className="bg-museum-obsidian text-museum-marble antialiased">
          <QueryProvider>
            <LenisProvider>{children}</LenisProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
