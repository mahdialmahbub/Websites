// lib/stats.js
// Server-side data. Eta client bundle e jabe na.

const ONE_DAY = 60 * 60 * 24; // 86400 seconds

const fallbackStats = [
  { number: 40, suffix: "+", label: "Projects delivered" },
  { number: 5, suffix: "+", label: "Years of experience" },
  { number: 18, suffix: "+", label: "Clients worldwide" },
  { number: 98, suffix: "%", label: "Client satisfaction" },
];

export async function getStats() {
  // Data jodi API / CMS theke ase, tahole ei block ta uncomment koro.
  // fetch er revalidate diye 1 din por por data refresh hobe.
  //
  // try {
  //   const res = await fetch(`${process.env.API_URL}/stats`, {
  //     next: { revalidate: ONE_DAY, tags: ["stats"] },
  //   });
  //   if (res.ok) return await res.json();
  // } catch (error) {
  //   console.error("Failed to fetch stats:", error);
  // }

  return fallbackStats;
}
