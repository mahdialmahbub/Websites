
'use client'

import { useReportWebVitals } from 'next/web-vitals'

const reportWebVitals = (metric) => {
  const body = JSON.stringify(metric)
  const url = '/api/analytics'

  const payload = new Blob([body], {
    type: 'application/json',
  })

  // Try sendBeacon first; fall back to fetch if needed.
  if (navigator.sendBeacon?.(url, payload)) {
    return
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
  }).catch((error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send Web Vitals:', error)
    }
  })
}

export function WebVitals() {
  useReportWebVitals(reportWebVitals)

  return null
}
