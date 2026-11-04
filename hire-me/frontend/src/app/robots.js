import { absoluteUrl } from "@/lib/site";

// Production hole tobei crawl allowed. Staging / preview e puro site bondho.
// NEXT_PUBLIC_* build er shomoy bhitore boshe jay, tai `npm run build` er AGE set korte hobe.
const IS_PROD = process.env.NEXT_PUBLIC_ENV === "production";

// Private pages are kept out of search. Shared resume pages (/r/...) are NOT blocked here on purpose:
// they carry a "noindex" tag, and a crawler can only obey it when it is allowed to open the page.
const PRIVATE_PATHS = [
  "/api/",
  "/builder",
  "/my-resume",
  "/create-resume",
  "/profile",
  "/login",
  "/sign-up",
  "/email-verify",
  "/forgot-password",
  "/password-reset-otp",
  "/reset-password",
];

export default function robots() {
  // Staging / preview: puro site bondho. (return ta function er VITORE thakte hobe)
  if (!IS_PROD) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE_PATHS,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
