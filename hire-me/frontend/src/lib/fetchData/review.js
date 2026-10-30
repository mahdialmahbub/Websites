export async function getReviews(limit = 12) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/reviews?limit=${limit}`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.reviews
}