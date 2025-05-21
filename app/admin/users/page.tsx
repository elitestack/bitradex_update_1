"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PencilIcon, Search, Trash2, UserCog } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  balance: number
  createdAt: string
  kycStatus: 'verified' | 'pending' | 'unverified'
}


export default function AdminUsersPage() {
  
  const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('/api/users')
          if (!response.ok) throw new Error('Failed to fetch users')
          const data = await response.json()
          setUsers(data)
        } catch (err) {
          setError('Failed to load users')
          console.error('Fetch error:', err)
        } finally {
          setLoading(false)
        }
      }
  
      fetchUsers()
    }, [])
  
    // Filter users based on search term and status filter
    const filteredUsers = users.filter((user) => {
      const matchesSearch =
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id.toLowerCase().includes(searchTerm.toLowerCase())
  
      const matchesStatus = statusFilter === "all" || user.kycStatus === statusFilter
  
      return matchesSearch && matchesStatus
    })
  
    if (loading) {
      return <div>Loading users...</div>
    }
  
    if (error) {
      return <div className="text-red-500">{error}</div>
    }
  

  
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-medium">User Management</h3>
        <p className="text-sm text-muted-foreground">View and manage all user accounts</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">All Users</CardTitle>
          <Button className="bg-bitradex-orange hover:bg-bitradex-orange/90">
            <UserCog className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">

{/*  */}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user._id}</TableCell>
                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.kycStatus === "verified"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : user.kycStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {user.kycStatus?.charAt(0).toUpperCase() + user.kycStatus?.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>${user.balance.toFixed(2)}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/users/${user._id}`}>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <PencilIcon className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </Link>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>

                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

{/*  */}

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
