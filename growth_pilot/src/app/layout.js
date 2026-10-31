import { Metadata, Viewport } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./providers";
import SmoothScrolling from "./components/SmoothScrolling";
import MobileMenu from "./components/MobileMenu";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://myshop.com";

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
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthPilot — Generate Leads & Grow Your Business",
    description:
      "Data-driven marketing that turns visitors into qualified leads and customers.",
    images: ["/og/default.png"],
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
    <html lang="en" className={`${workSans.variable} antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-solid-chubby/css/uicons-solid-chubby.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-bold-rounded/css/uicons-bold-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-solid-straight/css/uicons-solid-straight.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-solid-straight/css/uicons-solid-straight.css"
        ></link>
      </head>
      <body className="min-h-screen flex flex-col container mx-auto overflow-hidden bg-white text-black dark:bg-black dark:text-white relative">
        <Providers>
          <Navbar />
          <MobileMenu />
          <SmoothScrolling>{children}</SmoothScrolling>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
