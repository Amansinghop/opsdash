import { getCurrentUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardGrid } from "@/components/dashboard-grid"

export const metadata = {
  title: "Dashboard - OpsDash",
  description: "Operations Monitoring Dashboard",
}

export default async function Home() {
  // Ensure user is authenticated
  const user = await getCurrentUser()
  if (!user) {
    // Middleware will redirect to login, but this ensures it
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <DashboardGrid />
      </main>
    </div>
  )
}
