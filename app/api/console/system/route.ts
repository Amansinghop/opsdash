import { NextResponse } from "next/server"
import { generateConsoleLogs } from "@/lib/data-generators"

export async function GET() {
  const pythonUrl = process.env.PYTHON_BACKEND_URL
  if (pythonUrl) {
    const res = await fetch(`${pythonUrl}/api/console/system`)
    const data = await res.json()
    return NextResponse.json(data)
  }
  return NextResponse.json(generateConsoleLogs(50, "system"))
}
