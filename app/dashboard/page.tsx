"use client"

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, Bitcoin, Coins, DollarSign, FileCheck, LineChart } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface CryptoPrices {
  BTC?: number
  ETH?: number
}

export default function DashboardPage() {
  const [userData, setUserData] = useState({
    fiatBalance: 0,
    balance: 0,
    cryptoAssets: {} as Record<string, number>,
    kycStatus: 'unverified' as 'unverified' | 'pending' | 'verified' | 'rejected'
  })
  const [prices, setPrices] = useState<CryptoPrices>({})
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

        const priceRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
        )
        const priceData = await priceRes.json()
        setPrices({
          BTC: priceData.bitcoin.usd,
          ETH: priceData.ethereum.usd,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])


  const totalBalance = useMemo(() => {
    return userData.fiatBalance + 
      ((userData.cryptoAssets?.BTC ?? 0) * (prices.BTC || 0)) + 
      ((userData.cryptoAssets?.ETH ?? 0) * (prices.ETH || 0))
  }, [userData, prices])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton width={100} height={20} />
                <Skeleton circle width={16} height={16} />
              </CardHeader>
              <CardContent>
                <Skeleton width={80} height={28} />
                <Skeleton width={120} height={16} className="mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* KYC Alert */}
      {userData.kycStatus !== "verified" && (
        <Alert className={userData.kycStatus === "rejected" ? "border-red-500 bg-red-500/10" : "border-yellow-500 bg-yellow-500/10"}>
          <FileCheck className={`h-4 w-4 ${userData.kycStatus === "rejected" ? "text-red-500" : "text-yellow-500"}`} />
          <AlertTitle className={userData.kycStatus === "rejected" ? "text-red-500" : "text-yellow-500"}>
            {userData.kycStatus === "unverified"
              ? "Identity Verification Required"
              : userData.kycStatus === "pending"
                ? "Verification In Progress"
                : "Verification Rejected"}
          </AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>
              {userData.kycStatus === "unverified"
                ? "Complete your identity verification to unlock full platform features."
                : userData.kycStatus === "pending"
                  ? "Your verification is being reviewed. This process typically takes 1-3 business days."
                  : "Your verification was rejected. Please review the feedback and resubmit."}
            </span>
            <Link href="/dashboard/kyc-verification">
              <Button
                variant="outline"
                size="sm"
                className={userData.kycStatus === "rejected" ? "border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500" : ""}
              >
                {userData.kycStatus === "unverified" ? "Verify Now" : userData.kycStatus === "pending" ? "Check Status" : "Resubmit"}
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userData.balance}</div>
            <p className="text-xs text-muted-foreground">Current portfolio value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitcoin</CardTitle>
            <Bitcoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
 
            {(userData.cryptoAssets?.BTC ?? 0).toFixed(4)}

            </div>
            <p className="text-xs text-muted-foreground">
            ${((userData.cryptoAssets?.BTC ?? 0) * (prices.BTC ?? 0)).toFixed(2)}

            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ethereum</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
            {(userData.cryptoAssets?.ETH ?? 0).toFixed(4)} ETH
            </div>
            <p className="text-xs text-muted-foreground">
            ${((userData.cryptoAssets?.ETH ?? 0) * (prices.ETH ?? 0)).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">$0.00</div>
            <p className="text-xs text-muted-foreground">No investments yet</p>
          </CardContent>
        </Card>

        {/* ... other cards remain similar */}
      </div>

      {/* ... rest of the dashboard UI */}
     {/*  */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Coins</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
                <TabsTrigger value="losers">Top Losers</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-4 gap-4 py-2 text-sm font-medium">
                  <div>Coin</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">24h Change</div>
                  <div className="text-right">Market Cap</div>
                </div>
                <div className="grid grid-cols-4 gap-4 py-2">
                  <div className="flex items-center">
                    <Bitcoin className="mr-2 h-4 w-4" />
                    <span>Bitcoin</span>
                  </div>
                  <div className="text-right">$28,439.32</div>
                  <div className="text-right text-green-500">+2.5%</div>
                  <div className="text-right">$542.8B</div>
                </div>
                <div className="grid grid-cols-4 gap-4 py-2">
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4" />
                    <span>Ethereum</span>
                  </div>
                  <div className="text-right">$2,273.81</div>
                  <div className="text-right text-green-500">+3.2%</div>
                  <div className="text-right">$273.4B</div>
                </div>
                <div className="grid grid-cols-4 gap-4 py-2">
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4" />
                    <span>Solana</span>
                  </div>
                  <div className="text-right">$142.65</div>
                  <div className="text-right text-red-500">-1.8%</div>
                  <div className="text-right">$61.2B</div>
                </div>
                <div className="grid grid-cols-4 gap-4 py-2">
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4" />
                    <span>Cardano</span>
                  </div>
                  <div className="text-right">$0.58</div>
                  <div className="text-right text-green-500">+0.7%</div>
                  <div className="text-right">$20.5B</div>
                </div>
              </TabsContent>
              <TabsContent value="trending">
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Trending coins will be displayed here
                </div>
              </TabsContent>
              <TabsContent value="gainers">
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Top gainers will be displayed here
                </div>
              </TabsContent>
              <TabsContent value="losers">
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Top losers will be displayed here
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Steps to begin your investment journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bitradex-orange text-white text-xs font-bold">
                    1
                  </div>
                  <h4 className="ml-2 text-sm font-medium">Complete Your Profile</h4>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Update your profile information to unlock all features.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bitradex-orange text-white text-xs font-bold">
                    2
                  </div>
                  <h4 className="ml-2 text-sm font-medium">Verify Your Identity</h4>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Complete KYC verification to enable deposits and withdrawals.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bitradex-orange text-white text-xs font-bold">
                    3
                  </div>
                  <h4 className="ml-2 text-sm font-medium">Deposit Funds</h4>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Add funds to your account to start investing in cryptocurrencies.
                </p>
              </div>
              <div className="rounded-lg border p-3 bg-muted">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h4 className="ml-2 text-sm font-medium">Welcome Bonus Received</h4>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  You've received a $50 welcome bonus to start your investment journey!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* end */}
    </div>
  )
}