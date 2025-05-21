"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Bitcoin, CreditCard, Wallet, ArrowUp, Search, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Transaction } from "mongodb"


// Sample withdrawal transaction data



export default function WithdrawPage() {
  const [amount, setAmount] = useState("")
  // const [withdrawMethod, setWithdrawMethod] = useState("bitcoin")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
const [transactionError, setTransactionError] = useState('')
const [withdrawTab, setWithdrawTab] = useState("crypto")
const [cryptoMethod, setCryptoMethod] = useState("bitcoin")
const [withdrawMethod, setWithdrawMethod] = useState("crypto")

  const [userData, setUserData] = useState({
      fiatBalance: 0,
      balance: 0,
      cryptoAssets: {} as Record<string, number>,
      kycStatus: 'unverified' as 'unverified' | 'pending' | 'verified' | 'rejected'
    })

  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  const [loading, setLoading] = useState(true)




  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const userRes = await fetch('/api/user', { credentials: 'include' })
          if (!userRes.ok) throw new Error('Failed to fetch user data')
          const userData = await userRes.json()
  
          console.log(userData)
          setUserData(userData)
          console.log(userRes);
  
         
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setLoading(false)
        }
      }
       const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions')
      if (!res.ok) throw new Error('Failed to fetch transactions')
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      setTransactionError('Failed to load transaction history')
    }
  }
  fetchTransactions()
      fetchData()
    }, [])
  

    



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setTransactionError('')

  try {
// Basic input validation
    if (!amount || isNaN(Number(amount))) {
      throw new Error('Please enter a valid amount')
    }

    const numericAmount = Number(amount)
    if (numericAmount < 50) {
      throw new Error('Minimum withdrawal amount is $50')
    }

    // Type-safe form element access
    const form = e.currentTarget as HTMLFormElement
    const elements = form.elements as typeof form.elements & {
      [key: string]: HTMLInputElement
    }

    let bankDetails = undefined

    if (withdrawMethod === 'crypto') {
      if (!address.trim()) {
        throw new Error('Wallet address is required')
      }
    } else {
      const bankName = elements['bank-name']?.value
      const accountName = elements['account-name']?.value
      const accountNumber = elements['account-number']?.value
      const routingNumber = elements['routing-number']?.value

      if (!bankName || !accountName || !accountNumber || !routingNumber) {
        throw new Error('All bank details are required')
      }

      bankDetails = {
        bankName,
        accountName,
        accountNumber,
        routingNumber
      }
    }

    // Prepare payload with type safety
    const payload = {
      amount: numericAmount,
      method: withdrawMethod,
      networkFee: withdrawMethod === 'crypto' ? 2.5 : 5,
      walletAddress: withdrawMethod === 'crypto' ? address : undefined,
      bankDetails
    }

    // API call
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error)
    }

    // Refresh data
    const [userRes, transactionsRes] = await Promise.all([
      fetch('/api/user'),
      fetch('/api/transactions')
    ])
    
    if (!userRes.ok || !transactionsRes.ok) {
      throw new Error('Failed to refresh data')
    }

    setUserData(await userRes.json())
    setTransactions(await transactionsRes.json())
    setAmount('')
    setAddress('')

  } catch (error) {
    console.error("Withdrawal failed:", error)
    setTransactionError(error.message)
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

        {/* <Tabs defaultValue="crypto" value={withdrawTab} onValueChange={setWithdrawTab} className="w-full"> */}
          <Tabs 
  defaultValue="crypto" 
  value={withdrawTab} 
  onValueChange={(value) => {
    setWithdrawTab(value);
    setWithdrawMethod(value === 'crypto' ? 'crypto' : 'bank');
  }}
 className="w-full" >


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
              {transactionError && (
  <div className="p-4 mb-4 text-sm text-red-500 bg-red-50 rounded-lg">
    {transactionError}
  </div>
)}
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
  min="50"
  step="0.01"
  required
/>

                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">Minimum withdrawal: $50.00</p>
                    <p className="text-xs">
                      Available: <span className="font-medium">{`$${userData.balance}`}</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Select cryptocurrency</Label>
               
                    <RadioGroup
  value={cryptoMethod}
  onValueChange={setCryptoMethod}
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
  cryptoMethod === "bitcoin"
    ? "Enter Bitcoin address"
    : cryptoMethod === "ethereum"
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
  id="account-number"
  placeholder="Enter account number"
  disabled={isLoading}
  pattern="[0-9]{8,17}"
  title="8-17 digit account number"
/>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">Minimum withdrawal: $50.00</p>
                    <p className="text-xs">
                      Available: <span className="font-medium">{`$${userData.balance}`}</span>
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

                    <Input
  id="routing-number"
  placeholder="Enter routing number"
  disabled={isLoading}
  pattern="[0-9]{9}"
  title="9-digit routing number"
/>
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

           {/* Added Withdrawal History Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Withdrawal History</h3>
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search withdrawals..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="recent">This Month</SelectItem>
                    <SelectItem value="older">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
  {transactions.map((transaction) => (
    <TableRow key={transaction._id}>
      <TableCell className="font-medium">{transaction._id?.slice(-8)}</TableCell>
      <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <ArrowUp className="h-4 w-4 text-red-500 mr-2" />
          {transaction.method}
        </div>
      </TableCell>
      <TableCell className="text-right text-red-500">
        -${transaction.amount.toFixed(2)}
        {transaction.networkFee && (
          <div className="text-xs text-muted-foreground">
            Fee: ${transaction.networkFee.toFixed(2)}
          </div>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
