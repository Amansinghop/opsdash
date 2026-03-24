/**
 * Shared data generation utilities that mirror the Python backend.
 * When PYTHON_BACKEND_URL is set, the API routes proxy to the Python backend.
 * Otherwise, they generate equivalent mock data inline.
 */

export function generateCpuMemoryData(points = 24) {
  const data = []
  const baseCpu = 45
  const baseMemory = 62
  const now = Date.now()

  for (let i = 0; i < points; i++) {
    const ts = new Date(now - (points - i - 1) * 3600000)
    const cpu = Math.max(5, Math.min(100, baseCpu + gaussRandom() * 12 + 10 * Math.sin(i / 4)))
    const memory = Math.max(20, Math.min(95, baseMemory + gaussRandom() * 5 + 3 * Math.sin(i / 6)))
    data.push({
      time: ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      cpu: Math.round(cpu * 10) / 10,
      memory: Math.round(memory * 10) / 10,
    })
  }
  return data
}

export function generateRequestData(points = 24) {
  const data = []
  const now = Date.now()

  for (let i = 0; i < points; i++) {
    const ts = new Date(now - (points - i - 1) * 3600000)
    data.push({
      time: ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      "2xx": randInt(800, 2500),
      "4xx": randInt(10, 80),
      "5xx": randInt(0, 15),
    })
  }
  return data
}

export function generateLatencyData(points = 24) {
  const data = []
  const now = Date.now()

  for (let i = 0; i < points; i++) {
    const ts = new Date(now - (points - i - 1) * 3600000)
    const p50 = Math.max(10, gaussRandom() * 10 + 45)
    const p95 = p50 + Math.abs(gaussRandom() * 20 + 80)
    const p99 = p95 + Math.abs(gaussRandom() * 15 + 50)
    data.push({
      time: ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      p50: Math.round(p50 * 10) / 10,
      p95: Math.round(p95 * 10) / 10,
      p99: Math.round(p99 * 10) / 10,
    })
  }
  return data
}

export function generateThroughputData(points = 24) {
  const data = []
  const now = Date.now()

  for (let i = 0; i < points; i++) {
    const ts = new Date(now - (points - i - 1) * 3600000)
    data.push({
      time: ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      inbound: Math.round(Math.max(10, gaussRandom() * 30 + 120) * 10) / 10,
      outbound: Math.round(Math.max(20, gaussRandom() * 60 + 340) * 10) / 10,
    })
  }
  return data
}

export function generateErrorDistribution() {
  return [
    { type: "Timeout", count: randInt(20, 120) },
    { type: "Bad Request", count: randInt(40, 200) },
    { type: "Not Found", count: randInt(30, 150) },
    { type: "Server Error", count: randInt(5, 50) },
    { type: "Auth Failed", count: randInt(10, 80) },
    { type: "Rate Limited", count: randInt(15, 90) },
  ]
}

const systemMessages = [
  "Service health check completed successfully",
  "Database connection pool refreshed (active: {n} / max: 20)",
  "Cache hit ratio: {pct}% over last 5 minutes",
  "Worker thread #{n} processing queue backlog",
  "SSL certificate renewal scheduled for next week",
  "Memory usage at {pct}% - within normal range",
  "Scheduled backup initiated for database cluster",
  "API rate limiter reset for all client tokens",
  "Load balancer routing update applied",
  "Container orchestrator scaled to {n} replicas",
  "DNS resolution latency: {ms}ms (avg last 1m)",
  "Garbage collection completed in {ms}ms",
  "Config reload triggered by environment change",
  "Outbound webhook delivery confirmed ({n} pending)",
  "Filesystem inode usage: {pct}%",
]

const appMessages = [
  "Request processed: POST /api/data ({ms}ms)",
  "User session created: uid_{hex}",
  "Payment webhook received: evt_{hex}",
  "Background job completed: job_{n} ({ms}ms)",
  "Email delivery queued: {n} recipients",
  "File upload completed: {n}MB processed",
  "Search index updated: {n} documents",
  "WebSocket connection established: conn_{hex}",
  "Batch processing: {n}/{total} records complete",
  "Authentication token refreshed for client_{hex}",
  "GraphQL query resolved in {ms}ms",
  "Image processing pipeline: {n} thumbnails generated",
  "Cron job executed: cleanup_stale_sessions",
  "Feature flag evaluated: dark_mode = enabled",
  "Audit log entry created: action=user.update",
]

const warnMessages = [
  "High memory usage detected: {pct}% threshold exceeded",
  "Slow query detected: {ms}ms on table 'events'",
  "Connection pool nearing capacity: {n}/20 active",
  "Retry attempt {n}/3 for external API call",
  "Deprecated API endpoint accessed: /v1/legacy",
  "Disk usage warning: {pct}% on /data volume",
]

const errorMessages = [
  "Failed to connect to upstream service: timeout after {ms}ms",
  "Unhandled exception in worker thread #{n}",
  "Database query failed: deadlock detected on row lock",
  "Memory allocation failed: OOM condition in container",
  "TLS handshake failed with peer: certificate expired",
  "Circuit breaker tripped for payment-service",
]

export function generateConsoleLogs(count = 50, source: "system" | "application" = "system") {
  const levels = ["INFO", "WARN", "ERROR", "DEBUG"]
  const weights = [60, 20, 10, 10]
  const logs = []
  const now = Date.now()
  const srcMessages = source === "application" ? appMessages : systemMessages

  for (let i = 0; i < count; i++) {
    const ts = new Date(now - randInt(0, 3600) * 1000)
    const level = weightedChoice(levels, weights)

    let msg: string
    if (level === "WARN") {
      msg = warnMessages[randInt(0, warnMessages.length - 1)]
    } else if (level === "ERROR") {
      msg = errorMessages[randInt(0, errorMessages.length - 1)]
    } else {
      msg = srcMessages[randInt(0, srcMessages.length - 1)]
    }

    msg = msg
      .replace("{n}", String(randInt(1, 100)))
      .replace("{pct}", String(randInt(30, 95)))
      .replace("{ms}", String(randInt(5, 2000)))
      .replace("{hex}", randInt(0, 0xffffff).toString(16).padStart(6, "0"))
      .replace("{total}", String(randInt(100, 5000)))

    logs.push({
      timestamp: ts.toISOString().replace("T", " ").substring(0, 19),
      level,
      message: msg,
      source,
    })
  }

  logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  return logs
}

function gaussRandom(): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function weightedChoice<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}
