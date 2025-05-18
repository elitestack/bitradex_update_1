"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample KYC verification data
const verifications = [
  {
    id: "KYC001",
    userId: "USR001",
    userName: "John Doe",
    email: "john.doe@example.com",
    status: "pending",
    submittedDate: "May 10, 2025",
  },
  {
    id: "KYC002",
    userId: "USR002",
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    status: "approved",
    submittedDate: "May 8, 2025",
    reviewedDate: "May 9, 2025",
  },
  {
    id: "KYC003",
    userId: "USR003",
    userName: "Robert Johnson",
    email: "robert.johnson@example.com",
    status: "rejected",
    submittedDate: "May 5, 2025",
    reviewedDate: "May 6, 2025",
    rejectionReason: "Document expired",
  },
  {
    id: "KYC004",
    userId: "USR004",
    userName: "Emily Davis",
    email: "emily.davis@example.com",
    status: "pending",
    submittedDate: "May 3, 2025",
  },
  {
    id: "KYC005",
    userId: "USR005",
    userName: "Michael Wilson",
    email: "michael.wilson@example.com",
    status: "approved",
    submittedDate: "Apr 28, 2025",
    reviewedDate: "Apr 30, 2025",
  },
]

export default function AdminKYCVerificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter verifications based on search term and status filter
  const filteredVerifications = verifications.filter((verification) => {
    // Search filter
    const matchesSearch =
      verification.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.userId.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || verification.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-medium">KYC Verification Management</h3>
        <p className="text-sm text-muted-foreground">Review and manage user identity verification submissions</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">All Verifications</CardTitle>
          <Badge variant="outline" className="ml-auto mr-4">
            {filteredVerifications.filter((v) => v.status === "pending").length} Pending
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search verifications..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Verification ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVerifications.length > 0 ? (
                    filteredVerifications.map((verification) => (
                      <TableRow key={verification.id}>
                        <TableCell className="font-medium">{verification.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{verification.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{verification.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              verification.status === "approved"
                                ? "bg-green-500/20 text-green-500 hover:bg-green-500/20"
                                : verification.status === "rejected"
                                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/20"
                                  : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20"
                            }`}
                          >
                            {verification.status === "approved"
                              ? "Approved"
                              : verification.status === "rejected"
                                ? "Rejected"
                                : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{verification.submittedDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/kyc-verifications/${verification.id}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                Review
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No verifications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
