"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, FileText, Upload, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function KYCVerificationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [verificationStatus, setVerificationStatus] = useState<"unverified" | "pending" | "verified" | "rejected">(
    "unverified",
  )
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    gender: "",
    // Address Information
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    // ID Document
    documentType: "passport",
    documentNumber: "",
    expiryDate: "",
    frontImage: null as File | null,
    backImage: null as File | null,
    // Selfie
    selfieImage: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.files?.[0] || null }))
    }
  }

  const handleNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 4))
  }

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setVerificationStatus("pending")
      setActiveStep(4)
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // For demo purposes, let's simulate different verification statuses
  const simulateVerificationStatus = (status: "pending" | "verified" | "rejected") => {
    setVerificationStatus(status)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">KYC Verification</h3>
        <p className="text-sm text-muted-foreground">
          Complete your identity verification to unlock full platform features
        </p>
      </div>
      <Separator />

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>Current status of your identity verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`rounded-full p-1 ${
                    verificationStatus === "unverified"
                      ? "bg-muted text-muted-foreground"
                      : verificationStatus === "pending"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : verificationStatus === "verified"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {verificationStatus === "unverified" ? (
                    <User className="h-5 w-5" />
                  ) : verificationStatus === "pending" ? (
                    <FileText className="h-5 w-5" />
                  ) : verificationStatus === "verified" ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {verificationStatus === "unverified"
                      ? "Not Verified"
                      : verificationStatus === "pending"
                        ? "Verification Pending"
                        : verificationStatus === "verified"
                          ? "Verified"
                          : "Verification Rejected"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {verificationStatus === "unverified"
                      ? "Please complete the verification process"
                      : verificationStatus === "pending"
                        ? "Your documents are being reviewed"
                        : verificationStatus === "verified"
                          ? "Your identity has been verified"
                          : "Your verification was rejected. Please resubmit."}
                  </p>
                </div>
              </div>
              {verificationStatus === "rejected" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setVerificationStatus("unverified")
                    setActiveStep(1)
                  }}
                >
                  Resubmit
                </Button>
              )}
            </div>

            {/* For demo purposes only - buttons to simulate different statuses */}
            {process.env.NODE_ENV === "development" && (
              <div className="flex space-x-2 pt-4 border-t">
                <p className="text-xs text-muted-foreground mr-2">Demo controls:</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => simulateVerificationStatus("pending")}
                >
                  Set Pending
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => simulateVerificationStatus("verified")}
                >
                  Set Verified
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => simulateVerificationStatus("rejected")}
                >
                  Set Rejected
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification Process */}
      {verificationStatus === "unverified" && (
        <Card>
          <CardHeader>
            <CardTitle>Identity Verification</CardTitle>
            <CardDescription>Complete the following steps to verify your identity</CardDescription>
            <div className="mt-2">
              <Progress value={(activeStep / 4) * 100} className="h-2" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span className={activeStep >= 1 ? "text-bitradex-orange font-medium" : ""}>Personal Info</span>
                <span className={activeStep >= 2 ? "text-bitradex-orange font-medium" : ""}>Address</span>
                <span className={activeStep >= 3 ? "text-bitradex-orange font-medium" : ""}>ID Document</span>
                <span className={activeStep >= 4 ? "text-bitradex-orange font-medium" : ""}>Selfie</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Legal Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="As it appears on your ID document"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => handleSelectChange("nationality", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 2: Address Information */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Your current residential address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: ID Document */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">ID Document Type</Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value) => handleSelectChange("documentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving_license">Driving License</SelectItem>
                        <SelectItem value="national_id">National ID Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">Document Number</Label>
                    <Input
                      id="documentNumber"
                      name="documentNumber"
                      placeholder="Enter your document number"
                      value={formData.documentNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="frontImage">Front Side of Document</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="frontImage"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG or PDF (MAX. 5MB)</p>
                        </div>
                        <input
                          id="frontImage"
                          name="frontImage"
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, application/pdf"
                          onChange={(e) => handleFileChange(e, "frontImage")}
                          required
                        />
                      </label>
                    </div>
                    {formData.frontImage && (
                      <p className="text-xs text-muted-foreground">Selected file: {formData.frontImage.name}</p>
                    )}
                  </div>
                  {formData.documentType !== "passport" && (
                    <div className="space-y-2">
                      <Label htmlFor="backImage">Back Side of Document</Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="backImage"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or PDF (MAX. 5MB)</p>
                          </div>
                          <input
                            id="backImage"
                            name="backImage"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, application/pdf"
                            onChange={(e) => handleFileChange(e, "backImage")}
                            required={formData.documentType !== "passport"}
                          />
                        </label>
                      </div>
                      {formData.backImage && (
                        <p className="text-xs text-muted-foreground">Selected file: {formData.backImage.name}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Selfie */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <Alert>
                    <AlertTitle>Important Instructions</AlertTitle>
                    <AlertDescription>
                      Please take a clear photo of yourself holding your ID document. Make sure your face and the ID are
                      clearly visible.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="selfieImage">Selfie with ID Document</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="selfieImage"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG or JPG (MAX. 5MB)</p>
                        </div>
                        <input
                          id="selfieImage"
                          name="selfieImage"
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg"
                          onChange={(e) => handleFileChange(e, "selfieImage")}
                          required
                        />
                      </label>
                    </div>
                    {formData.selfieImage && (
                      <p className="text-xs text-muted-foreground">Selected file: {formData.selfieImage.name}</p>
                    )}
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="mb-2 text-sm font-medium">Requirements:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Make sure your face is clearly visible</li>
                        <li>• Hold your ID document next to your face</li>
                        <li>• Ensure the photo is well-lit and not blurry</li>
                        <li>• Do not wear sunglasses or hats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep} disabled={activeStep === 1 || isLoading}>
              Previous
            </Button>
            {activeStep < 4 ? (
              <Button
                onClick={handleNextStep}
                disabled={isLoading}
                className="bg-bitradex-orange hover:bg-bitradex-orange/90"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-bitradex-orange hover:bg-bitradex-orange/90"
              >
                {isLoading ? "Submitting..." : "Submit Verification"}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Pending Verification */}
      {verificationStatus === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Verification in Progress</CardTitle>
            <CardDescription>Your documents are being reviewed by our team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-yellow-500/20 p-4">
                <FileText className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-medium">Verification Pending</h3>
              <p className="text-center text-muted-foreground max-w-md">
                We've received your verification documents and they are currently being reviewed by our team. This
                process typically takes 1-3 business days.
              </p>
              <div className="w-full max-w-md mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Submission Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Completion:</span>
                    <span>{new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <a href="#" className="text-bitradex-orange hover:underline">
                Contact Support
              </a>
            </p>
          </CardFooter>
        </Card>
      )}

      {/* Verified Status */}
      {verificationStatus === "verified" && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Complete</CardTitle>
            <CardDescription>Your identity has been successfully verified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-green-500/20 p-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium">Verification Successful</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Congratulations! Your identity has been successfully verified. You now have full access to all features
                of the BitRadex platform.
              </p>
              <div className="w-full max-w-md mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Verification Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Verification Level:</span>
                    <span>Level 2 (Full Access)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-bitradex-orange hover:bg-bitradex-orange/90"
            >
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Rejected Status */}
      {verificationStatus === "rejected" && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Rejected</CardTitle>
            <CardDescription>Your verification submission was not approved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-red-500/20 p-4">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-medium">Verification Unsuccessful</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Unfortunately, your verification submission was not approved. Please review the feedback below and
                resubmit your verification.
              </p>
              <div className="w-full max-w-md mt-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Rejection Reason:</h4>
                <p className="text-sm text-muted-foreground">
                  The document provided was unclear or illegible. Please ensure your documents are clearly visible and
                  all information is readable.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => {
                setVerificationStatus("unverified")
                setActiveStep(1)
              }}
              className="bg-bitradex-orange hover:bg-bitradex-orange/90"
            >
              Resubmit Verification
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
