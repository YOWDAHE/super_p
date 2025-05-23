"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Building2, Search, UserIcon, CheckCircle, Trash2, MoreVertical, Eye, X, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types"
import { fetchOrganizations, deleteOrganization, verifyOrganization } from "@/lib/api"

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [organizations, setOrganizations] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [approvedCount, setApprovedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)

  useEffect(() => {
    const getOrganizations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch organizations from our API
        const orgs = await fetchOrganizations()
        
        // Get counts for different verification statuses
        const pendingOrgs = orgs.filter(org => org.profile?.verification_status === "pending")
        const approvedOrgs = orgs.filter(org => org.profile?.verification_status === "approved")
        
        // Show all organizations in the main dashboard
        setOrganizations(orgs)
        setPendingCount(pendingOrgs.length)
        setApprovedCount(approvedOrgs.length)
      } catch (err) {
        console.error("Error fetching organizations:", err)
        setError("Failed to load organizations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getOrganizations()
  }, [])

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

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      await deleteOrganization(id);
      
      // Remove the organization from the local state
      setOrganizations(organizations.filter(org => org.id !== id));
      
      // Update counts
      const remainingOrgs = organizations.filter(org => org.id !== id);
      const pendingOrgs = remainingOrgs.filter(org => org.profile?.verification_status === "pending");
      const approvedOrgs = remainingOrgs.filter(org => org.profile?.verification_status === "approved");
      
      setPendingCount(pendingOrgs.length);
      setApprovedCount(approvedOrgs.length);

      toast({
        title: "Organization Deleted",
        description: "The organization has been successfully deleted.",
      });
    } catch (err) {
      console.error("Error deleting organization:", err);
      toast({
        title: "Error",
        description: "Failed to delete the organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'approved' | 'rejected' | 'pending') => {
    setIsProcessing(true);
    try {
      await verifyOrganization(id, newStatus);
      
      // Update the organization status in local state
      setOrganizations(organizations.map(org => {
        if (org.id === id) {
          return {
            ...org,
            profile: org.profile ? {
              ...org.profile,
              verification_status: newStatus
            } : null
          };
        }
        return org;
      }));

      // Update counts
      const updatedOrgs = organizations.map(org => 
        org.id === id ? { ...org, profile: { ...org.profile, verification_status: newStatus } } : org
      );
      const pendingOrgs = updatedOrgs.filter(org => org.profile?.verification_status === "pending");
      const approvedOrgs = updatedOrgs.filter(org => org.profile?.verification_status === "approved");
      
      setPendingCount(pendingOrgs.length);
      setApprovedCount(approvedOrgs.length);

      const actionMap = {
        approved: "approved",
        rejected: "rejected",
        pending: "revoked"
      };

      toast({
        title: `Organization ${actionMap[newStatus]}`,
        description: `The organization has been ${actionMap[newStatus]}.`,
        variant: newStatus === 'rejected' ? "destructive" : "default"
      });

      handleCloseModal();
    } catch (err) {
      console.error(`Error updating organization status:`, err);
      toast({
        title: "Error",
        description: "Failed to update the organization status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${org.first_name} ${org.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to get the appropriate badge for each verification status
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Approved</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case "denied":
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <Toaster />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            All Organizations
          </h1>
          <p className="text-slate-500">View and manage all organizations using Pulcity</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search organizations..."
              className="w-full pl-8 md:w-[250px] lg:w-[300px] border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/approved">
              <Button variant="outline" className="flex items-center gap-1.5 border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <CheckCircle className="h-4 w-4" />
                <span>Approved</span>
              </Button>
            </Link>
            <Link href="/dashboard/pending">
              <Button variant="outline" className="flex items-center gap-1.5 border-slate-200 hover:bg-yellow-50 hover:text-yellow-600 transition-colors">
                <UserIcon className="h-4 w-4" />
                <span>Pending</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="w-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs opacity-75">All registered organizations</p>
          </CardContent>
        </Card>
        <Card className="w-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Organizations</CardTitle>
            <CheckCircle className="h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs opacity-75">Verified organizations</p>
          </CardContent>
        </Card>
        <Card className="w-full overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <UserIcon className="h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs opacity-75">Awaiting verification</p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full shadow-lg border-0">
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <CardTitle className="text-lg font-semibold text-slate-800">All Organizations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <p>Loading organizations...</p>
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
                    <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    <TableHead className="font-semibold text-slate-700">Phone</TableHead>
                    <TableHead className="font-semibold text-slate-700">Joined on</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="w-[50px] font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map((org) => (
                      <TableRow key={org.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-medium text-slate-900">{org.profile?.name || "N/A"}</TableCell>
                        <TableCell className="text-slate-600">{org.email}</TableCell>
                        <TableCell className="text-slate-600">{org.profile?.contact_phone || "N/A"}</TableCell>
                        <TableCell className="text-slate-600">
                          {org.profile?.created_at 
                            ? new Date(org.profile.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"
                          }
                        </TableCell>
                        <TableCell>{getStatusBadge(org.profile?.verification_status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-slate-100"
                                disabled={isProcessing}
                              >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              {org.profile?.verification_id && (
                                <DropdownMenuItem
                                  onClick={() => handleViewVerification(org.profile?.verification_id || null, org.id)}
                                  className="text-slate-600 hover:text-blue-600 cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View ID
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(org.id, org.profile?.name || org.email)}
                                className="text-red-600 hover:text-red-700 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                        {loading ? "Loading..." : "No organizations found"}
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
              {selectedOrgId && organizations.find(org => org.id === selectedOrgId)?.profile?.verification_status === 'approved' ? (
                <Button 
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg transition-all hover:shadow-xl" 
                  onClick={() => handleStatusChange(selectedOrgId, 'pending')}
                  disabled={isProcessing}
                >
                  <UserIcon className="h-4 w-4" />
                  Revoke Approval
                </Button>
              ) : (
                <>
                  <Button 
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all hover:shadow-xl" 
                    onClick={() => selectedOrgId && handleStatusChange(selectedOrgId, 'approved')}
                    disabled={isProcessing}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button 
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:shadow-xl" 
                    onClick={() => selectedOrgId && handleStatusChange(selectedOrgId, 'rejected')}
                    disabled={isProcessing}
                  >
                    <XCircle className="h-4 w-4" />
                    Deny
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
