"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation" // Add useParams

import type React from "react"
import { ArrowLeft, Save, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface UserData {
  status: string
  _id: string
  firstName: string
  lastName: string
  email: string
  kycStatus: string
  balance: number
  createdAt: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  bankName: string
  accountNumber: string
  routingNumber: string
  bitcoinAddress: string
  ethereumAddress: string
}


export default function UserEditPage() {


  const router = useRouter()
  const params = useParams()
  const userId = params.id as string // Properly typed access
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState("")




  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setUserData(prev => {
    if (!prev) return null
    // Handle numeric fields
    const numericFields = ['balance']
    return {
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }
  })
}



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!userData) return

  setIsLoading(true)
  try {
    const response = await fetch(`/api/updateprofile_admin/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    // Log the error response if not OK
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Server response:", errorText)
      throw new Error('Update failed: ' + response.status)
    }

    router.push("/admin/users")
  } catch (error) {
    console.error("Update failed:", error)
    setError('Failed to save changes')
  } finally {
    setIsLoading(false)
  }
}




  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) throw new Error('Failed to fetch user')
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        setError('Failed to load user data')
        console.error('Fetch error:', err)
      }
    }
    
    fetchUser()
  }, [userId])

  
  const handleSelectChange = (name: string, value: string) => {
    setUserData(prev => prev ? { ...prev, [name]: value } : null)
  }

  

  // Update your change handlers like this:

// For regular input fields
const handleInputChange = (p0: string, checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setUserData(prev => prev ? { ...prev, [name]: value } : null)
}

// For switch components
const handleSwitchChange = (name: string, checked: boolean) => {
  setUserData(prev => prev ? { ...prev, [name]: checked ? "active" : "inactive" } : null)
}

// For select components (keep this one)



  if (!userData) {
    return <div className="p-4">Loading user data...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
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
    <Select 
    value={userData.kycStatus} 
    onValueChange={(value) => handleSelectChange("kycStatus", value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="verified">Verified</SelectItem>
      <SelectItem value="pending">Pending</SelectItem>
      <SelectItem value="unverified">Unverified</SelectItem>
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
  />                  <p className="text-xs text-muted-foreground">Manually adjust the user's account balance</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balance">BTC Account Balance ($)</Label>
 <Input
  id="bitcoinAddress"
  name="bitcoinAddress"
  value={userData.bitcoinAddress || ''}
  onChange={handleChange}
  disabled={isLoading}
/>
               <p className="text-xs text-muted-foreground">Manually adjust the user's account balance</p>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="balance">ETH Account Balance ($)</Label>
 <Input
  id="ethereumAddress"
  name="ethereumAddress"
  value={userData.ethereumAddress || ''}
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
                    // Update all Switch components to use handleSwitchChange
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
                    // Update all Switch components to use handleSwitchChange
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
