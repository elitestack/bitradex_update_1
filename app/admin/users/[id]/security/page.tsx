"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Lock, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function UserSecurityPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const userId = params.id
  const [isLoading, setIsLoading] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
    id: userId,
    name: "John Doe",
    email: "john.doe@example.com",
    twoFactorEnabled: true,
    twoFactorMethod: "app", // "app" or "sms"
    lastLogin: "May 10, 2025, 10:30 AM",
    lastLoginIp: "192.168.1.1",
    lastLoginLocation: "New York, United States",
    lastLoginDevice: "Chrome on Windows",
    passwordLastChanged: "April 15, 2025",
    loginAttempts: 0,
    accountLocked: false,
  })

  // Handle toggling 2FA
  const handleToggle2FA = async (checked: boolean) => {
    setIsLoading(true)

    try {
      // In a real app, you would make an API call to enable/disable 2FA
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setUserData((prev) => ({ ...prev, twoFactorEnabled: checked }))
    } catch (error) {
      console.error("Failed to update 2FA status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resetting 2FA
  const handleReset2FA = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would make an API call to reset 2FA
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setUserData((prev) => ({ ...prev, twoFactorEnabled: false }))
    } catch (error) {
      console.error("Failed to reset 2FA:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle unlocking account
  const handleUnlockAccount = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would make an API call to unlock the account
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setUserData((prev) => ({ ...prev, accountLocked: false, loginAttempts: 0 }))
    } catch (error) {
      console.error("Failed to unlock account:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle forcing password reset
  const handleForcePasswordReset = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would make an API call to force password reset
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message or notification
    } catch (error) {
      console.error("Failed to force password reset:", error)
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
            <h3 className="text-lg font-medium">User Security Settings</h3>
            <p className="text-sm text-muted-foreground">User ID: {userId}</p>
          </div>
        </div>
        <Badge variant="outline" className="ml-auto">
          {userData.name}
        </Badge>
      </div>
      <Separator />

      {/* Two-Factor Authentication Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>Manage the user's two-factor authentication settings</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={userData.twoFactorEnabled} onCheckedChange={handleToggle2FA} disabled={isLoading} />
              <span className={userData.twoFactorEnabled ? "text-green-500 font-medium" : "text-muted-foreground"}>
                {userData.twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData.twoFactorEnabled ? (
              <>
                <div className="rounded-lg border p-4 flex items-center">
                  <div className="rounded-full bg-green-500/20 p-2 mr-4">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {userData.twoFactorMethod === "app" ? "Authenticator App" : "SMS Verification"} Enabled
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {userData.twoFactorMethod === "app"
                        ? "The user's account is secured with an authenticator app."
                        : "The user's account is secured with SMS verification."}
                    </p>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Admin Actions</AlertTitle>
                  <AlertDescription>
                    As an administrator, you can reset the user's two-factor authentication if they lose access to their
                    device or phone number.
                  </AlertDescription>
                </Alert>

                <Button variant="destructive" onClick={handleReset2FA} disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset 2FA"}
                </Button>
              </>
            ) : (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Two-Factor Authentication Disabled</AlertTitle>
                <AlertDescription>
                  This user does not have two-factor authentication enabled. For enhanced security, we recommend
                  enabling 2FA for all users.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage the user's account security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Last Login</h3>
                <p className="text-sm">{userData.lastLogin}</p>
                <p className="text-xs text-muted-foreground">{userData.lastLoginDevice}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Login Location</h3>
                <p className="text-sm">{userData.lastLoginLocation}</p>
                <p className="text-xs text-muted-foreground">IP: {userData.lastLoginIp}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Password Last Changed</h3>
                <p className="text-sm">{userData.passwordLastChanged}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Account Status</h3>
                {userData.accountLocked ? (
                  <div className="flex items-center">
                    <Badge variant="destructive" className="mr-2">
                      Locked
                    </Badge>
                    <p className="text-xs text-muted-foreground">Failed login attempts: {userData.loginAttempts}</p>
                  </div>
                ) : (
                  <Badge variant="outline" className="bg-green-500/20 text-green-500 hover:bg-green-500/20">
                    Active
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Admin Actions</h3>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                {userData.accountLocked && (
                  <Button
                    variant="outline"
                    onClick={handleUnlockAccount}
                    disabled={isLoading}
                    className="border-green-500 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Unlock Account
                  </Button>
                )}
                <Button variant="outline" onClick={handleForcePasswordReset} disabled={isLoading}>
                  <Lock className="mr-2 h-4 w-4" />
                  Force Password Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>Recent login activity for this user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Successful Login</h3>
                  <p className="text-sm text-muted-foreground">New York, United States • May 10, 2025, 10:30 AM</p>
                  <p className="text-xs text-muted-foreground mt-1">Chrome on Windows • IP: 192.168.1.1</p>
                </div>
                <div className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-500">Success</div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Successful Login</h3>
                  <p className="text-sm text-muted-foreground">New York, United States • May 8, 2025, 2:15 PM</p>
                  <p className="text-xs text-muted-foreground mt-1">Chrome on Windows • IP: 192.168.1.1</p>
                </div>
                <div className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-500">Success</div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Failed Login Attempt</h3>
                  <p className="text-sm text-muted-foreground">Chicago, United States • May 7, 2025, 8:45 AM</p>
                  <p className="text-xs text-muted-foreground mt-1">Chrome on Windows • IP: 192.168.2.1</p>
                </div>
                <div className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-500">Failed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
