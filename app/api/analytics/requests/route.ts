import { NextResponse } from "next/server"
import { generateRequestData } from "@/lib/data-generators"

export async function GET() {
  const pythonUrl = process.env.PYTHON_BACKEND_URL
  if (pythonUrl) {
    const res = await fetch(`${pythonUrl}/api/analytics/requests`)
    const data = await res.json()
    return NextResponse.json(data)
  }
  return NextResponse.json(generateRequestData())
}
