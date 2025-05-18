"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function UserEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const userId = params.id
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, you would fetch user data based on the ID
  const [userData, setUserData] = useState({
    id: userId,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    status: "active",
    balance: 50.0,
    joinDate: "May 10, 2025",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    // Payment details
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    bitcoinAddress: "",
    ethereumAddress: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setUserData((prev) => ({ ...prev, [name]: checked ? "active" : "inactive" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Success notification would go here
      router.push("/admin/users")
    } catch (error) {
      console.error("Update failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-lg font-medium">Edit User</h3>
            <p className="text-sm text-muted-foreground">User ID: {userId}</p>
          </div>
        </div>
        <Button className="bg-bitradex-orange hover:bg-bitradex-orange/90" onClick={handleSubmit} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <Separator />
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="payment">Payment Details</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Edit User</CardTitle>
                  <CardDescription>User ID: {userId}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => router.push(`/admin/users/${userId}/security`)}>
                  <Lock className="mr-2 h-4 w-4" />
                  Security Settings
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" name="phone" value={userData.phone} onChange={handleChange} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={userData.city} onChange={handleChange} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={userData.state}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={userData.zipCode}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={userData.country}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage user account settings and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Select value={userData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Account Balance ($)</Label>
                  <Input
                    id="balance"
                    name="balance"
                    type="number"
                    value={userData.balance.toString()}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">Manually adjust the user's account balance</p>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Account Permissions</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="trading">Trading Enabled</Label>
                      <p className="text-xs text-muted-foreground">Allow user to trade cryptocurrencies</p>
                    </div>
                    <Switch
                      id="trading"
                      checked={userData.status === "active"}
                      onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="withdrawals">Withdrawals Enabled</Label>
                      <p className="text-xs text-muted-foreground">Allow user to withdraw funds</p>
                    </div>
                    <Switch
                      id="withdrawals"
                      checked={userData.status === "active"}
                      onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="deposits">Deposits Enabled</Label>
                      <p className="text-xs text-muted-foreground">Allow user to deposit funds</p>
                    </div>
                    <Switch
                      id="deposits"
                      checked={userData.status === "active"}
                      onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Manage user payment methods and wallet addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Bank Account Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={userData.bankName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      value={userData.accountNumber}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      name="routingNumber"
                      value={userData.routingNumber}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Cryptocurrency Wallets</h3>
                  <div className="space-y-2">
                    <Label htmlFor="bitcoinAddress">Bitcoin Wallet Address</Label>
                    <Input
                      id="bitcoinAddress"
                      name="bitcoinAddress"
                      value={userData.bitcoinAddress}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ethereumAddress">Ethereum Wallet Address</Label>
                    <Input
                      id="ethereumAddress"
                      name="ethereumAddress"
                      value={userData.ethereumAddress}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                These payment details are used for withdrawals and deposits. Ensure they are accurate to prevent
                transaction issues.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
