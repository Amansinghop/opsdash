"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, Zap, Clock, Server, LogOut, Settings, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChangePasswordModal } from "@/components/change-password-modal"

interface User {
  id: string
  email: string
  role: "admin" | "user"
  status: "pending" | "approved" | "rejected"
}

export function DashboardHeader() {
  const router = useRouter()
  const [time, setTime] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch user:", error)
      }
    }
    fetchUser()

    // Update time
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    window.location.reload()
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("[v0] Logout failed:", error)
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">OpsDash</h1>
          <p className="text-xs text-muted-foreground">Operations Monitoring Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Server className="h-3.5 w-3.5" />
          <span></span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Connected
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-mono tabular-nums text-foreground">{time}</span>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <div className="h-4 w-px bg-border" />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 transition-colors"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {user?.email?.[0].toUpperCase() || "U"}
            </div>
            <span>{user?.email || "User"}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-border bg-card shadow-lg z-50">
              <div className="border-b border-border px-4 py-2">
                <p className="text-xs font-medium text-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role === "admin" ? "Administrator" : "User"}
                </p>
              </div>

              <div className="py-1">
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setShowPasswordModal(true)
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </header>
  )
}
