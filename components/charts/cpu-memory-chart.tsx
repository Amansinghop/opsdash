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
import { Cpu } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const chartConfig = {
  cpu: {
    label: "CPU %",
    color: "oklch(0.65 0.2 250)",
  },
  memory: {
    label: "Memory %",
    color: "oklch(0.7 0.18 160)",
  },
}

export function CpuMemoryChart() {
  const { data, isLoading } = useSWR("/api/analytics/cpu-memory", fetcher, {
    refreshInterval: 5000,
  })

  const chartData = data || []
  const latestCpu = chartData.length > 0 ? chartData[chartData.length - 1].cpu : 0
  const latestMem = chartData.length > 0 ? chartData[chartData.length - 1].memory : 0

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">CPU & Memory</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.cpu.color }} />
            <span className="text-muted-foreground">CPU</span>
            <span className="font-mono font-semibold text-foreground">{latestCpu}%</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.memory.color }} />
            <span className="text-muted-foreground">Memory</span>
            <span className="font-mono font-semibold text-foreground">{latestMem}%</span>
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
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartConfig.cpu.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={chartConfig.cpu.color} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartConfig.memory.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={chartConfig.memory.color} stopOpacity={0} />
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
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke={chartConfig.cpu.color}
                  fill="url(#cpuGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stroke={chartConfig.memory.color}
                  fill="url(#memGradient)"
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
