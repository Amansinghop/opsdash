"use client"

import useSWR from "swr"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Clock } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const chartConfig = {
  p50: {
    label: "p50",
    color: "oklch(0.7 0.18 160)",
  },
  p95: {
    label: "p95",
    color: "oklch(0.75 0.2 60)",
  },
  p99: {
    label: "p99",
    color: "oklch(0.55 0.22 27)",
  },
}

export function LatencyChart() {
  const { data, isLoading } = useSWR("/api/analytics/latency", fetcher, {
    refreshInterval: 5000,
  })

  const chartData = data || []
  const latest = chartData.length > 0 ? chartData[chartData.length - 1] : { p50: 0, p95: 0, p99: 0 }

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Response Latency</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {(["p50", "p95", "p99"] as const).map((key) => (
            <span key={key} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: chartConfig[key].color }}
              />
              <span className="text-muted-foreground">{key}</span>
              <span className="font-mono font-semibold text-foreground">{latest[key]}ms</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Loading...
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}ms`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="p50" stroke={chartConfig.p50.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p95" stroke={chartConfig.p95.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p99" stroke={chartConfig.p99.color} strokeWidth={2} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}
