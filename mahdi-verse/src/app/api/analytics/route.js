export async function POST(request) {
  try {
    const metric = await request.json()

    // Temporary testing
    console.log('Web Vital:', metric)

    return Response.json({ success: true })
  } catch {
    return Response.json(
      { error: 'Invalid analytics data' },
      { status: 400 }
    )
  }
}