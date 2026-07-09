import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} // ${site.role}`,
    template: `%s :: ${site.name}`,
  },
  description: site.summary,
  metadataBase: new URL("https://example.com"),
};

/* Runs before paint — avoids amber/green flash */
const themeScript = `try{var t=localStorage.getItem('crt-mode');if(t==='amber'){document.documentElement.classList.add('amber')}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <body>
        <Script
          id="crt-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <Nav />
        <main className="min-h-[80vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
