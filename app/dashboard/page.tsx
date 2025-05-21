"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Search, UserIcon, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types"
import { fetchOrganizations } from "@/lib/api"

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [organizations, setOrganizations] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [approvedCount, setApprovedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

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
			<div className="w-full space-y-6">
				<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">All Organizations</h1>
						<p className="text-muted-foreground">
							View and manage all organizations using Pulcity
						</p>
					</div>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search organizations..."
								className="w-full pl-8 md:w-[250px] lg:w-[300px]"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex gap-2">
							<Link href="/dashboard/approved">
								<Button variant="outline" className="flex items-center gap-1.5">
									<CheckCircle className="h-4 w-4" />
									<span>Approved</span>
								</Button>
							</Link>
							<Link href="/dashboard/pending">
								<Button variant="outline" className="flex items-center gap-1.5">
									<UserIcon className="h-4 w-4" />
									<span>Pending</span>
								</Button>
							</Link>
						</div>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<Card className="w-full">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Organizations
							</CardTitle>
							<Building2 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{organizations.length}</div>
							<p className="text-xs text-muted-foreground">
								All registered organizations
							</p>
						</CardContent>
					</Card>
					<Card className="w-full">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Approved Organizations
							</CardTitle>
							<CheckCircle className="h-4 w-4 text-green-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{approvedCount}</div>
							<p className="text-xs text-muted-foreground">Verified organizations</p>
						</CardContent>
					</Card>
					<Card className="w-full">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Pending Verifications
							</CardTitle>
							<UserIcon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{pendingCount}</div>
							<p className="text-xs text-muted-foreground">Awaiting verification</p>
						</CardContent>
					</Card>
				</div>

				<Card className="w-full">
					<CardHeader>
						<CardTitle>All Organizations</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="flex justify-center py-8">
								<p>Loading organizations...</p>
							</div>
						) : error ? (
							<div className="flex justify-center py-8 text-red-500">
								<p>{error}</p>
							</div>
						) : (
							<div className="w-full overflow-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Phone</TableHead>
											<TableHead>Joined on</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredOrganizations.length > 0 ? (
											filteredOrganizations.map((org) => (
												<TableRow key={org.id}>
													<TableCell className="font-medium">
														{org.profile?.name || "N/A"}
													</TableCell>
													<TableCell>{org.email}</TableCell>
													<TableCell>{org.profile?.contact_phone || "N/A"}</TableCell>
													<TableCell>
														{org.profile?.created_at 
                              ? new Date(org.profile.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"
                            }
													</TableCell>
													<TableCell>
														{getStatusBadge(org.profile?.verification_status)}
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={6} className="text-center">
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
			</div>
		);
}
