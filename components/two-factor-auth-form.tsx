"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { KeyRound, MessageSquare, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TwoFactorAuthFormProps {
  email: string
  onCancel: () => void
  onSuccess: () => void
}

export function TwoFactorAuthForm({ email, onCancel, onSuccess }: TwoFactorAuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [method, setMethod] = useState<"app" | "sms" | "recovery">("app")
  const [verificationCode, setVerificationCode] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [error, setError] = useState("")

  // Handle sending SMS code
  const handleSendSmsCode = async () => {
    setIsLoading(true)
    setError("")

    try {
      // In a real app, you would send an SMS with a code
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch (error) {
      setError("Failed to send SMS code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle verification code submission
  const handleVerify = async () => {
    setIsLoading(true)
    setError("")

    try {
      // In a real app, you would validate the code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // If successful, proceed to dashboard
      onSuccess()
    } catch (error) {
      setError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle recovery code submission
  const handleRecovery = async () => {
    setIsLoading(true)
    setError("")

    try {
      // In a real app, you would validate the recovery code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // If successful, proceed to dashboard
      onSuccess()
    } catch (error) {
      setError("Invalid recovery code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Enter the verification code to continue</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue={method} onValueChange={(value) => setMethod(value as "app" | "sms" | "recovery")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="app">Authenticator</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
          </TabsList>

          {/* Authenticator App Tab */}
          <TabsContent value="app" className="space-y-4">
            <div className="flex items-center justify-center py-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-code">Authenticator Code</Label>
              <Input
                id="auth-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">Enter the 6-digit code from your authenticator app.</p>
            </div>

            <Button onClick={handleVerify} disabled={verificationCode.length !== 6 || isLoading} className="w-full">
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </TabsContent>

          {/* SMS Tab */}
          <TabsContent value="sms" className="space-y-4">
            <div className="flex items-center justify-center py-4">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>

            <Alert>
              <AlertTitle>SMS Verification</AlertTitle>
              <AlertDescription>
                We'll send a verification code to your registered phone number ending in ****4567.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="sms-code">SMS Code</Label>
              <Input
                id="sms-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleVerify} disabled={verificationCode.length !== 6 || isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
              <Button variant="outline" onClick={handleSendSmsCode} disabled={isLoading}>
                {isLoading ? "Sending..." : "Resend Code"}
              </Button>
            </div>
          </TabsContent>

          {/* Recovery Tab */}
          <TabsContent value="recovery" className="space-y-4">
            <div className="flex items-center justify-center py-4">
              <div className="rounded-full bg-primary/10 p-3">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery-code">Recovery Code</Label>
              <Input
                id="recovery-code"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter one of your recovery codes. Each code can only be used once.
              </p>
            </div>

            <Button onClick={handleRecovery} disabled={!recoveryCode || isLoading} className="w-full">
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Back
        </Button>
        <p className="text-sm text-muted-foreground">
          Having trouble?{" "}
          <a href="#" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
