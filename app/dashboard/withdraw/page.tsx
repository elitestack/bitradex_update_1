"use client"

import type React from "react"

import { useState } from "react"
import { Bitcoin, CreditCard, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WithdrawPage() {
  const [amount, setAmount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("bitcoin")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Success notification would go here
      setAmount("")
      setAddress("")
    } catch (error) {
      console.error("Withdrawal failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Withdraw Funds</h3>
        <p className="text-sm text-muted-foreground">Withdraw your funds to your preferred destination</p>
      </div>
      <Separator />
      <Tabs defaultValue="crypto" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
          <TabsTrigger value="fiat">Bank Account</TabsTrigger>
        </TabsList>
        <TabsContent value="crypto">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw to Cryptocurrency Wallet</CardTitle>
              <CardDescription>Send your funds to an external cryptocurrency wallet</CardDescription>
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
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">Minimum withdrawal: $50.00</p>
                    <p className="text-xs">
                      Available: <span className="font-medium">$45,231.89</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Select cryptocurrency</Label>
                  <RadioGroup
                    defaultValue="bitcoin"
                    value={withdrawMethod}
                    onValueChange={setWithdrawMethod}
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                  >
                    <div>
                      <RadioGroupItem
                        value="bitcoin"
                        id="bitcoin-withdraw"
                        className="peer sr-only"
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor="bitcoin-withdraw"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Bitcoin className="mb-3 h-6 w-6" />
                        Bitcoin
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="ethereum"
                        id="ethereum-withdraw"
                        className="peer sr-only"
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor="ethereum-withdraw"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Wallet className="mb-3 h-6 w-6" />
                        Ethereum
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="usdt" id="usdt-withdraw" className="peer sr-only" disabled={isLoading} />
                      <Label
                        htmlFor="usdt-withdraw"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        USDT
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    placeholder={
                      withdrawMethod === "bitcoin"
                        ? "Enter Bitcoin address"
                        : withdrawMethod === "ethereum"
                          ? "Enter Ethereum address"
                          : "Enter USDT address"
                    }
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">Double-check your wallet address before submitting</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-medium">Withdrawal Summary:</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span>${amount || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network Fee:</span>
                      <span>$2.50</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total:</span>
                      <span>${amount ? (Number.parseFloat(amount) + 2.5).toFixed(2) : "2.50"}</span>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Withdraw Funds"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Withdrawals typically process within 24 hours. For security reasons, first-time withdrawals may require
                additional verification.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="fiat">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw to Bank Account</CardTitle>
              <CardDescription>Transfer your funds to your linked bank account</CardDescription>
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
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">Minimum withdrawal: $50.00</p>
                    <p className="text-xs">
                      Available: <span className="font-medium">$45,231.89</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input id="bank-name" placeholder="Enter bank name" disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Holder Name</Label>
                    <Input id="account-name" placeholder="Enter account holder name" disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="Enter account number" disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routing-number">Routing Number</Label>
                    <Input id="routing-number" placeholder="Enter routing number" disabled={isLoading} />
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-medium">Withdrawal Summary:</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span>${amount || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee:</span>
                      <span>$5.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total:</span>
                      <span>${amount ? (Number.parseFloat(amount) + 5).toFixed(2) : "5.00"}</span>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Withdraw Funds"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Bank withdrawals typically take 3-5 business days to process. For security reasons, first-time
                withdrawals may require additional verification.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
