import { absoluteUrl } from "@/lib/site";

// Private pages are kept out of search. Shared resume pages (/r/...) are NOT blocked here on purpose:
// they carry a "noindex" tag, and a crawler can only obey it when it is allowed to open the page.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/builder", "/my-resume", "/create-resume", "/profile", "/login", "/sign-up", "/email-verify", "/forgot-password", "/password-reset-otp", "/reset-password"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
