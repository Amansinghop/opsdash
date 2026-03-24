import { NextResponse } from "next/server"
import { generateLatencyData } from "@/lib/data-generators"

export async function GET() {
  const pythonUrl = process.env.PYTHON_BACKEND_URL
  if (pythonUrl) {
    const res = await fetch(`${pythonUrl}/api/analytics/latency`)
    const data = await res.json()
    return NextResponse.json(data)
  }
  return NextResponse.json(generateLatencyData())
}
