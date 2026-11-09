import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NavBar from "./Components/navbar/NavBar";
import Footer from "./Components/footer/Footer";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import SmoothScrollProvider from "./Components/SmoothScrollProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(BASE), // relative → absolute
  title: {
    default: "UrbanNest — Find Your Perfect Space",
    template: "%s | UrbanNest", // brand suffix for child pages
  },
  description:
    "UrbanNest helps you search, compare and buy properties that match your budget, location and lifestyle. Find apartments, houses and more, all in one place.",
  keywords: [
    "property search",
    "buy property",
    "real estate",
    "apartments for sale",
    "houses for sale",
    "find your perfect space",
    "UrbanNest",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "UrbanNest",
    locale: "en_US",
    url: "/",
    title: "UrbanNest — Find Your Perfect Space",
    description:
      "Search properties your way and buy your perfect space with confidence.",
    images: [{ url: "/defaultOG.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UrbanNest — Find Your Perfect Space",
    description:
      "Search properties your way and buy your perfect space with confidence.",
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased mx-auto`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://cdn-uicons.flaticon.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-regular-straight/css/uicons-regular-straight.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-regular-straight/css/uicons-regular-straight.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-bold-straight/css/uicons-bold-straight.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-brands/css/uicons-brands.css"
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
      <body className="min-h-full flex flex-col relative ">
        <Toaster position="top-center" />
        {/* Toast */}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          limit={5}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />

        <NavBar />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Footer />
      </body>
    </html>
  );
}
