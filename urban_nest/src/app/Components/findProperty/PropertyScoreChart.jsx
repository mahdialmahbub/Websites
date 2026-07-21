// components/PropertyScoreChart.jsx
"use client";

import Button from "../Button";

// Semi-circular gauge built with plain SVG (no chart library needed).
function ScoreGauge({ score }) {
  const radius = 80;
  const stroke = 14;
  const normalized = Math.max(0, Math.min(100, score));
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="220" height="130" viewBox="0 0 220 130">
        {/* track */}
        <path
          d="M 30 110 A 80 80 0 0 1 190 110"
          fill="none"
          stroke="#153257"
          strokeWidth={stroke}
        />
        {/* progress */}
        <path
          d="M 30 110 A 80 80 0 0 1 190 110"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />

        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2F8CFF" />
            <stop offset="25%" stopColor="#2ECC71" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute bottom-3 flex flex-col items-center">
        <span className="text-[32px] font-semibold text-background">
          {normalized}%
        </span>
        <div className="p-space-1 flex gap-space-1 bg-primary-10/10 text-[#2F8CFF] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)]">
          <i className="fi fi-ss-sparkles flex items-center justify-center text-[8px]"></i>
          <p className="text-[8px] font-semibold">AI Recomended</p>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color, icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-space-1"><i className={`${icon} flex items-center justify-center text-[12px] text-white`}></i>
      <span className="w-18 shrink-0 text-slate-300 text-[12px]">{label}</span></div>
      
      <div className="h-2 flex-1 bg-slate-800 overflow-hidden">
        <div
          className="h-full"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span className="w-8 text-right text-md text-slate-400 font-semibold" style={{
        color: color
      }}>{value}%</span>
    </div>
  );
}

export default function PropertyScoreChart({ property }) {
  if (!property) {
    return (
      <div className="w-full max-w-xs rounded-2xl bg-[#0F1B2D] p-6 text-center text-slate-400">
        একটি প্রপার্টি সিলেক্ট করুন স্কোর দেখার জন্য
      </div>
    );
  }

  return (
    <div className="w-full max-w-100 bg-[#0F1B2D] p-6 shadow-[inset_3px_3px_20px_rgba(255,255,255,0.10),inset_-7px_-8px_10px_rgba(0,0,0,0.25)]">
      <h3 className=" text-sm font-medium text-placeholder">
        Selected Property Score
      </h3>

      <ScoreGauge score={property.overallScore} />

      <div className="mt-space-6 space-y-space-5 ">
        {property.scores.map((s) => (
          <ScoreBar
            key={s.label}
            label={s.label}
            value={s.value}
            color={s.color}
            icon={s.icon}
          />
        ))}
      </div>

    </div>
  );
}
