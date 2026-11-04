// app/api/revalidate/route.js
import { revalidatePath } from "next/cache";

export async function POST(req) {
  const { secret, slug } = await req.json();

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ ok: false }, { status: 401 });
  }

  if (slug) revalidatePath(`/templates/${slug}`); // oi template page notun kore toiri
  revalidatePath("/templates"); // listing page
  revalidatePath("/sitemap.xml");

  return Response.json({ revalidated: true });
}