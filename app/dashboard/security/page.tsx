"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Check, Copy, MessageSquare, QrCode, Shield, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SecurityPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // 2FA Status
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorMethod, setTwoFactorMethod] = useState<"app" | "sms">("app")

  // Setup states
  const [setupStep, setSetupStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [smsCode, setSmsCode] = useState("")

  // Recovery codes
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)
  const recoveryCodes = [
    "ABCD-EFGH-IJKL-MNOP",
    "QRST-UVWX-YZ12-3456",
    "7890-ABCD-EFGH-IJKL",
    "MNOP-QRST-UVWX-YZ12",
    "3456-7890-ABCD-EFGH",
    "IJKL-MNOP-QRST-UVWX",
    "YZ12-3456-7890-ABCD",
    "EFGH-IJKL-MNOP-QRST",
  ]

  // Mock secret key for authenticator app
  const secretKey = "JBSWY3DPEHPK3PXP"

  // Handle enabling/disabling 2FA
  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      // Start setup process
      setSetupStep(1)
    } else {
      // Disable 2FA
      setTwoFactorEnabled(false)
    }
  }

  // Handle verification code submission for authenticator app
  const handleVerifyAuthenticatorCode = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would validate the code against the secret key
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // If successful, show recovery codes
      setSetupStep(3)
      setTwoFactorEnabled(true)
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle sending SMS code
  const handleSendSmsCode = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would send an SMS with a code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Move to verification step
      setSetupStep(2)
    } catch (error) {
      console.error("SMS sending failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle verification code submission for SMS
  const handleVerifySmsCode = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would validate the SMS code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // If successful, show recovery codes
      setSetupStep(3)
      setTwoFactorEnabled(true)
      setTwoFactorMethod("sms")
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle saving recovery codes
  const handleSaveRecoveryCodes = () => {
    setShowRecoveryCodes(true)
  }

  // Handle copying recovery codes
  const handleCopyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join("\n"))
  }

  // Handle finishing setup
  const handleFinishSetup = () => {
    setShowRecoveryCodes(false)
    setSetupStep(1)
  }

  // Handle disabling 2FA
  const handleDisable2FA = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would make an API call to disable 2FA
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setTwoFactorEnabled(false)
    } catch (error) {
      console.error("Disabling 2FA failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your account security and authentication methods</p>
      </div>
      <Separator />

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button type="submit">Change password</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Your password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and
            special characters.
          </p>
        </CardFooter>
      </Card>

      {/* Two-Factor Authentication Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
                disabled={isLoading || (twoFactorEnabled && setupStep === 3)}
              />
              <span className={twoFactorEnabled ? "text-green-500 font-medium" : "text-muted-foreground"}>
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!twoFactorEnabled ? (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Enhance Your Account Security</AlertTitle>
                <AlertDescription>
                  Two-factor authentication adds an extra layer of security to your account by requiring a second form
                  of verification in addition to your password.
                </AlertDescription>
              </Alert>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Authenticator App</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Use an authenticator app like Google Authenticator or Authy to generate verification codes.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">SMS Verification</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Receive verification codes via SMS to your registered phone number.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 text-sm font-medium">Why use Two-Factor Authentication?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Protects your account even if your password is compromised</li>
                  <li>• Prevents unauthorized access to your funds and personal information</li>
                  <li>• Recommended for all cryptocurrency accounts</li>
                </ul>
              </div>
            </div>
          ) : showRecoveryCodes ? (
            <div className="space-y-4">
              <Alert className="bg-yellow-500/10 border-yellow-500/50 text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Save Your Recovery Codes</AlertTitle>
                <AlertDescription>
                  Store these recovery codes in a safe place. They can be used to regain access to your account if you
                  lose your phone or cannot receive verification codes.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-2">
                  {recoveryCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm p-2 bg-muted rounded">
                      {code}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleCopyRecoveryCodes}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Codes
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowRecoveryCodes(false)}>
                  Back
                </Button>
                <Button onClick={handleFinishSetup}>I've Saved My Recovery Codes</Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue={twoFactorMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="app"
                  onClick={() => setTwoFactorMethod("app")}
                  disabled={twoFactorEnabled && twoFactorMethod !== "app"}
                >
                  Authenticator App
                </TabsTrigger>
                <TabsTrigger
                  value="sms"
                  onClick={() => setTwoFactorMethod("sms")}
                  disabled={twoFactorEnabled && twoFactorMethod !== "sms"}
                >
                  SMS Verification
                </TabsTrigger>
              </TabsList>

              {/* Authenticator App Tab */}
              <TabsContent value="app" className="space-y-4">
                {twoFactorEnabled ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 flex items-center">
                      <div className="rounded-full bg-green-500/20 p-2 mr-4">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Authenticator App Enabled</h3>
                        <p className="text-sm text-muted-foreground">
                          Your account is secured with an authenticator app.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleSaveRecoveryCodes}>
                        View Recovery Codes
                      </Button>
                      <Button variant="destructive" onClick={handleDisable2FA} disabled={isLoading}>
                        {isLoading ? "Disabling..." : "Disable 2FA"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {setupStep === 1 && (
                      <>
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <div className="rounded-lg border p-4 w-64 h-64 flex items-center justify-center">
                              <QrCode className="h-48 w-48 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="secret-key">Secret Key</Label>
                            <div className="relative">
                              <Input id="secret-key" value={secretKey} readOnly className="pr-10 font-mono" />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full"
                                onClick={() => navigator.clipboard.writeText(secretKey)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              If you can't scan the QR code, you can manually enter this secret key into your
                              authenticator app.
                            </p>
                          </div>

                          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                            <li>Install an authenticator app like Google Authenticator or Authy</li>
                            <li>Scan the QR code or enter the secret key manually</li>
                            <li>Enter the 6-digit verification code from the app</li>
                          </ol>

                          <div className="space-y-2">
                            <Label htmlFor="verification-code">Verification Code</Label>
                            <Input
                              id="verification-code"
                              placeholder="Enter 6-digit code"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              maxLength={6}
                            />
                          </div>

                          <Button
                            onClick={handleVerifyAuthenticatorCode}
                            disabled={verificationCode.length !== 6 || isLoading}
                            className="w-full"
                          >
                            {isLoading ? "Verifying..." : "Verify Code"}
                          </Button>
                        </div>
                      </>
                    )}

                    {setupStep === 3 && (
                      <div className="space-y-4">
                        <Alert className="bg-green-500/10 border-green-500/50 text-green-500">
                          <Check className="h-4 w-4" />
                          <AlertTitle>Two-Factor Authentication Enabled</AlertTitle>
                          <AlertDescription>
                            Your account is now protected with two-factor authentication. You'll need to enter a
                            verification code when signing in.
                          </AlertDescription>
                        </Alert>

                        <Button onClick={handleSaveRecoveryCodes} className="w-full">
                          View Recovery Codes
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* SMS Verification Tab */}
              <TabsContent value="sms" className="space-y-4">
                {twoFactorEnabled && twoFactorMethod === "sms" ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 flex items-center">
                      <div className="rounded-full bg-green-500/20 p-2 mr-4">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">SMS Verification Enabled</h3>
                        <p className="text-sm text-muted-foreground">Your account is secured with SMS verification.</p>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Phone Number</h3>
                          <p className="text-sm text-muted-foreground">{phoneNumber || "+1 (555) 123-4567"}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleSaveRecoveryCodes}>
                        View Recovery Codes
                      </Button>
                      <Button variant="destructive" onClick={handleDisable2FA} disabled={isLoading}>
                        {isLoading ? "Disabling..." : "Disable 2FA"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {setupStep === 1 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="phone-number">Phone Number</Label>
                          <Input
                            id="phone-number"
                            placeholder="+1 (555) 123-4567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            We'll send a verification code to this number. Standard message rates may apply.
                          </p>
                        </div>

                        <Button onClick={handleSendSmsCode} disabled={!phoneNumber || isLoading} className="w-full">
                          {isLoading ? "Sending..." : "Send Verification Code"}
                        </Button>
                      </>
                    )}

                    {setupStep === 2 && (
                      <>
                        <Alert>
                          <MessageSquare className="h-4 w-4" />
                          <AlertTitle>Verification Code Sent</AlertTitle>
                          <AlertDescription>
                            We've sent a verification code to {phoneNumber}. Enter the code below to complete setup.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <Label htmlFor="sms-code">Verification Code</Label>
                          <Input
                            id="sms-code"
                            placeholder="Enter 6-digit code"
                            value={smsCode}
                            onChange={(e) => setSmsCode(e.target.value)}
                            maxLength={6}
                          />
                        </div>

                        <div className="flex justify-between">
                          <Button variant="outline" onClick={() => setSetupStep(1)} disabled={isLoading}>
                            Back
                          </Button>
                          <Button onClick={handleVerifySmsCode} disabled={smsCode.length !== 6 || isLoading}>
                            {isLoading ? "Verifying..." : "Verify Code"}
                          </Button>
                        </div>
                      </>
                    )}

                    {setupStep === 3 && (
                      <div className="space-y-4">
                        <Alert className="bg-green-500/10 border-green-500/50 text-green-500">
                          <Check className="h-4 w-4" />
                          <AlertTitle>Two-Factor Authentication Enabled</AlertTitle>
                          <AlertDescription>
                            Your account is now protected with SMS verification. You'll receive a verification code via
                            SMS when signing in.
                          </AlertDescription>
                        </Alert>

                        <Button onClick={handleSaveRecoveryCodes} className="w-full">
                          View Recovery Codes
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Login Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Login Activity</CardTitle>
          <CardDescription>Review your recent login sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Current Session</h3>
                  <p className="text-sm text-muted-foreground">New York, United States • May 10, 2025, 10:30 AM</p>
                  <p className="text-xs text-muted-foreground mt-1">Chrome on Windows • IP: 192.168.1.1</p>
                </div>
                <div className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-500">Active</div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Previous Login</h3>
                  <p className="text-sm text-muted-foreground">New York, United States • May 8, 2025, 2:15 PM</p>
                  <p className="text-xs text-muted-foreground mt-1">Chrome on Windows • IP: 192.168.1.1</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Previous Login</h3>
                  <p className="text-sm text-muted-foreground">New York, United States • May 5, 2025, 9:45 AM</p>
                  <p className="text-xs text-muted-foreground mt-1">Chrome on Windows • IP: 192.168.1.1</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
