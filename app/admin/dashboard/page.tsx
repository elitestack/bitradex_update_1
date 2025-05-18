import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Bitcoin, DollarSign, LineChart, Users } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-medium">Admin Dashboard</h3>
        <p className="text-sm text-muted-foreground">Overview of platform statistics and activities</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234.56</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,456.78</div>
            <p className="text-xs text-muted-foreground">+8.3% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
              <LineChart className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Activity chart will be displayed here</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bitradex-orange/10">
                  <Users className="h-5 w-5 text-bitradex-orange" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New User Registration</p>
                  <p className="text-sm text-muted-foreground">May 10, 2025</p>
                </div>
                <div className="ml-auto font-medium">John Doe</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bitradex-orange/10">
                  <ArrowDown className="h-5 w-5 text-bitradex-orange" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Deposit</p>
                  <p className="text-sm text-muted-foreground">May 9, 2025</p>
                </div>
                <div className="ml-auto font-medium">$1,000.00</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bitradex-orange/10">
                  <Bitcoin className="h-5 w-5 text-bitradex-orange" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Bitcoin Purchase</p>
                  <p className="text-sm text-muted-foreground">May 8, 2025</p>
                </div>
                <div className="ml-auto font-medium">0.02 BTC</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bitradex-orange/10">
                  <ArrowUp className="h-5 w-5 text-bitradex-orange" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Withdrawal</p>
                  <p className="text-sm text-muted-foreground">May 7, 2025</p>
                </div>
                <div className="ml-auto font-medium">$500.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
