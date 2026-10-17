"use client";
import { useEffect } from "react";

export default function ScrollToDetails({ targetId }) {
  useEffect(() => {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [targetId]);
  return null;
}