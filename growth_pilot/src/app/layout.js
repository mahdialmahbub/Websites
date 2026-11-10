import { Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./providers";
import SmoothScrolling from "./components/SmoothScrolling";
import MobileMenu from "./components/MobileMenu";
import "@flaticon/flaticon-uicons/css/regular/rounded.css"; // fi-rr-
import "@flaticon/flaticon-uicons/css/solid/rounded.css"; // fi-sr-
import "@flaticon/flaticon-uicons/css/bold/rounded.css"; // fi-br-

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL(BASE), // relative → absolute
  title: {
    default: "GrowthPilot — Generate Leads & Grow Your Business",
    template: "%s | GrowthPilot", // brand suffix for child pages
  },
  description:
    "GrowthPilot helps businesses attract qualified leads and grow faster with data-driven marketing strategies, campaigns, and sales funnels.",
  keywords: [
    "lead generation",
    "digital marketing",
    "business growth",
    "marketing funnels",
    "growth marketing",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "GrowthPilot",
    locale: "en_US",
    url: "/",
    title: "GrowthPilot — Generate Leads & Grow Your Business",
    description:
      "Data-driven marketing that turns visitors into qualified leads and customers.",
    images: [{ url: "/defaultOG.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthPilot — Generate Leads & Grow Your Business",
    description:
      "Data-driven marketing that turns visitors into qualified leads and customers.",
    images: ["/defaultOG.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b3d91",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${workSans.variable} antialiased`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://cdn-uicons.flaticon.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col container mx-auto overflow-hidden bg-white text-black dark:bg-black dark:text-white relative">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
          >
            Skip to main content
          </a>
          <Navbar />
          <MobileMenu />
          <SmoothScrolling>
            <main id="main-content">{children}</main>
          </SmoothScrolling>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
