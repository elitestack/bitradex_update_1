import type React from "react"
import { Bitcoin } from "lucide-react"
import Link from "next/link"

import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col dark">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Bitcoin className="h-6 w-6 text-bitradex-orange" />
          <span>BitRadex</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 py-4">
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
              <p className="text-sm text-muted-foreground">Manage your crypto investments</p>
            </div>
            <div className="flex-1">
              <DashboardNav />
            </div>
          </div>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
      </div>
    </div>
  )
}
