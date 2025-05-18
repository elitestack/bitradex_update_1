"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, FileCheck, History, Home, LogOut, Settings, Users, Wallet } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "KYC Verifications",
    href: "/admin/kyc-verifications",
    icon: FileCheck,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: History,
  },
  {
    title: "Deposits",
    href: "/admin/deposits",
    icon: Wallet,
  },
  {
    title: "Withdrawals",
    href: "/admin/withdrawals",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 px-2">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("w-full justify-start", pathname === item.href ? "bg-muted hover:bg-muted" : "")}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Button>
        </Link>
      ))}
      <Link href="/login">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </Link>
    </nav>
  )
}
