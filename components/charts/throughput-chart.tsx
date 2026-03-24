"use client"

import useSWR from "swr"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ArrowUpDown } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const chartConfig = {
  outbound: {
    label: "Outbound",
    color: "oklch(0.65 0.2 250)",
  },
  inbound: {
    label: "Inbound",
    color: "oklch(0.6 0.22 330)",
  },
}

export function ThroughputChart() {
  const { data, isLoading } = useSWR("/api/analytics/throughput", fetcher, {
    refreshInterval: 5000,
  })

  const chartData = data || []
  const totalOut = chartData.reduce((acc: number, d: Record<string, number>) => acc + (d.outbound || 0), 0)
  const totalIn = chartData.reduce((acc: number, d: Record<string, number>) => acc + (d.inbound || 0), 0)

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Data Transfer</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.outbound.color }} />
            <span className="text-muted-foreground">Out</span>
            <span className="font-mono font-semibold text-foreground">{(totalOut / 1024).toFixed(1)}GB</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.inbound.color }} />
            <span className="text-muted-foreground">In</span>
            <span className="font-mono font-semibold text-foreground">{(totalIn / 1024).toFixed(1)}GB</span>
          </span>
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
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="outGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartConfig.outbound.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={chartConfig.outbound.color} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="inGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartConfig.inbound.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={chartConfig.inbound.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(v) => `${v}MB`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="outbound"
                  stroke={chartConfig.outbound.color}
                  fill="url(#outGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="inbound"
                  stroke={chartConfig.inbound.color}
                  fill="url(#inGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}
