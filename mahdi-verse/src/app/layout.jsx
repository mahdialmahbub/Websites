import { Sora, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar/Navbar";
import HomePageChecker from "./components/HomePageChecker";
import { Toaster } from "react-hot-toast";
import { THEME_COOKIE } from "../lib/theme";
import { SITE_URL } from "@/src/app/utils/buildMetadata";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { WebVitals } from "../lib/web-vitals";
import { ErrorPageProvider } from "./components/ErrorPageContext";
import { GoogleAnalytics } from "@next/third-parties/google";

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
  "Mahdi | UI UX Designer, MERN & Next.js Developer for Fast Websites";
const DESCRIPTION =
  "Hi, I’m Mahdi, a UI UX Designer, MERN & Next.js Developer. I build fast, accessible, SEO-friendly websites that follow best practices and bring you more leads.";

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
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        ></link>
      </head>
      <body className="h-dvh bg-background dark:bg-linear-to-br dark:from-secondary-500/5 dark:to-primary-500/2 w-screen min-w-250 min-h-138.5">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <WebVitals />
        <SpeedInsights />
        <div className="flex h-full gap-6 p-space-4">
          <Sidebar />
          <main id="main-content" className="flex-1 min-w-0 flex flex-col">
            <ErrorPageProvider>
              <Navbar />
              <HomePageChecker>{children}</HomePageChecker>
            </ErrorPageProvider>
          </main>
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
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </html>
  );
}