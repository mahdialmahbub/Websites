'use client'

import { useEffect, useMemo } from "react";
import Chips from "../Chips";

const WEIGHT_MAP = {
  thin: 100,
  extralight: 200,
  "extra light": 200,
  light: 300,
  regular: 400,
  normal: 400,
  medium: 500,
  semibold: 600,
  "semi bold": 600,
  bold: 700,
  extrabold: 800,
  "extra bold": 800,
  black: 900,
};

const getWeightValue = (label) => WEIGHT_MAP[label.trim().toLowerCase()] ?? 400;

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").join(" ");
const LOWER = "abcdefghijklmnopqrstuvwxyz".split("").join(" ");

export default function TypographyCard({
  fontName = "Roboto",
  usedFor = "Title",
  weights = ["Regular", "Medium", "Semi Bold", "Bold"],
}) {
  // dynamically pull the font from Google Fonts using whatever name + weights are passed in
  const fontHref = useMemo(() => {
    const family = fontName.trim().replace(/\s+/g, "+");
    const weightNums = [...new Set(weights.map(getWeightValue))].sort((a, b) => a - b).join(";");
    return `https://fonts.googleapis.com/css2?family=${family}:wght@${weightNums || 400}&display=swap`;
  }, [fontName, weights]);

  useEffect(() => {
    const id = `gfont-${fontName.trim().replace(/\s+/g, "-").toLowerCase()}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = fontHref;
    document.head.appendChild(link);
  }, [fontHref, fontName]);

  const fontStack = `"${fontName}", sans-serif`;

  return (
    <div className="rounded-[16px] border-2 border-secondary-500 bg-secondary-50 shadow-xl p-space-7 w-full" style={{
      boxShadow: "4px 4px 0px rgba(34, 211, 238, 1)"
    }}>
      {/* Header: font name + where it's used */}
      <div className="flex items-center justify-between gap-4">
        <h2
          style={{ fontFamily: fontStack, fontWeight: 800 }}
          className="text-[48px] tracking-tight leading-none break-all"
        >
          {fontName.toUpperCase()}
        </h2>
        <Chips text={usedFor} />
      </div>

      {/* A-Z / a-z sample in the loaded font */}
      <div style={{ fontFamily: fontStack, fontWeight: 700 }} className="mt-space-4 tracking-wide max-w-[200px]">
        <p className="text-size-xs_2 mb-space-1">{UPPER}</p>
        <p className="text-size-xs_2 ">{LOWER}</p>
      </div>

      {/* Weights, each pill rendered in its own actual weight */}
      <div className="mt-space-9 flex flex-wrap gap-3">
        {weights.map((w) => (
          <span
            key={w}
            style={{ fontFamily: fontStack, fontWeight: getWeightValue(w), boxShadow:
          "1px 1px 2px rgba(255, 255, 255, 0.3), -1px -1px 2px rgba(196, 211, 213, 0.50), inset 1px -1px 2px rgba(196, 211, 213, 0.2), inset -1px 1px 2px rgba(196, 211, 213, 0.2), inset -1px -1px 2px rgba(255, 255, 255, 0.9), inset 1px 1px 3px rgba(196, 211, 213, 0.90)", }}
            className="rounded-full bg-secondary-50 px-5 py-2 text-sm text-teal-700 shadow border border-cyan-100"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
