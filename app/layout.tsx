import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Caffeine Survey — Research Study 2025",
  description:
    "A 3-minute survey on caffeine consumption patterns, productivity, sleep, and dependency. Join hundreds of participants in this anonymous research study.",
  keywords: ["caffeine", "survey", "coffee", "research", "productivity", "sleep"],
  authors: [{ name: "Caffeine Survey" }],
  openGraph: {
    title: "Caffeine Survey — How does caffeine affect your life?",
    description:
      "Take our 3-minute survey on caffeine habits. Anonymous. Private. Insightful.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
