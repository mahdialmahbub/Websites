import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navBar/Navbar";
import Footer from "./components/footer/Footer";
import StoreProvider from "@/store/StoreProvider";
import BuilderSync from "@/store/builder/BuilderSync";
import PostGenerateFlow from "./components/flow/PostGenerateFlow";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  DEFAULT_KEYWORDS,
} from "@/lib/site";
import { siteSchema } from "@/lib/seo/schema";
import { ConfirmProvider } from "./components/ConfirmProvider";
import { Toaster } from "@/lib/toast";
import SiteChrome from "./components/SiteChome";
import JsonLd from "./components/JsonLd";
import NoScriptNotice from "./components/NoScriptNotice";
import "@flaticon/flaticon-uicons/css/regular/rounded.css";
import "@flaticon/flaticon-uicons/css/solid/rounded.css";
import "@flaticon/flaticon-uicons/css/brands/all.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const TITLE = `${SITE_NAME} - Free ATS-Friendly Resume Builder`;

// Optional: .env e NEXT_PUBLIC_TWITTER_HANDLE=@hireme dile twitter card e site/creator jabe
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE;

export const metadata = {
  // Shob relative URL (OG image, canonical) ei base diye absolute hoy
  metadataBase: new URL(SITE_URL),

  // Child page e shudhu title dile "%s | HireMe" hoye jabe
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,

  keywords: DEFAULT_KEYWORDS,

  applicationName: SITE_NAME,
  authors: [{ name: "Mahdi Al Mahbub", url: "https://mahdi-verse.vercel.app" }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og/default.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Free ATS-friendly Resume Builder`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
    ...(TWITTER_HANDLE && { site: TWITTER_HANDLE, creator: TWITTER_HANDLE }),
  },

  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large", // boro thumbnail er onumoti
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Phone/address/email auto-link bondho (resume preview e text bhenge na jay)
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6D65E9",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${roboto.variable} h-full antialiased scroll-smooth selection:bg-violet-500/20 selection:text-violet-700`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-900 focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <NoScriptNotice />
        {/* Organization + WebSite structured data */}
        <JsonLd data={siteSchema()} />
        <Toaster />
        <StoreProvider>
          {/* Renders nothing: keeps the resume draft in the browser, auto-saves it, claims guest data after login */}
          <BuilderSync />
          {/* Renders only dialogs: benefits of logging in (guests) -> review -> /my-resume or /create-resume */}
          <PostGenerateFlow />
          <SiteChrome navbar={<Navbar />} footer={<Footer />}>
            <ConfirmProvider>
              <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 outline-none"
              >
                {children}
              </main>
            </ConfirmProvider>
          </SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
