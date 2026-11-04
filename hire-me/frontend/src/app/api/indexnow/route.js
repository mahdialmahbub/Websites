// app/api/indexnow/route.js
import { SITE_URL } from "@/lib/site";

const KEY = process.env.INDEXNOW_KEY; // public/{KEY}.txt file e same key ta likhe rakhte hobe
const HOST = new URL(SITE_URL).host;

export async function POST(req) {
  const { secret, urls } = await req.json();

  // Shudhu tomar nijer backend ei route call korte parbe
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ ok: false }, { status: 401 });
  }

  // Shudhu nijer site er URL submit kora jabe
  const urlList = (Array.isArray(urls) ? urls : []).filter((url) => {
    try {
      return new URL(url).host === HOST;
    } catch {
      return false;
    }
  });

  if (!KEY || urlList.length === 0) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList,
    }),
  });

  return Response.json({ ok: res.ok, status: res.status });
}