import { Sora, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar/Navbar";
import HomePageChecker from "./components/HomePageChecker";
import { Toaster } from "react-hot-toast";
import { THEME_COOKIE } from "../lib/theme";
import { SITE_URL } from "@/src/app/utils/buildMetadata";
import Script from "next/script";

export const revalidate = 86400; // 60 * 60 * 24

// Runs before first paint: reads the theme cookie and sets data-theme (no flash)
const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(light|dark)/);if(m){document.documentElement.setAttribute('data-theme',m[1])}}catch(e){}})();`;

// Sora and Inter are variable fonts, so no `weight` list is needed:
// one file per font instead of one file per weight
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Replace with your own details
const SITE_NAME = "MahdiVerse";
const DEFAULT_TITLE =
  "MahdiVerse | MERN Developer, UI/UX Designer & SEO Specialist";
const DESCRIPTION =
  "Portfolio of a MERN stack developer and UI/UX designer building fast, SEO-friendly websites with Next.js. Web design, development, and technical SEO services.";

// Optional: search engine ownership meta tags (only rendered when the env var is set)
const verification = {
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  }),
  ...(process.env.BING_SITE_VERIFICATION && {
    other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION },
  }),
};

// Site-wide defaults only. Page-specific values (canonical, openGraph.url, robots)
// come from buildMetadata() in each page
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      { url: "/og/default.png", width: 1200, height: 630, alt: DEFAULT_TITLE },
    ],
  },
  twitter: { card: "summary_large_image" },
  ...(Object.keys(verification).length > 0 && { verification }),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // Match these with your real light and dark background colors (and manifest.js)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} antialiased `}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <link
          rel="preconnect"
          href="https://cdn-uicons.flaticon.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />
      </head>
      <body className="h-dvh bg-background dark:bg-linear-to-br dark:from-secondary-500/5 dark:to-primary-500/2 w-screen min-w-250 min-h-138.5">
        <div className="flex h-full gap-6 p-space-4">
          <Sidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <Navbar />
            <HomePageChecker>{children}</HomePageChecker>
          </div>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={true}
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--color-background, #fff)",
              color: "var(--color-foreground, #000)",
            },
          }}
        />
      </body>
    </html>
  );
}
