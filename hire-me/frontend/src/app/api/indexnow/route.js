// src/app/api/indexnow/route.js
import { timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/site";

// node:crypto lagbe, tai Node runtime
export const runtime = "nodejs";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10000; // IndexNow er per-request limit
const TIMEOUT_MS = 10_000;

// SITE_URL e trailing slash thakleo keyLocation e double slash hobe na
const { host: HOST, origin: ORIGIN } = new URL(SITE_URL);

const json = (body, status = 200) => Response.json(body, { status });

function isAuthorized(secret) {
  const expectedSecret = process.env.INDEXNOW_SECRET;
  // Env na thakle ba secret string na hole kokhono authorize hobe na
  if (!expectedSecret || typeof secret !== "string") return false;

  const received = Buffer.from(secret);
  const expected = Buffer.from(expectedSecret);
  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}

export async function POST(req) {
  // Body invalid/empty hole crash na kore 401 / 400 dibe
  const body = await req.json().catch(() => null);

  // Shudhu tomar nijer backend ei route call korte parbe
  if (!isAuthorized(body?.secret)) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }

  // Staging / local theke kokhono search engine ke URL pathabo na
  if (process.env.NEXT_PUBLIC_ENV !== "production") {
    return json({ ok: false, error: "IndexNow only runs in production" }, 400);
  }

  const key = process.env.INDEXNOW_KEY; // public/{KEY}.txt e same key thakte hobe
  if (!key) {
    return json({ ok: false, error: "INDEXNOW_KEY is missing" }, 500);
  }

  // Duplicate bad, ar shudhu nijer site er valid URL rakho
  const urlList = [
    ...new Set(
      (Array.isArray(body.urls) ? body.urls : []).filter(
        (u) => typeof u === "string",
      ),
    ),
  ].filter((url) => {
    try {
      return new URL(url).host === HOST;
    } catch {
      return false;
    }
  });

  if (urlList.length === 0) {
    return json({ ok: false, error: "No valid URLs for this host" }, 400);
  }

  // 10k er beshi hole batch kore pathano
  let submitted = 0;
  let lastStatus = 200;

  for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
    const batch = urlList.slice(i, i + BATCH_SIZE);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        body: JSON.stringify({
          host: HOST,
          key,
          keyLocation: `${ORIGIN}/${key}.txt`,
          urlList: batch,
        }),
      });

      lastStatus = res.status;

      if (!res.ok) {
        return json(
          {
            ok: false,
            error: "IndexNow rejected the request",
            status: res.status,
            submitted,
          },
          502,
        );
      }

      submitted += batch.length;
    } catch {
      return json(
        { ok: false, error: "IndexNow request failed", submitted },
        502,
      );
    }
  }

  return json({ ok: true, status: lastStatus, submitted });
}
