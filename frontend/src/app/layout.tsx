// src/app/layout.tsx
import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import ArcAgent from "@/components/ArcAgent";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arc Showcase Hub",
  description: "Discover projects built on the Arc ecosystem",
  icons: {
    icon: "/arc_logo.jpg",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <Providers>
          {children}
          <ArcAgent />
        </Providers>
      </body>
    </html>
  );
}

