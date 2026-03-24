"use client"

import { useRef, useEffect, useState } from "react"
import useSWR from "swr"
import { Terminal, Search, Pause, Play, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogEntry {
  timestamp: string
  level: string
  message: string
  source: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const levelColors: Record<string, string> = {
  INFO: "text-chart-2",
  WARN: "text-warning",
  ERROR: "text-destructive",
  DEBUG: "text-muted-foreground",
}

const levelBadgeColors: Record<string, string> = {
  INFO: "bg-chart-2/15 text-chart-2",
  WARN: "bg-warning/15 text-warning",
  ERROR: "bg-destructive/15 text-destructive",
  DEBUG: "bg-muted text-muted-foreground",
}

export function ConsolePanel({
  title,
  endpoint,
}: {
  title: string
  endpoint: string
}) {
  const { data, mutate } = useSWR<LogEntry[]>(endpoint, fetcher, {
    refreshInterval: 5000,
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [filter, setFilter] = useState("")
  const [levelFilter, setLevelFilter] = useState<string | null>(null)

  useEffect(() => {
    if (!paused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [data, paused])

  const logs = data || []
  const filtered = logs.filter((log) => {
    const matchText = !filter || log.message.toLowerCase().includes(filter.toLowerCase())
    const matchLevel = !levelFilter || log.level === levelFilter
    return matchText && matchLevel
  })

  const levelCounts = logs.reduce(
    (acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {logs.length} entries
          </span>
        </div>
        <div className="flex items-center gap-1">
          {(["INFO", "WARN", "ERROR"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(levelFilter === level ? null : level)}
              className={cn(
                "rounded px-2 py-0.5 text-xs font-mono transition-colors",
                levelFilter === level
                  ? levelBadgeColors[level]
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {level}
              <span className="ml-1 opacity-60">{levelCounts[level] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <div className="flex flex-1 items-center gap-2 rounded-md bg-secondary/50 px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button
          onClick={() => setPaused(!paused)}
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label={paused ? "Resume auto-scroll" : "Pause auto-scroll"}
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => mutate([])}
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Clear logs"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Log Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-console p-3 font-mono text-xs leading-relaxed"
        style={{ minHeight: 280, maxHeight: 360 }}
      >
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {filter ? "No logs match your filter" : "Waiting for logs..."}
          </div>
        ) : (
          filtered.map((log, i) => (
            <div
              key={`${log.timestamp}-${i}`}
              className="flex gap-3 py-0.5 hover:bg-secondary/20 rounded px-1 -mx-1 transition-colors"
            >
              <span className="shrink-0 text-muted-foreground tabular-nums">
                {log.timestamp.split(" ")[1]}
              </span>
              <span
                className={cn(
                  "shrink-0 w-12 text-right font-semibold",
                  levelColors[log.level] || "text-foreground"
                )}
              >
                {log.level}
              </span>
              <span className="text-console-foreground">{log.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
        <span>
          {filtered.length} / {logs.length} entries
          {filter && ` (filtered: "${filter}")`}
        </span>
        <span className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full", paused ? "bg-warning" : "bg-success")} />
          {paused ? "Paused" : "Live"}
        </span>
      </div>
    </div>
  )
}
