"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Eye, CheckCircle, XCircle, X, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { User } from "@/types"
import { fetchOrganizations, verifyOrganization } from "@/lib/api"

export default function PendingVerificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pendingOrgs, setPendingOrgs] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const getPendingOrganizations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all organizations from our API
        const orgs = await fetchOrganizations()
        
        // Filter organizations with pending verification status
        const pendingOnly = orgs.filter(org => 
          org.profile?.verification_status === "pending" && 
          org.role === "organization"
        )
        
        setPendingOrgs(pendingOnly)
      } catch (err) {
        console.error("Error fetching pending organizations:", err)
        setError("Failed to load pending organizations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getPendingOrganizations()
  }, [])

  const filteredOrganizations = pendingOrgs.filter(
    (org) =>
      org.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${org.first_name} ${org.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewVerification = (verificationId: string | null, orgId: number) => {
    if (!verificationId) {
      toast({
        title: "No verification ID",
        description: "This organization doesn't have a verification ID.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedImage(verificationId)
    setSelectedOrgId(orgId)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
    setSelectedOrgId(null)
  }

  const handleApprove = async () => {
    if (!selectedOrgId) return

    setIsProcessing(true)
    try {
      // Call the API to approve the organization
      await verifyOrganization(selectedOrgId, 'approved')

      // Remove the organization from the pending list
      setPendingOrgs(pendingOrgs.filter((org) => org.id !== selectedOrgId))

      toast({
        title: "Organization Approved",
        description: "The organization has been successfully verified.",
      })

      handleCloseModal()
    } catch (err) {
      console.error("Error approving organization:", err)
      toast({
        title: "Error",
        description: "Failed to approve the organization. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeny = async () => {
    if (!selectedOrgId) return

    setIsProcessing(true)
    try {
      // Call the API to reject the organization
      await verifyOrganization(selectedOrgId, 'rejected')

      // Remove the organization from the pending list
      setPendingOrgs(pendingOrgs.filter((org) => org.id !== selectedOrgId))

      toast({
        title: "Organization Rejected",
        description: "The organization verification has been rejected.",
        variant: "destructive",
      })

      handleCloseModal()
    } catch (err) {
      console.error("Error rejecting organization:", err)
      toast({
        title: "Error",
        description: "Failed to reject the organization. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <Toaster />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-orange-600 text-transparent bg-clip-text">
            Pending Verifications
          </h1>
          <p className="text-slate-500">Review and verify organizations waiting for approval</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search pending organizations..."
            className="w-full pl-8 md:w-[250px] lg:w-[300px] border-slate-200 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="w-full overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Organizations</CardTitle>
          <UserIcon className="h-4 w-4 opacity-75" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrgs.length}</div>
          <p className="text-xs opacity-75">Organizations awaiting verification</p>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg border-0">
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <CardTitle className="text-lg font-semibold text-slate-800">Organizations Awaiting Verification</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent"></div>
                <p>Loading pending organizations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Name</TableHead>
                    <TableHead className="font-semibold text-slate-700">Contact Number</TableHead>
                    <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    <TableHead className="font-semibold text-slate-700">Date Joined</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="w-[50px] font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map((org) => (
                      <TableRow key={org.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-medium text-slate-900">{org.profile?.name || "N/A"}</TableCell>
                        <TableCell className="text-slate-600">{org.profile?.contact_phone || "N/A"}</TableCell>
                        <TableCell className="text-slate-600">{org.email}</TableCell>
                        <TableCell className="text-slate-600">
                          {org.date_joined ? 
                            new Date(org.date_joined).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }) : 
                            "N/A"
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          {org.profile?.verification_id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-slate-100"
                              onClick={() => handleViewVerification(org.profile?.verification_id || null, org.id)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                        {loading ? "Loading..." : "No pending organizations found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="relative max-h-screen max-w-screen-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              onClick={handleCloseModal}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="relative h-[80vh] w-[90vw] max-w-4xl bg-slate-100">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Verification Document"
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-4">
              <Button 
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all hover:shadow-xl" 
                onClick={handleApprove}
                disabled={isProcessing}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button 
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:shadow-xl" 
                onClick={handleDeny}
                disabled={isProcessing}
              >
                <XCircle className="h-4 w-4" />
                Deny
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
