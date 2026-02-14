import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseMetrics } from '@/lib/prisma'

// Simple metrics store
const metrics = {
  http_requests_total: 0,
  http_request_duration_seconds: [],
  active_users: 0,
  orders_total: 0,
  payments_success_total: 0,
  payments_failed_total: 0,
}

export async function GET(request: NextRequest) {
  try {
    // Get database metrics
    const dbMetrics = await getDatabaseMetrics()
    
    // Update metrics
    if (dbMetrics) {
      metrics.orders_total = dbMetrics.orders
      metrics.active_users = dbMetrics.users
    }

    // Format metrics in Prometheus format
    const prometheusMetrics = `
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${metrics.http_requests_total}

# HELP active_users Number of active users
# TYPE active_users gauge
active_users ${metrics.active_users}

# HELP orders_total Total number of orders
# TYPE orders_total counter
orders_total ${metrics.orders_total}

# HELP payments_success_total Total number of successful payments
# TYPE payments_success_total counter
payments_success_total ${metrics.payments_success_total}

# HELP payments_failed_total Total number of failed payments
# TYPE payments_failed_total counter
payments_failed_total ${metrics.payments_failed_total}

# HELP nodejs_memory_usage_bytes Node.js memory usage
# TYPE nodejs_memory_usage_bytes gauge
nodejs_memory_usage_bytes{type="rss"} ${process.memoryUsage().rss}
nodejs_memory_usage_bytes{type="heapTotal"} ${process.memoryUsage().heapTotal}
nodejs_memory_usage_bytes{type="heapUsed"} ${process.memoryUsage().heapUsed}
nodejs_memory_usage_bytes{type="external"} ${process.memoryUsage().external}

# HELP nodejs_uptime_seconds Node.js uptime in seconds
# TYPE nodejs_uptime_seconds counter
nodejs_uptime_seconds ${process.uptime()}
`.trim()

    return new NextResponse(prometheusMetrics, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    )
  }
}

// Helper functions to update metrics
export function incrementHttpRequests() {
  metrics.http_requests_total++
}

export function recordPaymentSuccess() {
  metrics.payments_success_total++
}

export function recordPaymentFailure() {
  metrics.payments_failed_total++
}