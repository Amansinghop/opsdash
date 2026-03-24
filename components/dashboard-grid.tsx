"use client"

import { ConsolePanel } from "@/components/console-panel"
import { CpuMemoryChart } from "@/components/charts/cpu-memory-chart"
import { RequestsChart } from "@/components/charts/requests-chart"
import { LatencyChart } from "@/components/charts/latency-chart"
import { ThroughputChart } from "@/components/charts/throughput-chart"
import { ErrorDistributionChart } from "@/components/charts/error-distribution-chart"

export function DashboardGrid() {
  return (
    <div className="flex flex-col gap-6">
      {/* Section: Analytics Charts (5 canvases) */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Analytics
          </h2>
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">Last 24 hours</span>
        </div>

        {/* Top row: 3 charts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CpuMemoryChart />
          <RequestsChart />
          <LatencyChart />
        </div>

        {/* Bottom row: 2 charts */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ThroughputChart />
          <ErrorDistributionChart />
        </div>
      </section>

      {/* Section: Console Panels (2 canvases) */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Console
          </h2>
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">Live stream</span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ConsolePanel title="System Logs" endpoint="/api/console/system" />
          <ConsolePanel title="Application Logs" endpoint="/api/console/application" />
        </div>
      </section>
    </div>
  )
}
