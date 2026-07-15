import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Copperline Roofing Co. — Raise the standard overhead",
  description:
    "Demo website for a fictional roofing company. Craft-grade roofing, honest inspections, written warranties. Built to showcase modern web design for any trade business.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
