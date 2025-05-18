"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bitcoin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TwoFactorAuthForm } from "@/components/two-factor-auth-form"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  })
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Clear form error
    if (errors.form) {
      setErrors((prev) => ({ ...prev, form: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

// app/login/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!validateForm()) return

  setIsLoading(true)

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Login failed')
    }

    const data = await response.json()

    // Handle 2FA requirement
    if (data.requires2FA) {
      setShowTwoFactorAuth(true)
    } else {
      router.push(data.email === 'admin@bitradex.com' 
        ? '/admin/dashboard' 
        : '/dashboard')
    }

  } catch (error) {
    setErrors(prev => ({
      ...prev,
      form: error instanceof Error ? error.message : 'Login failed'
    }))
  } finally {
    setIsLoading(false)
  }
}


  const handleTwoFactorSuccess = () => {
    // Redirect to dashboard after successful 2FA verification
    router.push("/dashboard")
  }

  const handleTwoFactorCancel = () => {
    // Go back to login form
    setShowTwoFactorAuth(false)
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-muted p-4 dark">
      {showTwoFactorAuth ? (
        <TwoFactorAuthForm email={formData.email} onCancel={handleTwoFactorCancel} onSuccess={handleTwoFactorSuccess} />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Link href="/" className="flex items-center">
                <Bitcoin className="h-6 w-6 text-bitradex-orange" />
                <span className="ml-2 text-xl font-bold">BitRadex</span>
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{errors.form}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-bitradex-orange underline underline-offset-4 hover:text-bitradex-orange/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-bitradex-orange hover:bg-bitradex-orange/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-bitradex-orange underline underline-offset-4 hover:text-bitradex-orange/80"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
