import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navBar/Navbar";
import Footer from "./components/footer/Footer";
import StoreProvider from "@/store/StoreProvider";
import BuilderSync from "@/store/builder/BuilderSync";
import PostGenerateFlow from "./components/flow/PostGenerateFlow";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ConfirmProvider } from "./components/ConfirmProvider";
import { Toaster } from "@/lib/toast";
import SiteChrome from "./components/SiteChome";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// metadataBase makes every relative canonical / Open Graph URL absolute. Pages set their own title;
// the template adds the site name after it.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Free ATS-Friendly Resume Builder`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Build a professional, ATS-friendly resume with smart templates and AI-powered guidance. Free to start.",
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${roboto.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-brands/css/uicons-brands.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-solid-chubby/css/uicons-solid-chubby.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-brands/css/uicons-brands.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/4.0.0/uicons-bold-rounded/css/uicons-bold-rounded.css"
        ></link>
      </head>

      <body className="min-h-full flex flex-col">
        <Toaster />
        <StoreProvider>
          {/* Renders nothing: keeps the resume draft in the browser, auto-saves it, claims guest data after login */}
          <BuilderSync />
          {/* Renders only dialogs: benefits of logging in (guests) -> review -> /my-resume or /create-resume */}
          <PostGenerateFlow />
          <SiteChrome navbar={<Navbar />} footer={<Footer />}>
            <ConfirmProvider>{children}</ConfirmProvider>
          </SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
