"use client"

import type React from "react"

import { useState } from "react"
import { Bitcoin, CreditCard, QrCode, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DepositPage() {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bitcoin")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Success notification would go here
      setAmount("")
    } catch (error) {
      console.error("Deposit failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Deposit Funds</h3>
        <p className="text-sm text-muted-foreground">Add funds to your account using your preferred payment method</p>
      </div>
      <Separator />
      <Tabs defaultValue="crypto" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
          <TabsTrigger value="fiat">Bank / Card</TabsTrigger>
        </TabsList>
        <TabsContent value="crypto">
          <Card>
            <CardHeader>
              <CardTitle>Deposit with Cryptocurrency</CardTitle>
              <CardDescription>Send crypto directly to your CryptoVest wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="crypto-amount">Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="crypto-amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum deposit: $10.00</p>
                </div>
                <div className="space-y-2">
                  <Label>Select cryptocurrency</Label>
                  <RadioGroup
                    defaultValue="bitcoin"
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                  >
                    <div>
                      <RadioGroupItem value="bitcoin" id="bitcoin" className="peer sr-only" disabled={isLoading} />
                      <Label
                        htmlFor="bitcoin"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Bitcoin className="mb-3 h-6 w-6" />
                        Bitcoin
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="ethereum" id="ethereum" className="peer sr-only" disabled={isLoading} />
                      <Label
                        htmlFor="ethereum"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Wallet className="mb-3 h-6 w-6" />
                        Ethereum
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="usdt" id="usdt" className="peer sr-only" disabled={isLoading} />
                      <Label
                        htmlFor="usdt"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        USDT
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex flex-col items-center space-y-3">
                    <QrCode className="h-32 w-32" />
                    <p className="text-sm font-medium">Scan QR code or copy address</p>
                    <div className="flex w-full items-center space-x-2">
                      <Input
                        readOnly
                        value={
                          paymentMethod === "bitcoin"
                            ? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                            : paymentMethod === "ethereum"
                              ? "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                              : "TUQCPyhVnNX9yCGEVT5jHQrR4TFUPxoM5W"
                        }
                      />
                      <Button variant="outline" type="button">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-medium">Important Notes:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Send only {paymentMethod.toUpperCase()} to this address</li>
                    <li>• Minimum deposit amount is $10.00</li>
                    <li>• Deposits typically confirm within 30 minutes</li>
                    <li>• Contact support if you encounter any issues</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fiat">
          <Card>
            <CardHeader>
              <CardTitle>Deposit with Bank or Card</CardTitle>
              <CardDescription>Add funds using your bank account or credit/debit card</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fiat-amount">Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="fiat-amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum deposit: $10.00</p>
                </div>
                <div className="space-y-2">
                  <Label>Select payment method</Label>
                  <RadioGroup defaultValue="card" className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <RadioGroupItem value="card" id="card" className="peer sr-only" disabled={isLoading} />
                      <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="bank" id="bank" className="peer sr-only" disabled={isLoading} />
                      <Label
                        htmlFor="bank"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Wallet className="mb-3 h-6 w-6" />
                        Bank Transfer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Name on Card</Label>
                      <Input id="card-name" placeholder="John Doe" disabled={isLoading} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" disabled={isLoading} />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Deposit Funds"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Your payment information is securely processed and never stored on our servers.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
