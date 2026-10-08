import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TimeZoneSync } from "@/components/shared/TimeZoneSync";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiceFlow",
  description:
    "Simple customer and job management for small service businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <TimeZoneSync />
        {children}
      </body>
    </html>
  );
}
