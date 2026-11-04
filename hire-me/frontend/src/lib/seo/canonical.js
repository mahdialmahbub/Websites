import { SITE_URL } from "@/lib/site";

/**
 * Shobshomoy canonical host, https, lowercase, trailing slash chhara URL dey.
 * Query/hash bad jay, shudhu `keep` e deya param (jemon "page") thake.
 *
 * canonical("/Templates/Modern/?utm_source=x#top") -> https://site.com/templates/modern
 * canonical("/templates?page=2", { keep: ["page"] }) -> https://site.com/templates?page=2
 *
 * Shudhu path dao (absolute URL na).
 */
export function canonical(path = "/", { keep = [] } = {}) {
  const [withoutHash] = path.split("#");
  const [pathname, query = ""] = withoutHash.split("?");

  let clean = pathname.toLowerCase();
  if (!clean.startsWith("/")) clean = `/${clean}`;
  // trailing slash nei, eta-i amader niti (root "/" bade)
  if (clean.length > 1 && clean.endsWith("/")) clean = clean.slice(0, -1);

  const url = new URL(clean, SITE_URL);

  const params = new URLSearchParams(query);
  for (const key of keep) {
    const value = params.get(key);
    if (!value) continue;
    // page=1 holo base URL er-i moto, tai canonical e dewa hoy na
    if (key === "page" && !(Number.parseInt(value, 10) > 1)) continue;
    url.searchParams.set(key, value);
  }

  return url.toString();
}