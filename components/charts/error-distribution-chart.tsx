"use client"

import useSWR from "swr"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { AlertTriangle } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const barColors = [
  "oklch(0.65 0.2 250)",
  "oklch(0.7 0.18 160)",
  "oklch(0.75 0.2 60)",
  "oklch(0.55 0.22 27)",
  "oklch(0.6 0.22 330)",
  "oklch(0.65 0.22 30)",
]

const chartConfig = {
  count: {
    label: "Count",
    color: "oklch(0.65 0.2 250)",
  },
}

export function ErrorDistributionChart() {
  const { data, isLoading } = useSWR("/api/analytics/errors", fetcher, {
    refreshInterval: 5000,
  })

  const chartData = data || []
  const totalErrors = chartData.reduce(
    (acc: number, d: { count: number }) => acc + d.count,
    0
  )

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">Error Distribution</h3>
          <span className="font-mono text-xs text-muted-foreground">
            {totalErrors} total
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
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="type"
                  tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {chartData.map((_: unknown, index: number) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}
