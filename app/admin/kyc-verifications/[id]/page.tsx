"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Download, FileText, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function KYCVerificationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const verificationId = params.id
  const [isLoading, setIsLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  // In a real app, you would fetch verification data based on the ID
  // This is mock data for demonstration
  const [verificationData, setVerificationData] = useState({
    id: verificationId,
    userId: "USR001",
    userName: "John Doe",
    email: "john.doe@example.com",
    status: "pending",
    submittedDate: "May 10, 2025",
    personalInfo: {
      fullName: "John Michael Doe",
      dateOfBirth: "1990-05-15",
      nationality: "United States",
      gender: "Male",
    },
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    document: {
      type: "Passport",
      number: "P1234567",
      expiryDate: "2030-05-15",
      frontImageUrl: "/placeholder.svg?height=300&width=450",
      backImageUrl: "/placeholder.svg?height=300&width=450",
    },
    selfieImageUrl: "/placeholder.svg?height=300&width=450",
  })

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to approve the verification
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setVerificationData((prev) => ({ ...prev, status: "approved" }))
      // Success notification would go here
    } catch (error) {
      console.error("Approval failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      // Show error that rejection reason is required
      return
    }

    setIsLoading(true)
    try {
      // In a real app, you would make an API call to reject the verification
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setVerificationData((prev) => ({ ...prev, status: "rejected" }))
      // Success notification would go here
    } catch (error) {
      console.error("Rejection failed:", error)
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
            <h3 className="text-lg font-medium">KYC Verification Details</h3>
            <p className="text-sm text-muted-foreground">Verification ID: {verificationId}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${
            verificationData.status === "approved"
              ? "bg-green-500/20 text-green-500 hover:bg-green-500/20"
              : verificationData.status === "rejected"
                ? "bg-red-500/20 text-red-500 hover:bg-red-500/20"
                : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20"
          }`}
        >
          {verificationData.status === "approved"
            ? "Approved"
            : verificationData.status === "rejected"
              ? "Rejected"
              : "Pending Review"}
        </Badge>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Details of the user submitting verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2 pb-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">{verificationData.userName}</h3>
                <p className="text-sm text-muted-foreground">{verificationData.email}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User ID:</span>
                  <span className="text-sm font-medium">{verificationData.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Submitted:</span>
                  <span className="text-sm font-medium">{verificationData.submittedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Document Type:</span>
                  <span className="text-sm font-medium">{verificationData.document.type}</span>
                </div>
              </div>
              <Separator />
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/admin/users/${verificationData.userId}`)}
                >
                  <User className="mr-2 h-4 w-4" />
                  View User Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Verification Documents</CardTitle>
            <CardDescription>Review submitted identity verification documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="document">ID Document</TabsTrigger>
                <TabsTrigger value="selfie">Selfie</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Full Name</h4>
                    <p className="text-sm">{verificationData.personalInfo.fullName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Date of Birth</h4>
                    <p className="text-sm">{verificationData.personalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Nationality</h4>
                    <p className="text-sm">{verificationData.personalInfo.nationality}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Gender</h4>
                    <p className="text-sm">{verificationData.personalInfo.gender}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="address" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Street Address</h4>
                    <p className="text-sm">{verificationData.address.street}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">City</h4>
                    <p className="text-sm">{verificationData.address.city}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">State/Province</h4>
                    <p className="text-sm">{verificationData.address.state}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">ZIP/Postal Code</h4>
                    <p className="text-sm">{verificationData.address.zipCode}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Country</h4>
                    <p className="text-sm">{verificationData.address.country}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="document" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Document Type</h4>
                    <p className="text-sm">{verificationData.document.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Document Number</h4>
                    <p className="text-sm">{verificationData.document.number}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Expiry Date</h4>
                    <p className="text-sm">{verificationData.document.expiryDate}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Front Side of Document</h4>
                    <div className="relative border rounded-lg overflow-hidden">
                      <img
                        src={verificationData.document.frontImageUrl || "/placeholder.svg"}
                        alt="ID Document Front"
                        className="w-full h-auto"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                  {verificationData.document.backImageUrl && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Back Side of Document</h4>
                      <div className="relative border rounded-lg overflow-hidden">
                        <img
                          src={verificationData.document.backImageUrl || "/placeholder.svg"}
                          alt="ID Document Back"
                          className="w-full h-auto"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                        >
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="selfie" className="space-y-4 pt-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Selfie with ID Document</h4>
                  <div className="relative border rounded-lg overflow-hidden">
                    <img
                      src={verificationData.selfieImageUrl || "/placeholder.svg"}
                      alt="Selfie with ID"
                      className="w-full h-auto"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {verificationData.status === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Review Decision</CardTitle>
            <CardDescription>Approve or reject this verification submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>Verification Guidelines</AlertTitle>
                <AlertDescription>
                  Ensure all documents are valid, not expired, clearly visible, and match the user's information. The
                  selfie should clearly show the user's face alongside their ID document.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason (required if rejecting)</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
              onClick={handleReject}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Reject Verification
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={isLoading}>
              <Check className="mr-2 h-4 w-4" />
              Approve Verification
            </Button>
          </CardFooter>
        </Card>
      )}

      {verificationData.status === "approved" && (
        <Card>
          <CardContent className="pt-6">
            <Alert className="bg-green-500/20 text-green-500 border-green-500/50">
              <Check className="h-4 w-4" />
              <AlertTitle>Verification Approved</AlertTitle>
              <AlertDescription>
                This verification has been approved. The user now has full access to the platform.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {verificationData.status === "rejected" && (
        <Card>
          <CardContent className="pt-6">
            <Alert className="bg-red-500/20 text-red-500 border-red-500/50">
              <X className="h-4 w-4" />
              <AlertTitle>Verification Rejected</AlertTitle>
              <AlertDescription>
                This verification has been rejected. The user will need to resubmit their documents.
              </AlertDescription>
            </Alert>
            <div className="mt-4 p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-2">Rejection Reason:</h4>
              <p className="text-sm text-muted-foreground">
                {rejectionReason ||
                  "The document provided was unclear or illegible. Please ensure your documents are clearly visible and all information is readable."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
