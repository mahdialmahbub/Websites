"use client";

import { useEffect, useState } from "react";

export default function useActiveSection(ids, offset = 120) {
  const [active, setActive] = useState("");
  const key = ids.join("|");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) {
      setActive("");
      return;
    }

    const onScroll = () => {
      let current = sections[0].id;

      for (const s of sections) {
        if (s.getBoundingClientRect().top <= offset) current = s.id;
      }

      // page er ekdom niche gele last section active
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1].id;

      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, offset]);

  return active;
}
