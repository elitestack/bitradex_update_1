"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Bitcoin, Calendar, Coins, Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample transaction data
const transactions = [
  {
    id: "TX123456",
    date: "May 10, 2025",
    type: "deposit",
    amount: 1000,
    currency: "USD",
    status: "completed",
    method: "Bank Transfer",
  },
  {
    id: "TX123457",
    date: "May 8, 2025",
    type: "buy",
    amount: 950,
    currency: "USD",
    status: "completed",
    method: "Bitcoin",
  },
  {
    id: "TX123458",
    date: "May 7, 2025",
    type: "buy",
    amount: 500,
    currency: "USD",
    status: "completed",
    method: "Ethereum",
  },
  {
    id: "TX123459",
    date: "May 4, 2025",
    type: "withdrawal",
    amount: 250,
    currency: "USD",
    status: "completed",
    method: "Bank Transfer",
  },
  {
    id: "TX123460",
    date: "May 1, 2025",
    type: "deposit",
    amount: 2000,
    currency: "USD",
    status: "completed",
    method: "Credit Card",
  },
  {
    id: "TX123461",
    date: "Apr 28, 2025",
    type: "buy",
    amount: 1500,
    currency: "USD",
    status: "completed",
    method: "Bitcoin",
  },
  {
    id: "TX123462",
    date: "Apr 25, 2025",
    type: "sell",
    amount: 300,
    currency: "USD",
    status: "completed",
    method: "Ethereum",
  },
  {
    id: "TX123463",
    date: "Apr 20, 2025",
    type: "withdrawal",
    amount: 1000,
    currency: "USD",
    status: "completed",
    method: "Bitcoin",
  },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchTerm.toLowerCase())

    // Type filter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    // Date filter (simplified for demo)
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "recent" && transaction.date.includes("May")) ||
      (dateFilter === "older" && transaction.date.includes("Apr"))

    return matchesSearch && matchesType && matchesDate
  })

  // Get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUp className="h-4 w-4 text-red-500" />
      case "buy":
        return <Bitcoin className="h-4 w-4 text-primary" />
      case "sell":
        return <Coins className="h-4 w-4 text-primary" />
      default:
        return <Coins className="h-4 w-4" />
    }
  }

  // Get transaction amount with color based on type
  const getTransactionAmount = (transaction: (typeof transactions)[0]) => {
    const isPositive = transaction.type === "deposit" || transaction.type === "sell"
    const prefix = isPositive ? "+" : "-"
    const colorClass = isPositive ? "text-green-500" : "text-red-500"

    return (
      <span className={colorClass}>
        {prefix}${transaction.amount.toFixed(2)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Transaction History</h3>
        <p className="text-sm text-muted-foreground">View and filter your transaction history</p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">All Transactions</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="recent">This Month</SelectItem>
                      <SelectItem value="older">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getTransactionIcon(transaction.type)}
                              <span className="ml-2 capitalize">{transaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{transaction.method}</TableCell>
                          <TableCell className="text-right">{getTransactionAmount(transaction)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
              <CardDescription>Overview of your transaction activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 rounded-full bg-green-500/20 p-1">
                      <ArrowDown className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Total Deposits</span>
                  </div>
                  <span className="font-medium">$3,000.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 rounded-full bg-red-500/20 p-1">
                      <ArrowUp className="h-4 w-4 text-red-500" />
                    </div>
                    <span>Total Withdrawals</span>
                  </div>
                  <span className="font-medium">$1,250.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 rounded-full bg-primary/20 p-1">
                      <Bitcoin className="h-4 w-4 text-primary" />
                    </div>
                    <span>Total Purchases</span>
                  </div>
                  <span className="font-medium">$2,950.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 rounded-full bg-primary/20 p-1">
                      <Coins className="h-4 w-4 text-primary" />
                    </div>
                    <span>Total Sales</span>
                  </div>
                  <span className="font-medium">$300.00</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Net Balance</span>
                  <span>$45,231.89</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Filter by Date Range</CardTitle>
              <CardDescription>Select a custom date range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="start-date" type="date" className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="end-date" type="date" className="pl-8" />
                  </div>
                </div>
                <Button className="w-full">Apply Filter</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
