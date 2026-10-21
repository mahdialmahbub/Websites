// app/api/contact/route.js
import { NextResponse } from "next/server";
import { BUDGET_OPTIONS } from "@/src/lib/budgetOptions";
import clientPromise from "@/src/lib/mongodb";

export const runtime = "nodejs"; // mongodb driver Edge runtime e cholena

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v) => (typeof v === "string" ? v.trim() : "");

const fail = (error, status = 400) =>
  NextResponse.json({ success: false, error }, { status });

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request.");
  }

  // Honeypot: bot fill korle success dekhiye silently ignore kori
  if (clean(body?.website)) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const name = clean(body?.name);
  const email = clean(body?.email).toLowerCase();
  const budget = clean(body?.budget);
  const project = clean(body?.project);

  // Client validation er upor bharosa kora jay na, server e abar check
  if (name.length < 2 || name.length > 100) {
    return fail("Please enter your name (2-100 characters).");
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return fail("Please enter a valid email address.");
  }
  if (!BUDGET_OPTIONS.includes(budget)) {
    return fail("Please select a valid budget.");
  }
  if (project.length < 10 || project.length > 2000) {
    return fail("Project details must be 10-2000 characters.");
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "portfolio");

    await db.collection("Messages").insertOne({
      name,
      email,
      budget,
      project,
      status: "new",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    // Asol error server log e, user ke generic message
    console.error("POST /api/contact failed:", err);
    return fail("Could not save your message. Please try again later.", 500);
  }
}