"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isTheme, THEME_COOKIE } from "../lib/theme";

export async function setTheme(formData) {
  const theme = formData.get("theme");
  if (!isTheme(theme)) return;

  const store = await cookies();

  if (theme === "system") {
    store.delete(THEME_COOKIE); // device-er default e ferot
  } else {
    store.set(THEME_COOKIE, theme, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 bochor
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  revalidatePath("/", "layout");
}