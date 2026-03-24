"use client"

import useSWR from "swr"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Activity } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const chartConfig = {
  "2xx": {
    label: "2xx Success",
    color: "oklch(0.7 0.18 160)",
  },
  "4xx": {
    label: "4xx Client",
    color: "oklch(0.75 0.2 60)",
  },
  "5xx": {
    label: "5xx Server",
    color: "oklch(0.55 0.22 27)",
  },
}

export function RequestsChart() {
  const { data, isLoading } = useSWR("/api/analytics/requests", fetcher, {
    refreshInterval: 5000,
  })

  const chartData = data || []
  const totalRequests = chartData.reduce(
    (acc: number, d: Record<string, number>) => acc + (d["2xx"] || 0) + (d["4xx"] || 0) + (d["5xx"] || 0),
    0
  )

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Requests</h3>
          <span className="font-mono text-xs text-muted-foreground">
            {(totalRequests / 1000).toFixed(1)}K total
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {(["2xx", "4xx", "5xx"] as const).map((key) => (
            <span key={key} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: chartConfig[key].color }}
              />
              <span className="text-muted-foreground">{key}</span>
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
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="2xx" fill={chartConfig["2xx"].color} radius={[2, 2, 0, 0]} stackId="stack" />
                <Bar dataKey="4xx" fill={chartConfig["4xx"].color} radius={[0, 0, 0, 0]} stackId="stack" />
                <Bar dataKey="5xx" fill={chartConfig["5xx"].color} radius={[2, 2, 0, 0]} stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}
