import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest() {
  return {
    id: "/",
    name: `${SITE_NAME} - Free ATS-Friendly Resume Builder`,
    short_name: SITE_NAME, // home screen e icon er niche dekhabe (12 character er moddhe rakhle bhalo)
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFFDFC",
    theme_color: "#6D65E9", // layout er viewport.themeColor er shathe mil rakha
    lang: "en",
    categories: ["productivity", "business"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // Optional: app icon e long-press korle shortcut dekhabe
    shortcuts: [
      { name: "Home", url: "/" },
      { name: "My Resume", url: "/my-resume" },
      { name: "Create Resume", url: "/create-resume" },
      { name: "Browse Templates", url: "/templates" },
    ],
  };
}
