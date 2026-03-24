import { NextResponse } from "next/server"
import { generateThroughputData } from "@/lib/data-generators"

export async function GET() {
  const pythonUrl = process.env.PYTHON_BACKEND_URL
  if (pythonUrl) {
    const res = await fetch(`${pythonUrl}/api/analytics/throughput`)
    const data = await res.json()
    return NextResponse.json(data)
  }
  return NextResponse.json(generateThroughputData())
}
